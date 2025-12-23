# Example Use Cases

## Use Case 1: User Profile Pictures

**Requirements:**
- Users can upload profile pictures
- Images auto-resize to standard sizes
- Old images deleted on new upload
- Public CDN access

**Implementation:**

### Schema
```typescript
users: defineTable({
  name: v.string(),
  email: v.string(),
  avatarUrl: v.optional(v.string()),
  avatarR2Key: v.optional(v.string()),
  createdAt: v.number(),
}),
```

### Upload Function
```typescript
export const uploadAvatar = action({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Delete old avatar if exists
    const user = await ctx.runQuery(api.users.get, { userId: args.userId });
    if (user?.avatarR2Key) {
      await r2.deleteObject(ctx, user.avatarR2Key);
    }

    // Generate key
    const key = `users/${args.userId}/avatar/${Date.now()}.jpg`;

    // Upload happens via client, this just generates the URL
    return { key };
  },
});
```

---

## Use Case 2: Document Management System

**Requirements:**
- Upload PDFs, DOCX, images
- Organize by projects
- Private access with permissions
- Download tracking

**Implementation:**

### Schema
```typescript
projects: defineTable({
  name: v.string(),
  ownerId: v.string(),
  memberIds: v.array(v.string()),
}),

documents: defineTable({
  projectId: v.id("projects"),
  r2Key: v.string(),
  filename: v.string(),
  contentType: v.string(),
  size: v.number(),
  uploadedBy: v.string(),
  downloadCount: v.number(),
  lastDownloaded: v.optional(v.number()),
  uploadedAt: v.number(),
})
  .index("by_project", ["projectId"])
  .index("by_uploaded_by", ["uploadedBy"]),
```

### Access Control
```typescript
export const getDocumentUrl = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const doc = await ctx.runQuery(api.documents.get, { documentId: args.documentId });
    if (!doc) throw new Error("Document not found");

    const project = await ctx.runQuery(api.projects.get, { projectId: doc.projectId });

    // Check if user has access
    const hasAccess =
      project.ownerId === identity.subject ||
      project.memberIds.includes(identity.subject);

    if (!hasAccess) throw new Error("Access denied");

    // Generate temporary URL (1 hour)
    const url = await r2.getUrl(doc.r2Key, { expiresIn: 3600 });

    // Track download
    await ctx.runMutation(internal.documents.trackDownload, {
      documentId: args.documentId,
    });

    return { url, expiresAt: Date.now() + 3600000 };
  },
});
```

---

## Use Case 3: E-commerce Product Gallery

**Requirements:**
- Multiple images per product
- Different sizes (thumbnail, medium, full)
- Image ordering
- Public access

**Implementation:**

### Schema
```typescript
products: defineTable({
  name: v.string(),
  description: v.string(),
  price: v.number(),
}),

productImages: defineTable({
  productId: v.id("products"),
  r2Key: v.string(),
  url: v.string(),
  order: v.number(),
  versions: v.array(v.object({
    size: v.string(),
    url: v.string(),
    width: v.number(),
    height: v.number(),
  })),
  uploadedAt: v.number(),
})
  .index("by_product", ["productId", "order"]),
```

### Upload with Processing
```typescript
export const uploadProductImage = action({
  args: {
    productId: v.id("products"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    // Upload handled by client
    const key = `products/${args.productId}/images/${Date.now()}.jpg`;

    // Schedule image processing
    await ctx.scheduler.runAfter(0, api.imageProcessing.processImage, {
      r2Key: key,
      sizes: [
        { name: 'thumb', width: 200, height: 200 },
        { name: 'medium', width: 800 },
        { name: 'full', width: 2000 },
      ],
    });

    return { key };
  },
});
```

---

## Use Case 4: Video Platform

**Requirements:**
- User-uploaded videos
- Video thumbnails
- Storage quotas
- Processing queue

**Implementation:**

### Schema
```typescript
videos: defineTable({
  userId: v.string(),
  r2Key: v.string(),
  url: v.string(),
  thumbnailUrl: v.optional(v.string()),
  thumbnailR2Key: v.optional(v.string()),
  title: v.string(),
  description: v.optional(v.string()),
  duration: v.optional(v.number()),
  views: v.number(),
  size: v.number(),
  processingStatus: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("completed"),
    v.literal("failed")
  ),
  uploadedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_status", ["processingStatus"]),
```

### Quota Check
```typescript
checkUpload: async (ctx, bucket) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const quota = await ctx.runQuery(api.videos.getUserQuota, {
    userId: identity.subject,
  });

  if (!quota.canUpload) {
    throw new Error(`Storage quota exceeded: ${quota.percentUsed.toFixed(1)}% used`);
  }
},
```

---

## Use Case 5: Team Workspace with Shared Files

**Requirements:**
- Team folders
- File sharing
- Version control
- Activity tracking

**Implementation:**

### Schema
```typescript
teams: defineTable({
  name: v.string(),
  ownerId: v.string(),
  memberIds: v.array(v.string()),
}),

folders: defineTable({
  teamId: v.id("teams"),
  parentId: v.optional(v.id("folders")),
  name: v.string(),
  createdBy: v.string(),
  createdAt: v.number(),
})
  .index("by_team", ["teamId"])
  .index("by_parent", ["parentId"]),

teamFiles: defineTable({
  teamId: v.id("teams"),
  folderId: v.optional(v.id("folders")),
  r2Key: v.string(),
  filename: v.string(),
  contentType: v.string(),
  size: v.number(),
  version: v.number(),
  previousVersionId: v.optional(v.id("teamFiles")),
  uploadedBy: v.string(),
  uploadedAt: v.number(),
})
  .index("by_team", ["teamId"])
  .index("by_folder", ["folderId"])
  .index("by_filename", ["folderId", "filename"]),
```

### File Upload with Versioning
```typescript
export const uploadTeamFile = action({
  args: {
    teamId: v.id("teams"),
    folderId: v.optional(v.id("folders")),
    filename: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check team membership
    const team = await ctx.runQuery(api.teams.get, { teamId: args.teamId });
    const isMember =
      team.ownerId === identity.subject ||
      team.memberIds.includes(identity.subject);

    if (!isMember) throw new Error("Not a team member");

    // Check for existing file with same name
    const existing = await ctx.runQuery(api.teamFiles.getByFilename, {
      folderId: args.folderId,
      filename: args.filename,
    });

    const version = existing ? existing.version + 1 : 1;
    const key = `teams/${args.teamId}/files/${Date.now()}-${args.filename}`;

    return {
      key,
      version,
      previousVersionId: existing?._id,
    };
  },
});
```

---

## Use Case 6: Media Library for Blog/CMS

**Requirements:**
- Organize by categories/tags
- Search and filter
- Lazy loading
- Reusable across posts

**Implementation:**

### Schema
```typescript
media: defineTable({
  r2Key: v.string(),
  url: v.string(),
  type: v.union(v.literal("image"), v.literal("video"), v.literal("audio")),
  title: v.string(),
  description: v.optional(v.string()),
  tags: v.array(v.string()),
  category: v.string(),
  dimensions: v.optional(v.object({
    width: v.number(),
    height: v.number(),
  })),
  size: v.number(),
  usageCount: v.number(),
  uploadedBy: v.string(),
  uploadedAt: v.number(),
})
  .index("by_type", ["type"])
  .index("by_category", ["category"])
  .index("by_tags", ["tags"])
  .searchIndex("search_media", {
    searchField: "title",
    filterFields: ["type", "category"],
  }),
```

### Search Function
```typescript
export const searchMedia = query({
  args: {
    query: v.string(),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("media")
      .withSearchIndex("search_media", q => {
        let query = q.search("title", args.query);

        if (args.type) {
          query = query.eq("type", args.type);
        }
        if (args.category) {
          query = query.eq("category", args.category);
        }

        return query;
      })
      .take(args.limit || 50);

    return results;
  },
});
```

---

## Common Features Across Use Cases

### 1. Progress Tracking
```typescript
const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

const handleUpload = async (file: File) => {
  const fileId = file.name;

  try {
    await upload(file, {
      onProgress: (percent) => {
        setUploadProgress(prev => ({ ...prev, [fileId]: percent }));
      },
    });
  } finally {
    setUploadProgress(prev => {
      const { [fileId]: _, ...rest } = prev;
      return rest;
    });
  }
};
```

### 2. Error Handling
```typescript
try {
  await upload(file);
} catch (error) {
  if (error instanceof QuotaExceededError) {
    toast.error("Storage quota exceeded. Please upgrade your plan.");
  } else if (error instanceof InvalidFileTypeError) {
    toast.error("Invalid file type. Only images are allowed.");
  } else {
    toast.error("Upload failed. Please try again.");
  }
}
```

### 3. Optimistic Updates
```typescript
const optimisticDelete = useMutation(api.files.delete).withOptimisticUpdate(
  (localStore, args) => {
    const files = localStore.getQuery(api.files.list, { entityId });
    if (files) {
      localStore.setQuery(
        api.files.list,
        { entityId },
        files.filter(f => f._id !== args.fileId)
      );
    }
  }
);
```
