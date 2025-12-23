---
name: Implementing Cloudflare R2 Storage
description: Complete implementation of Cloudflare R2 object storage with Convex backend and Next.js frontend. Covers bucket setup, CDN configuration, file upload/download, and both public and private access patterns. Use when adding cloud storage capabilities to a Convex + Next.js application for images, videos, documents, or any file type.
tags: [cloudflare, r2, convex, nextjs, storage, cdn, upload]
---

# Implementing Cloudflare R2 Storage

Complete guide for integrating Cloudflare R2 object storage with Convex and Next.js. This skill provides a production-ready implementation for file storage with CDN delivery.

## When to Use This Skill

- Adding file upload/storage to a Convex + Next.js app
- Storing media files (images, videos, audio)
- Managing user-generated content
- Implementing document storage
- Need CDN delivery for static assets
- Requiring scalable, cost-effective object storage

## Prerequisites

- Convex + Next.js project already set up
- Cloudflare account (free tier works)
- Basic understanding of S3-compatible storage

## Architecture Overview

```
User Upload → Next.js Frontend → Convex Backend → R2 Storage
                                                       ↓
User Access ← Cloudflare CDN ←────────────────────────┘
```

**Benefits:**
- No egress fees (Cloudflare advantage over AWS S3)
- Global CDN delivery
- S3-compatible API
- Simple authentication
- Cost-effective ($0.015/GB/month)

---

## Implementation Overview

This implementation consists of 4 main parts:

1. **Cloudflare R2 Setup** - Create bucket, configure CDN, set permissions
2. **Convex Backend** - Install component, configure storage functions
3. **Frontend Integration** - React hooks and components for file upload
4. **Testing & Verification** - Ensure everything works correctly

**Time Estimate:** 15-30 minutes for basic setup, 2-4 hours for full production implementation

---

## Part 1: Cloudflare R2 Setup

### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **R2**
2. Click **Create bucket**
3. Choose bucket name (e.g., `myapp-storage`, `myapp-media`)
4. Select location (Automatic recommended)
5. Click **Create bucket**

### Step 2: Generate API Credentials

1. In R2 section, go to **Manage R2 API Tokens**
2. Click **Create API token**
3. Set permissions: **Object Read & Write**
4. Save credentials securely:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL
   - Account ID

### Step 3: Choose Access Pattern

**Option A: Public CDN URLs** (Recommended for public content)
- Best for: public media, user profiles, product images
- Pros: Simple, fast, no expiration, excellent caching
- Setup: Enable public access and connect custom domain

**Option B: Presigned URLs** (For private content)
- Best for: user documents, private files, sensitive data
- Pros: Secure, time-limited access
- Setup: No public access needed

### Step 4: Enable Public Access (if using CDN)

1. Go to bucket → **Settings** → **Public access**
2. Click **Allow Access**
3. Click **Connect Domain**
4. Enter custom domain: `storage.yourdomain.com` or `cdn.yourdomain.com`
5. Cloudflare auto-configures DNS and SSL

### Step 5: Configure CORS

Add CORS policy to allow uploads from your domain. Include:
- Your production domains
- Development ports (localhost:3000, etc.)
- Required HTTP methods: GET, PUT, DELETE, HEAD

See [resources/quick-reference.md](resources/quick-reference.md#cors-configuration) for the exact CORS configuration.

---

## Part 2: Convex Backend Setup

### Step 1: Install Convex R2 Component

```bash
npm install @convex-dev/r2
```

### Step 2: Configure Environment Variables

Set these environment variables in both `.env.local` and Convex deployment:

**Required:**
- `R2_ACCESS_KEY_ID` - From Step 1.2
- `R2_SECRET_ACCESS_KEY` - From Step 1.2
- `R2_ENDPOINT` - Your R2 endpoint URL
- `R2_BUCKET` - Your bucket name
- `R2_ACCOUNT_ID` - Your Cloudflare account ID

**Optional:**
- `CDN_CUSTOM_DOMAIN` - For public CDN URLs (e.g., `https://storage.yourdomain.com`)
- `R2_PUBLIC_URL` - For presigned URLs (fallback)

See [resources/quick-reference.md](resources/quick-reference.md#environment-variables) for setup commands.

### Step 3: Update Convex Configuration

Create or update `convex/convex.config.ts` to use the R2 component.

See [resources/quick-reference.md](resources/quick-reference.md#convex-configuration) for the configuration code.

### Step 4: Define Database Schema

Add a `files` table to your schema with:
- Entity references (entityId, entityType)
- File storage info (r2Key, url)
- Metadata (contentType, size, filename)
- Optional fields (thumbnail, title, description, tags)
- Timestamps and user tracking

**Customize the schema** for your specific use case:
- Rename table to match your needs (`images`, `videos`, `documents`)
- Add/remove fields based on requirements
- Adjust indexes for your query patterns

See [resources/quick-reference.md](resources/quick-reference.md#database-schema) for the complete schema definition.

### Step 5: Create Storage Functions

Create `convex/storage.ts` with:

**Core Functions:**
- `generateUploadUrl` - Generate presigned upload URL
- `deleteObject` - Delete file from R2
- `getEntityFiles` - Query files by entity
- `deleteFile` - Delete file with database cleanup
- `generateFileKey` - Create organized file paths
- `uploadFromUrl` - Upload from external URL (for scraping)

**Key Considerations:**
- Add authentication checks in `checkUpload`
- Use `onUpload` callback to create database records
- Use `onDelete` callback to clean up database
- Choose between public CDN URLs or presigned URLs
- Implement file validation and user quotas

See [resources/quick-reference.md](resources/quick-reference.md#storage-functions) for complete implementation.

---

## Part 3: Frontend Implementation

### Step 1: Create Upload Hook

Create `hooks/useFileUpload.ts` with:

**Features:**
- File validation (size, type)
- Upload progress tracking
- Error handling
- Multiple file support
- Configurable options

**Exports:**
- `useFileUpload` - Main upload hook
- `useFileManagement` - Delete/manage files

See [resources/quick-reference.md](resources/quick-reference.md#upload-hook) for the complete hook implementation.

### Step 2: Create File Upload Component

Create `components/FileUpload.tsx` with:

**Features:**
- Drag and drop support
- File selection dialog
- Upload progress display
- Validation feedback
- Error messages

See [resources/quick-reference.md](resources/quick-reference.md#upload-component) for the complete component.

### Step 3: Create File Viewer Component

Create `components/FileViewer.tsx` with:

**Features:**
- Grid layout for files
- Image/video previews
- Download buttons
- Delete functionality
- File metadata display

See [resources/quick-reference.md](resources/quick-reference.md#viewer-component) for the complete component.

---

## Part 4: Testing & Verification

### Create Test Page

Create `app/test-storage/page.tsx` to test:
- File upload functionality
- Progress tracking
- File display and preview
- Delete operations
- Error handling

### Testing Checklist

Verify all functionality works:

1. ✅ Files upload successfully
2. ✅ Files appear in Cloudflare R2 bucket
3. ✅ Database records created correctly
4. ✅ Files display with correct URLs
5. ✅ Public CDN URLs work (if applicable)
6. ✅ Delete functionality works
7. ✅ CORS headers allow uploads
8. ✅ File validation works (size, type)
9. ✅ Progress tracking displays correctly
10. ✅ Error messages show properly

---

## Common Customizations

### File Type Specific Implementations

**Images/Photos:**
- Image processing and resizing
- Thumbnail generation
- Aspect ratio validation
- Format conversion

**Videos:**
- Large file handling (500MB+)
- Thumbnail extraction
- Duration metadata
- Transcoding pipelines

**Documents:**
- PDF/DOCX/XLSX support
- Document previews
- Version control
- Virus scanning

**User Avatars:**
- Single file per user
- Auto-replace on upload
- Square aspect ratio enforcement
- Size optimization

See [resources/example-use-cases.md](resources/example-use-cases.md) for 6 complete real-world implementations.

### Storage Organization Patterns

Choose a pattern that fits your use case:

**By User:** `users/{userId}/avatar.jpg`
**By Feature:** `posts/{postId}/images/{image}.jpg`
**By Date:** `uploads/2024/01/15/{file}`
**By Hash:** `files/{hash}-{filename}.ext`

---

## Advanced Features

For advanced implementations, see:

**Image Processing:**
- Automatic resizing and optimization
- Multiple size variants
- Thumbnail generation
- Format conversion

**Batch Operations:**
- Multiple file uploads
- Bulk delete operations
- Progress tracking across files

**User Quotas:**
- Storage limits per user
- Upload count limits
- Bandwidth tracking

**Background Processing:**
- Async file processing
- Video transcoding queues
- Thumbnail generation pipelines

See [resources/advanced-patterns.md](resources/advanced-patterns.md) for detailed implementations.

---

## Security Best Practices

### 1. Authentication
- Always check `ctx.auth.getUserIdentity()` in mutations
- Verify user owns the resource before delete/update
- Implement role-based access control if needed

### 2. File Validation
- Validate file types (MIME types)
- Set file size limits
- Sanitize filenames (remove special characters)
- Check for malicious content

### 3. Access Control
- Use presigned URLs for sensitive files
- Set appropriate CORS policies (don't allow all origins in production)
- Implement rate limiting to prevent abuse
- Add user quotas to prevent storage abuse

### 4. Environment Variables
- Never commit API keys to git
- Use different buckets for dev/prod
- Rotate credentials regularly
- Use environment-specific domains

---

## Troubleshooting

### Files not uploading
- Check environment variables are set correctly in Convex
- Verify CORS configuration includes your domain
- Check browser console for errors
- Ensure authentication is working

### URLs not working
- Verify `CDN_CUSTOM_DOMAIN` is set correctly
- Check custom domain is active in Cloudflare dashboard
- Ensure public access is enabled (for public files)
- Test URLs in incognito mode (cache issues)

### Slow uploads
- Check file sizes are reasonable
- Verify network connection
- Consider chunked uploads for large files
- Compress files before upload (especially images)

### CORS errors
- Update CORS policy to include all domains
- Add all development ports
- Include all required HTTP methods
- Clear browser cache and test again

### Database issues
- Check indexes are set up correctly
- Verify entity relationships
- Ensure file cleanup on delete works

---

## Cost Estimation

**Cloudflare R2 Pricing:**
- Storage: $0.015 per GB/month
- Class A operations (writes): $4.50 per million
- Class B operations (reads): $0.36 per million
- **No egress fees** (major advantage over S3!)

**Example scenarios:**
- 100 GB storage + 1M reads + 10K writes: ~$2/month
- 1 TB storage + 10M reads + 100K writes: ~$18.60/month
- 10 TB storage + 100M reads + 1M uploads: ~$186/month

**Comparison to AWS S3:**
- Same 1TB example on S3: ~$115/month (due to egress fees)
- R2 savings: **84% cheaper** for high-traffic applications

---

## Migration from Other Services

Already using another storage service? Migration guides available:

- **From AWS S3** - Compatible API, easy migration
- **From Vercel Blob** - Similar architecture, straightforward switch
- **From Firebase Storage** - Different patterns, migration scripts provided
- **From Supabase Storage** - API differences, adapter patterns included

See [resources/migration-guide.md](resources/migration-guide.md) for step-by-step migration instructions.

---

## Additional Resources

### Code References
- [resources/quick-reference.md](resources/quick-reference.md) - Complete code examples and commands
- [resources/advanced-patterns.md](resources/advanced-patterns.md) - Advanced features and patterns
- [resources/example-use-cases.md](resources/example-use-cases.md) - 6 real-world implementations
- [resources/migration-guide.md](resources/migration-guide.md) - Migration from other services

### External Documentation
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Convex R2 Component](https://github.com/get-convex/convex-helpers/tree/main/packages/r2)
- [Next.js File Upload Best Practices](https://nextjs.org/docs)

---

## Quick Start (5 Minutes)

For the fastest possible setup:

1. **Cloudflare:** Create bucket, get credentials, enable public access
2. **Install:** `npm install @convex-dev/r2`
3. **Configure:** Set environment variables in Convex
4. **Backend:** Add R2 component to `convex.config.ts`
5. **Schema:** Add files table with basic fields
6. **Functions:** Copy storage functions from [quick-reference.md](resources/quick-reference.md)
7. **Frontend:** Use upload hook and components from examples
8. **Test:** Create test page and verify uploads work

See [resources/quick-reference.md](resources/quick-reference.md#quick-start) for a streamlined 5-minute setup guide.

---

## Success Criteria

You've successfully implemented R2 storage when:

✅ Files upload from your frontend to Cloudflare R2
✅ Database records are created automatically
✅ Files display with correct URLs (CDN or presigned)
✅ Delete functionality removes both file and database record
✅ CORS allows uploads from your domains
✅ Authentication prevents unauthorized uploads
✅ File validation works (size, type checks)
✅ Error handling provides clear feedback
✅ Production deployment works without issues

---

## Support & Next Steps

**Common Next Steps:**
1. Implement image processing and optimization
2. Add video thumbnail generation
3. Set up user storage quotas
4. Implement batch upload functionality
5. Add file versioning or history

**For Help:**
- Reference the resources/ folder for code examples
- Check troubleshooting section for common issues
- Review real-world examples in example-use-cases.md
- Consult Cloudflare R2 and Convex documentation

---

**Version:** 1.0 (Production Ready)
**Last Updated:** October 2024
**Complexity:** Intermediate
**Time to Implement:** 15 minutes - 4 hours (depending on features)
