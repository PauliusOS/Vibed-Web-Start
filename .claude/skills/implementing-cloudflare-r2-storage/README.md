# Cloudflare R2 Storage Implementation Skill

A comprehensive, production-ready skill for implementing Cloudflare R2 object storage with Convex and Next.js.

## What This Skill Covers

This skill provides everything needed to add cloud storage to a Convex + Next.js application:
- ✅ Complete setup guide (from 5 minutes to full production)
- ✅ Both public CDN and private access patterns
- ✅ Frontend and backend code templates
- ✅ File upload, download, and delete operations
- ✅ Security best practices
- ✅ Cost optimization
- ✅ Advanced patterns (image processing, batch operations, quotas)
- ✅ Real-world use case examples
- ✅ Migration guides from other services

## Skill Structure

```
implementing-cloudflare-r2-storage/
├── SKILL.md                   # Main comprehensive guide (start here!)
├── README.md                  # This file
└── resources/                 # Supplementary examples and patterns
    ├── quick-reference.md     # Code snippets & commands
    ├── advanced-patterns.md   # Advanced use cases
    ├── example-use-cases.md  # Real-world examples
    └── migration-guide.md    # Migrate from S3, Vercel Blob, etc.
```

## How to Use This Skill

### Main Guide (Start Here!)
Read: **`SKILL.md`** - Complete step-by-step implementation guide covering:
- Cloudflare R2 setup
- Convex backend configuration
- Frontend implementation with React hooks
- Testing and verification
- Security best practices
- Troubleshooting

### Supplementary Resources (Reference as Needed)

**For Code Snippets:**
- `resources/quick-reference.md` - Copy-paste ready code

**For Advanced Features:**
- `resources/advanced-patterns.md` - Image processing, quotas, batch operations

**For Specific Use Cases:**
- `resources/example-use-cases.md` - Find your use case and adapt

**For Migration:**
- `resources/migration-guide.md` - Migrate from existing storage services

## Key Features

### Public CDN URLs (Recommended)
- No expiration, permanent URLs
- Fast Cloudflare CDN delivery
- Better caching performance
- Custom domain branding
- **Best for:** Public content, user avatars, product images

### Presigned URLs (Private Access)
- Secure, time-limited access
- Per-file access control
- Generate on-demand
- **Best for:** User documents, private files, sensitive content

### File Organization
Multiple patterns supported:
- By user: `users/{userId}/avatar.jpg`
- By feature: `posts/{postId}/images/{image}.jpg`
- By date: `uploads/2024/01/15/{file}`
- By type: `images/avatars/{userId}.jpg`

### Security Features
- Authentication checks
- File type validation
- Size limits
- User quotas
- Filename sanitization
- Rate limiting patterns

## Common Use Cases Covered

1. **User Profile Pictures**
   - Single image per user
   - Auto-resize to standard sizes
   - Replace on new upload
   - Public CDN access

2. **Document Management**
   - Multiple file types
   - Private access with permissions
   - Download tracking
   - Organization by projects

3. **E-commerce Product Gallery**
   - Multiple images per product
   - Different sizes (thumb, medium, full)
   - Image ordering
   - Public CDN delivery

4. **Video Platform**
   - Large file uploads
   - Video thumbnails
   - Storage quotas
   - Processing queues

5. **Team Workspace**
   - Shared folders
   - File versioning
   - Access control
   - Activity tracking

6. **Media Library/CMS**
   - Category organization
   - Tagging system
   - Search and filter
   - Reusable across content

## Technologies Used

- **Cloudflare R2**: S3-compatible object storage
- **Convex**: Backend database and functions
- **@convex-dev/r2**: Convex R2 component
- **Next.js**: Frontend framework
- **TypeScript**: Type-safe code

## Cost Comparison

| Service | Storage (1TB) | Egress (1TB) | Total |
|---------|--------------|--------------|-------|
| **R2** | $15 | **$0** | **$15** |
| S3 | $23 | $92 | $115 |
| GCS | $20 | $120 | $140 |
| Azure | $21 | $87 | $108 |

**R2's advantage:** No egress fees saves significant money for high-traffic apps.

## Quick Cost Calculator

Monthly cost = (GB × $0.015) + (reads/1M × $0.36) + (writes/1M × $4.50)

**Examples:**
- 100 GB + 1M views + 10K uploads: **~$2/month**
- 500 GB + 5M views + 100K uploads: **~$10/month**
- 5 TB + 50M views + 1M uploads: **~$100/month**

## Prerequisites

- Existing Convex + Next.js project
- Cloudflare account (free tier works)
- Node.js and npm installed
- Basic understanding of TypeScript/React

## Implementation Time

- Basic setup: **5-10 minutes**
- With UI components: **30 minutes**
- With advanced features: **1-2 hours**
- Full production setup: **2-4 hours**

## Testing Checklist

After implementation, verify:
- [ ] Files upload successfully to R2
- [ ] Files appear in Cloudflare R2 bucket
- [ ] Database records created correctly
- [ ] Files display with correct URLs
- [ ] Public CDN URLs work (if applicable)
- [ ] Delete functionality works
- [ ] CORS allows uploads from your domain
- [ ] File validation (size, type) works
- [ ] Progress tracking displays
- [ ] Error handling works

## Support & Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Convex Documentation](https://docs.convex.dev)
- [Convex R2 Component](https://github.com/get-convex/convex-helpers/tree/main/packages/r2)
- [Next.js Documentation](https://nextjs.org/docs)

## Contributing

This skill was created from real production implementation experience. Feel free to:
- Adapt code templates for your specific use case
- Add custom validation or processing logic
- Extend with additional features
- Share improvements with the team

## Version History

- **v1.0** (2024): Initial skill creation
  - Complete implementation guide
  - Public CDN and presigned URL patterns
  - 6 real-world use case examples
  - Advanced patterns and migrations
  - Quick reference guide

## License

This skill is part of the project's internal documentation and tooling.

---

**Created by:** Based on production implementation for CreatorHunter
**Last Updated:** October 2024
**Skill Type:** Implementation Guide
**Complexity:** Intermediate
**Time to Implement:** 5 minutes - 4 hours (depending on features)
