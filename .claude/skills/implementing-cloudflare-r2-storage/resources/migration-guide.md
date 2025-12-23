# Migration Guide: From Other Storage to R2

## Migrating from AWS S3

### Schema Mapping

| S3 Concept | R2 Equivalent | Notes |
|-----------|---------------|-------|
| Bucket | Bucket | Same concept |
| Object Key | Object Key | Same format |
| Access Key | Access Key | Different credentials |
| Region | Location | R2 uses automatic routing |
| ACLs | Public Access | Simpler model |

### Code Changes

**S3 SDK:**
```typescript
const s3 = new S3Client({ region: 'us-east-1' });
await s3.send(new PutObjectCommand({ /* ... */ }));
```

**R2 with Convex:**
```typescript
const r2 = new R2(components.r2);
await r2.store(ctx, blob, { key, type });
```

### Environment Variables

**Before (S3):**
```env
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
S3_BUCKET=my-bucket
```

**After (R2):**
```env
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_BUCKET=my-bucket
CDN_CUSTOM_DOMAIN=https://cdn.mydomain.com
```

### URL Format Changes

**Before:** `https://my-bucket.s3.amazonaws.com/path/to/file.jpg`

**After:** `https://cdn.mydomain.com/path/to/file.jpg`

### Migration Script

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";
import { R2 } from "@convex-dev/r2";
import { S3Client, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const migrateFromS3 = action({
  args: {
    s3Bucket: v.string(),
    prefix: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const r2 = new R2(components.r2);

    // List S3 objects
    const listResponse = await s3.send(new ListObjectsV2Command({
      Bucket: args.s3Bucket,
      Prefix: args.prefix,
      MaxKeys: args.limit || 1000,
    }));

    const results = [];

    for (const object of listResponse.Contents || []) {
      try {
        // Get object from S3
        const getResponse = await s3.send(new GetObjectCommand({
          Bucket: args.s3Bucket,
          Key: object.Key!,
        }));

        const blob = await getResponse.Body?.transformToWebStream();

        // Store in R2
        await r2.store(ctx, blob, {
          key: object.Key!,
          type: getResponse.ContentType,
        });

        results.push({ key: object.Key!, success: true });
      } catch (error) {
        results.push({
          key: object.Key!,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  },
});
```

---

## Migrating from Vercel Blob

### Key Differences

| Vercel Blob | Cloudflare R2 |
|------------|---------------|
| Simple upload API | Full S3 API |
| Auto CDN | Manual CDN setup |
| Serverless-first | Universal |
| Higher cost | Lower cost |

### Code Migration

**Before (Vercel Blob):**
```typescript
import { put } from '@vercel/blob';

const blob = await put('file.jpg', file, {
  access: 'public',
});
```

**After (R2):**
```typescript
const r2 = new R2(components.r2);
const key = await r2.store(ctx, file, {
  key: 'file.jpg',
  type: file.type,
});
```

### URL Migration

**Before:** `https://xyz.public.blob.vercel-storage.com/file.jpg`

**After:** `https://cdn.yourdomain.com/file.jpg`

Update all database URLs:
```typescript
export const migrateVercelBlobUrls = mutation({
  handler: async (ctx) => {
    const files = await ctx.db.query("files").collect();

    for (const file of files) {
      if (file.url.includes('blob.vercel-storage.com')) {
        const filename = file.url.split('/').pop();
        const newUrl = `${process.env.CDN_CUSTOM_DOMAIN}/${file.r2Key}`;

        await ctx.db.patch(file._id, { url: newUrl });
      }
    }
  },
});
```

---

## Migrating from Firebase Storage

### Schema Changes

**Before (Firebase):**
```typescript
const storageRef = ref(storage, 'images/file.jpg');
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

**After (R2):**
```typescript
const r2 = new R2(components.r2);
const key = await r2.store(ctx, file, {
  key: 'images/file.jpg',
  type: file.type,
});
const url = `${process.env.CDN_CUSTOM_DOMAIN}/${key}`;
```

### Security Rules Migration

**Firebase Rules:**
```
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

**R2 with Convex:**
```typescript
checkUpload: async (ctx, bucket) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  // Additional checks based on file path
  const userId = extractUserIdFromKey(key);
  if (userId !== identity.subject) {
    throw new Error("Cannot upload to another user's folder");
  }
},
```

---

## General Migration Checklist

- [ ] Create R2 bucket
- [ ] Set up environment variables
- [ ] Install @convex-dev/r2 package
- [ ] Update Convex configuration
- [ ] Migrate database schema
- [ ] Update backend functions
- [ ] Update frontend components
- [ ] Set up CDN domain
- [ ] Configure CORS
- [ ] Run migration script for existing files
- [ ] Update all file URLs in database
- [ ] Test uploads and downloads
- [ ] Update documentation
- [ ] Monitor costs and usage
- [ ] Decommission old storage
