# Advanced R2 Storage Patterns

## Pattern 1: Image Processing Pipeline

Automatically resize and optimize images on upload.

### Backend: `convex/imageProcessing.ts`

```typescript
import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { R2 } from "@convex-dev/r2";
import { components, internal } from "./_generated/api";

const r2 = new R2(components.r2);

export const processImage = action({
  args: {
    r2Key: v.string(),
    sizes: v.array(v.object({
      name: v.string(),
      width: v.number(),
      height: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    // Fetch original image from R2
    const imageBlob = await fetch(`${process.env.CDN_CUSTOM_DOMAIN}/${args.r2Key}`).then(r => r.blob());

    // Process each size (use sharp, jimp, or browser APIs)
    const processedImages = [];

    for (const size of args.sizes) {
      // Example with browser Image API (for client-side processing)
      // For server-side, use sharp or similar library
      const processedKey = args.r2Key.replace(/(\.[^.]+)$/, `_${size.name}$1`);

      // Store processed image
      await r2.store(ctx, imageBlob, {
        key: processedKey,
        type: imageBlob.type,
      });

      processedImages.push({
        size: size.name,
        key: processedKey,
        url: `${process.env.CDN_CUSTOM_DOMAIN}/${processedKey}`,
      });
    }

    // Update database with processed versions
    await ctx.runMutation(internal.imageProcessing.updateImageVersions, {
      originalKey: args.r2Key,
      versions: processedImages,
    });

    return processedImages;
  },
});

export const updateImageVersions = internalMutation({
  args: {
    originalKey: v.string(),
    versions: v.array(v.object({
      size: v.string(),
      key: v.string(),
      url: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("files")
      .withIndex("by_r2_key", q => q.eq("r2Key", args.originalKey))
      .unique();

    if (file) {
      await ctx.db.patch(file._id, {
        versions: args.versions,
      });
    }
  },
});
```

## Pattern 2: Direct Upload with Progress

Client-side direct upload to R2 with fine-grained progress.

```typescript
export async function uploadWithProgress(
  file: File,
  uploadUrl: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

## Pattern 3: Batch Operations

Efficiently process multiple files.

```typescript
export const batchUploadFromUrls = action({
  args: {
    urls: v.array(v.string()),
    entityType: v.string(),
    entityId: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    const results = await Promise.allSettled(
      args.urls.map(url =>
        ctx.runAction(api.storage.uploadFromUrl, {
          url,
          entityType: args.entityType,
          entityId: args.entityId,
          fileType: args.fileType,
        })
      )
    );

    return {
      total: args.urls.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      results,
    };
  },
});
```

## Pattern 4: Streaming Large Files

For files larger than 500MB, use chunked uploads.

```typescript
export const initiateMultipartUpload = action({
  args: {
    filename: v.string(),
    contentType: v.string(),
    entityType: v.string(),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate key
    const key = `${args.entityType}/${args.entityId}/large/${Date.now()}-${args.filename}`;

    // Create upload ID (store in database)
    const uploadId = await ctx.runMutation(internal.storage.createMultipartUpload, {
      key,
      contentType: args.contentType,
      entityType: args.entityType,
      entityId: args.entityId,
    });

    return { uploadId, key };
  },
});

// Client would then upload parts and call completeMultipartUpload
```

## Pattern 5: Automatic Cleanup

Remove orphaned files and old uploads.

```typescript
export const cleanupOrphanedFiles = action({
  handler: async (ctx) => {
    // Get all R2 keys
    const files = await ctx.runQuery(api.storage.getAllFiles);
    const dbKeys = new Set(files.map(f => f.r2Key));

    // List all objects in R2
    const r2Objects = await r2.listObjects(ctx, {
      prefix: "",
      limit: 1000,
    });

    // Find orphaned objects (in R2 but not in DB)
    const orphaned = r2Objects.filter(obj => !dbKeys.has(obj.key));

    // Delete orphaned objects older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    for (const obj of orphaned) {
      if (obj.uploaded < sevenDaysAgo) {
        await r2.deleteObject(ctx, obj.key);
      }
    }

    return {
      scanned: r2Objects.length,
      orphaned: orphaned.length,
      deleted: orphaned.filter(o => o.uploaded < sevenDaysAgo).length,
    };
  },
});
```

## Pattern 6: User Quotas

Enforce storage limits per user.

```typescript
export const checkUserQuota = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_uploaded_by", q => q.eq("uploadedBy", args.userId))
      .collect();

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const quota = 1024 * 1024 * 1024; // 1GB

    return {
      used: totalSize,
      quota,
      remaining: quota - totalSize,
      percentUsed: (totalSize / quota) * 100,
      canUpload: totalSize < quota,
    };
  },
});
```

## Pattern 7: Temporary URLs for Private Files

Generate time-limited access URLs.

```typescript
export const generateTemporaryUrl = action({
  args: {
    fileId: v.id("files"),
    expiresIn: v.optional(v.number()), // seconds
  },
  handler: async (ctx, args) => {
    const file = await ctx.runQuery(api.storage.getFile, {
      fileId: args.fileId,
    });

    if (!file) throw new Error("File not found");

    // Check if user has access (implement your logic)
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Generate presigned URL
    const expiresIn = args.expiresIn || 3600; // 1 hour default
    const signedUrl = await r2.getUrl(file.r2Key, { expiresIn });

    return {
      url: signedUrl,
      expiresAt: Date.now() + (expiresIn * 1000),
    };
  },
});
```

## Pattern 8: Metadata Extraction

Extract and store metadata from files.

```typescript
export const extractMetadata = action({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.runQuery(api.storage.getFile, { fileId: args.fileId });
    if (!file) throw new Error("File not found");

    let metadata: any = {};

    // For images: extract dimensions, EXIF data
    if (file.contentType.startsWith('image/')) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const image = await createImageBitmap(blob);

      metadata = {
        width: image.width,
        height: image.height,
        aspectRatio: image.width / image.height,
      };
    }

    // For videos: extract duration, dimensions, codec
    if (file.contentType.startsWith('video/')) {
      // Use ffprobe or similar tool
      metadata = {
        duration: 0, // Extract from video
        width: 0,
        height: 0,
        codec: '',
      };
    }

    // Store metadata
    await ctx.runMutation(internal.storage.updateFileMetadata, {
      fileId: args.fileId,
      metadata,
    });

    return metadata;
  },
});
```

## Pattern 9: CDN Cache Control

Set cache headers for optimal performance.

```typescript
// In your R2 store operation, add cache control headers
await r2.store(ctx, blob, {
  key,
  type: blob.type,
  customMetadata: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year for immutable files
    // or
    'Cache-Control': 'public, max-age=3600', // 1 hour for frequently changing files
  },
});
```

## Pattern 10: Background Processing

Process files asynchronously after upload.

```typescript
// In onUpload callback
onUpload: async (ctx, bucket, key) => {
  // Create initial record
  const fileId = await ctx.db.insert("files", { /* ... */ });

  // Schedule background processing
  await ctx.scheduler.runAfter(0, api.storage.processFileBackground, {
    fileId,
    r2Key: key,
  });
},

// Background processor
export const processFileBackground = action({
  args: {
    fileId: v.id("files"),
    r2Key: v.string(),
  },
  handler: async (ctx, args) => {
    // Extract metadata
    await ctx.runAction(api.storage.extractMetadata, {
      fileId: args.fileId,
    });

    // Generate thumbnails for images
    const file = await ctx.runQuery(api.storage.getFile, { fileId: args.fileId });

    if (file?.contentType.startsWith('image/')) {
      await ctx.runAction(api.imageProcessing.processImage, {
        r2Key: args.r2Key,
        sizes: [
          { name: 'thumb', width: 150, height: 150 },
          { name: 'medium', width: 800 },
          { name: 'large', width: 1920 },
        ],
      });
    }

    // Mark as processed
    await ctx.runMutation(internal.storage.markAsProcessed, {
      fileId: args.fileId,
    });
  },
});
```
