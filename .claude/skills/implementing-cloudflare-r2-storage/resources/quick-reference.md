# R2 Storage Quick Reference

## 5-Minute Setup Checklist

### 1. Cloudflare Setup (2 minutes)
```bash
# Create bucket in Cloudflare dashboard
# Generate API credentials
# Enable public access (optional)
# Connect custom domain
```

### 2. Install Package (30 seconds)
```bash
npm install @convex-dev/r2
```

### 3. Environment Variables (1 minute)
```env
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
R2_BUCKET=bucket-name
CDN_CUSTOM_DOMAIN=https://cdn.yourdomain.com
```

```bash
# Set in Convex
npx convex env set R2_ACCESS_KEY_ID xxx
npx convex env set R2_SECRET_ACCESS_KEY xxx
npx convex env set R2_ENDPOINT https://account-id.r2.cloudflarestorage.com
npx convex env set R2_BUCKET bucket-name
npx convex env set CDN_CUSTOM_DOMAIN https://cdn.yourdomain.com
```

### 4. Configure Convex (1 minute)
```typescript
// convex/convex.config.ts
import { defineApp } from "convex/server";
import r2 from "@convex-dev/r2/convex.config";

const app = defineApp();
app.use(r2);
export default app;
```

### 5. Add Schema (30 seconds)
```typescript
// convex/schema.ts
files: defineTable({
  entityId: v.string(),
  entityType: v.string(),
  r2Key: v.string(),
  url: v.string(),
  contentType: v.string(),
  size: v.number(),
  uploadedAt: v.number(),
})
  .index("by_entity", ["entityType", "entityId"])
  .index("by_r2_key", ["r2Key"]),
```

---

## Essential Code Snippets

### Backend: Storage Functions
```typescript
// convex/storage.ts
import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";

const r2 = new R2(components.r2);

export const { generateUploadUrl, deleteObject } = r2.clientApi({
  checkUpload: async (ctx, bucket) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
  },
  onUpload: async (ctx, bucket, key) => {
    await ctx.db.insert("files", {
      r2Key: key,
      url: `${process.env.CDN_CUSTOM_DOMAIN}/${key}`,
      // ... other fields
    });
  },
});
```

### Frontend: Upload Hook
```typescript
// hooks/useFileUpload.ts
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "../convex/_generated/api";

export function useFileUpload(entityId: string) {
  const uploadFile = useUploadFile(api.storage.generateUploadUrl);

  const upload = async (file: File) => {
    const key = `entity/${entityId}/${Date.now()}-${file.name}`;
    await uploadFile({ file, path: key });
  };

  return { upload };
}
```

### Frontend: Upload Component
```typescript
// components/FileUpload.tsx
export function FileUpload({ entityId }: { entityId: string }) {
  const { upload } = useFileUpload(entityId);

  return (
    <input
      type="file"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) await upload(file);
      }}
    />
  );
}
```

---

## Common Commands

### R2 Management
```typescript
// Store file
await r2.store(ctx, blob, { key, type });

// Get URL
const url = await r2.getUrl(key, { expiresIn: 3600 });

// Delete file
await r2.deleteObject(ctx, key);

// List files
const files = await r2.listObjects(ctx, { prefix: "folder/" });

// Get metadata
const metadata = await r2.getMetadata(ctx, key);
```

### Database Operations
```typescript
// Create record
await ctx.db.insert("files", { /* ... */ });

// Query files
const files = await ctx.db
  .query("files")
  .withIndex("by_entity", q => q.eq("entityType", type).eq("entityId", id))
  .collect();

// Delete record
await ctx.db.delete(fileId);

// Update record
await ctx.db.patch(fileId, { /* ... */ });
```

---

## URL Patterns

### Public CDN URLs (Recommended)
```
Format: https://cdn.yourdomain.com/{key}
Example: https://cdn.yourdomain.com/users/123/avatar.jpg

Pros:
✓ No expiration
✓ Fast CDN delivery
✓ Simple implementation
✓ Better SEO

Use for: Public content, user avatars, product images
```

### Presigned URLs (Private)
```typescript
const url = await r2.getUrl(key, { expiresIn: 3600 });
// Format: https://bucket.r2.cloudflarestorage.com/{key}?signature=...

Pros:
✓ Secure access control
✓ Time-limited access
✓ Per-file permissions

Use for: Private documents, user files, sensitive content
```

---

## File Organization Patterns

### By User
```
users/{userId}/avatar.jpg
users/{userId}/documents/{filename}
```

### By Feature
```
posts/{postId}/images/{image}.jpg
products/{productId}/photos/{photo}.jpg
```

### By Type
```
images/avatars/{userId}.jpg
images/products/{productId}/{index}.jpg
videos/{videoId}/video.mp4
videos/{videoId}/thumbnail.jpg
```

### By Date
```
uploads/2024/01/15/{filename}
```

---

## Error Handling

### Common Errors
```typescript
try {
  await upload(file);
} catch (error) {
  if (error.message.includes("Unauthorized")) {
    // User not logged in
  } else if (error.message.includes("quota")) {
    // Storage quota exceeded
  } else if (error.message.includes("size")) {
    // File too large
  } else if (error.message.includes("type")) {
    // Invalid file type
  } else {
    // Generic error
  }
}
```

### Validation
```typescript
// Size check
if (file.size > 100 * 1024 * 1024) {
  throw new Error("File too large (max 100MB)");
}

// Type check
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error("Invalid file type");
}

// Filename sanitization
const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
```

---

## Performance Tips

### 1. Optimize Images Before Upload
```typescript
async function compressImage(file: File): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = await createImageBitmap(file);

  const maxSize = 1920;
  let { width, height } = img;

  if (width > maxSize || height > maxSize) {
    if (width > height) {
      height = (height / width) * maxSize;
      width = maxSize;
    } else {
      width = (width / height) * maxSize;
      height = maxSize;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise(resolve => canvas.toBlob(resolve!, 'image/jpeg', 0.85));
}
```

### 2. Lazy Load Files
```typescript
const files = useQuery(
  api.files.list,
  isVisible ? { entityId } : "skip"
);
```

### 3. Batch Operations
```typescript
await Promise.all(files.map(file => upload(file)));
```

### 4. Use CDN Cache Headers
```typescript
await r2.store(ctx, blob, {
  key,
  type,
  customMetadata: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
});
```

---

## Security Checklist

- [ ] Check authentication in `checkUpload`
- [ ] Validate file types and sizes
- [ ] Sanitize filenames
- [ ] Implement user quotas
- [ ] Use HTTPS for all URLs
- [ ] Set appropriate CORS policies
- [ ] Don't commit API keys to git
- [ ] Use presigned URLs for private files
- [ ] Rate limit uploads
- [ ] Scan for malicious content

---

## Testing

### Manual Tests
1. Upload file → Check appears in R2
2. View file → URL works
3. Delete file → Removed from R2 and DB
4. Upload large file → Progress tracking works
5. Upload invalid type → Error shown
6. Upload without auth → Rejected

### Automated Tests
```typescript
test("file upload", async () => {
  const file = new File(["test"], "test.txt");
  const result = await upload(file);

  expect(result.success).toBe(true);
  expect(result.url).toContain("cdn.yourdomain.com");
});
```

---

## Cost Calculator

**Monthly Storage:** `GB * $0.015`
**Monthly Reads:** `requests / 1,000,000 * $0.36`
**Monthly Writes:** `requests / 1,000,000 * $4.50`

**Example:**
- 500 GB storage
- 5M file views
- 100K uploads

Cost = (500 × $0.015) + (5 × $0.36) + (0.1 × $4.50) = **$9.75/month**

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Upload fails | Check env vars, auth, CORS |
| URLs don't work | Verify CDN domain is active |
| Files not appearing | Check onUpload callback |
| CORS errors | Update CORS policy |
| Slow uploads | Compress before upload |
| Quota exceeded | Implement cleanup job |

---

## Next Steps

After basic setup:
1. Add file type validation
2. Implement progress tracking
3. Add thumbnail generation
4. Set up cleanup jobs
5. Monitor usage and costs
6. Optimize for your use case
