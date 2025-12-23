---
name: agent-nano-banana-editor
description: when implementing an AI image editor into app
model: inherit
color: blue
---

# Agent: Nano Banana Editor

Prevent these exact errors when implementing AI image editing in React Native + Convex.

## Error Prevention Checklist

### 1. TypeScript Return Types
**WILL ERROR:** `TS7022: 'editImageWithGemini' implicitly has type 'any'`
```typescript
// ❌ This breaks
export const editImageWithGemini = action({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {

// ✅ This works  
export const editImageWithGemini = action({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<{ success: boolean; versionId?: any }> => {
```

### 2. Gemini Model Names
**WILL ERROR:** `[404 Not Found] models/gemini-2.5-flash-image is not found`
```typescript
// ❌ This breaks
model: 'gemini-2.5-flash-image'

// ✅ This works
model: 'gemini-2.5-flash-image-preview'
```

### 3. Buffer in Convex Environment
**WILL ERROR:** `ReferenceError: Buffer is not defined`
```typescript
// ❌ This breaks
const base64 = Buffer.from(arrayBuffer).toString('base64');
const imageBuffer = Buffer.from(base64Data, 'base64');

// ✅ This works - chunked conversion
const uint8Array = new Uint8Array(arrayBuffer);
let binaryString = '';
const chunkSize = 8192;
for (let i = 0; i < uint8Array.length; i += chunkSize) {
  const chunk = uint8Array.slice(i, i + chunkSize);
  binaryString += String.fromCharCode.apply(null, Array.from(chunk));
}
const base64 = btoa(binaryString);

// For base64 to blob
const binaryString = atob(base64Data);
const uint8Array = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  uint8Array[i] = binaryString.charCodeAt(i);
}
const blob = new Blob([uint8Array], { type: 'image/jpeg' });
```

### 4. Large Array Spread Operator
**WILL ERROR:** `RangeError: Maximum call stack size exceeded`
```typescript
// ❌ This breaks with large images
const base64 = btoa(String.fromCharCode(...uint8Array));

// ✅ This works - use chunked processing from #3 above
```

### 5. Data URL Fetching
**WILL ERROR:** `Unsupported URL scheme -- http and https are supported (scheme was data)`
```typescript
// ❌ This breaks
const response = await fetch(sourceImageUrl); // fails if data: URL

// ✅ This works
if (sourceImageUrl.startsWith('data:')) {
  const base64Match = sourceImageUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
  if (!base64Match) throw new Error('Invalid data URL format');
  base64Data = base64Match[1];
} else {
  const response = await fetch(sourceImageUrl);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  // ... convert to base64 using chunked method
}
```

### 6. Database Size Limits
**WILL ERROR:** `Value is too large (1.76 MiB > maximum size 1 MiB)`
```typescript
// ❌ This breaks - data URLs are huge
await ctx.db.insert("projects", {
  originalImageUrl: asset.uri, // data: URL = several MB
});

// Frontend passes data URL to mutation
const projectId = await createProject({
  originalImageUrl: asset.uri, // BREAKS!
});

// ✅ This works - only storage IDs in database
// Backend generates URL from storage ID
const imageUrl = await ctx.storage.getUrl(originalImageId);
await ctx.db.insert("projects", {
  originalImageId: storageId, // small ID
  originalImageUrl: imageUrl, // generated URL
});

// Frontend only passes storage ID
const projectId = await createProject({
  originalImageId: storageId, // WORKS!
});
```

## Implementation Rules

1. **ALWAYS** add `: Promise<Type>` to all Convex action handlers
2. **ALWAYS** use `gemini-2.5-flash-image-preview` (with -preview suffix)
3. **NEVER** use `Buffer` - use chunked `btoa`/`atob` with 8KB chunks
4. **NEVER** use spread operator on large arrays - use chunked processing
5. **ALWAYS** check `imageUrl.startsWith('data:')` before fetch
6. **NEVER** store data URLs in database - upload to storage first, pass only storage IDs