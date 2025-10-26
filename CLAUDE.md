# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Instructions

### Subagents, Plans and Skills
- **`/skills`** - contains the custom skills you can use to do specific things
  - Before proceeding please check if there is a skill for the requested action
- **`/agents`** - Contains custom agent personas
  - Before implementing features, check if a relevant agent exists in this directory that can be invoked
  - Invoke custom agents using the Task tool when their expertise matches the request
  - If no matching agent exists, proceed with the task normally
- **`/plans`** - Contains plans for implementing new features
  - Usually called out to be used by an agent or user
  - Before implementing features, check if a relevant plan exists in this directory
  - If a user requests a feature with a plan, always reference and follow that plan
  - If no matching plan exists, proceed with the implementation with your own plan

**IMPORTANT**: Always check these directories when starting a new feature or task. subagents, skills and plans provide project-specific expertise and tested approaches when available.

## Commands

### Development
- `npm run dev` - Runs both Next.js frontend and Convex backend in parallel
  - http://localhost:3000
  - Convex dashboard opens automatically

### Convex
- `npx convex dev` - Start Convex development server (auto-started with `npm run dev`)
- `npx convex deploy` - Deploy Convex functions to production

## Architecture

This is a full-stack TypeScript application using:

### Frontend
- **Next.js 15** with App Router - React framework with file-based routing in `/app`
- **Tailwind CSS 4** - Utility-first styling with custom dark theme variables
- **shadcn/ui** - Pre-configured component library
- **Clerk** - Authentication provider integrated via `ClerkProvider` in app/layout.tsx

### Backend
- **Convex** - Real-time backend with:
  - Database schema defined in `convex/schema.ts`
  - Server functions in `convex/` directory (myFunctions.ts, todos.ts)
  - Auth config in `convex/auth.config.ts` (requires Clerk JWT configuration)

### Key Integration Points
- **ConvexClientProvider** (components/ConvexClientProvider.tsx) wraps the app with `ConvexProviderWithClerk` to integrate Convex with Clerk auth
- **Middleware** (middleware.ts) protects `/server` routes using Clerk
- Path aliases configured: `@/*` maps to root directory

### Clerk JWT Configuration
1. Create a JWT template named "convex" in Clerk dashboard
2. Set issuer domain in the template
3. Add `CLERK_JWT_ISSUER_DOMAIN` environment variable in Convex dashboard

## Project Structure
- `/app` - Next.js pages and layouts (App Router)
  - `/app/(auth)` - Authentication pages if needed
  - `/app/(protected)` - Protected routes requiring authentication
- `/components` - React components including sidebar and UI components
- `/convex` - Backend functions, schema, and auth configuration
  - `schema.ts` - Database schema definition
  - `auth.config.ts` - Clerk authentication configuration
- `/public` - Static assets including custom fonts
- `/agents` - Custom Claude Code agent definitions for specialized tasks
- `/plans` - Implementation plans and guides for specific features
- `middleware.ts` - Route protection configuration

## Key Architecture Patterns
- Uses TypeScript with strict mode enabled
- Path aliases configured with `@/*` mapping to root directory
- Components follow React patterns with Tailwind CSS for styling
- Real-time data synchronization with Convex
- JWT-based authentication with Clerk
- Custom hooks for framework integration
- ESLint configuration for code quality

## Authentication & Security
- Protected routes using Clerk's authentication in middleware.ts
- User-specific data filtering at the database level in Convex
- JWT tokens with Convex integration
- ClerkProvider wraps the app in app/layout.tsx
- ConvexClientProvider integrates Convex with Clerk auth

## Backend Integration
- Convex provides real-time database with TypeScript support
- All mutations and queries are type-safe
- Automatic optimistic updates and real-time sync
- Row-level security ensures users only see their own data
- Use `useQuery`, `useMutation`, and `useAction` hooks in Next.js components

## Styling Approach
- Tailwind CSS 4 with custom dark theme variables
- shadcn/ui component library for pre-built components
- Responsive design with mobile-first approach
- Consistent design system across the application

## API Key Management
When implementing features that require API keys:
1. Ask the user to provide the API key
2. Add the key to `.env.local` file yourself (create the file if it doesn't exist)
4. Never ask the user to manually edit environment files - handle it for them

## Convex Backend Development
**IMPORTANT**: When implementing any features or changes that involve Convex:
- ALWAYS refer to and follow the guidelines in `convexGuidelines.md`
- This file contains critical best practices for:
  - Function syntax (queries, mutations, actions, internal functions)
  - Validators and type safety
  - Schema definitions and index usage
  - File storage patterns
  - Scheduling and cron jobs
  - Database queries and performance optimization
- Following these guidelines ensures type safety, proper security, and optimal performance
- Never deviate from these patterns without explicit user approval

## Modular Code Best Practice
**IMPORTANT**: Write modular, reusable code to optimize token usage and maintainability:
- Break down large pages into smaller, focused components
- Extract reusable UI elements into separate component files
- Keep pages concise by delegating logic to components and hooks
- Avoid pages that are thousands of lines long - this saves tokens and improves code quality

## UI-First Implementation Approach
**IMPORTANT**: When implementing new features or screens:
1. **Build the UI first** - Create the complete visual interface with all elements, styling, and layout
2. **Match existing design** - New designs should closely match the existing UI screens, pages, and components, unless otherwise stated by the user
3. **Then add functionality** - After the UI is in place, implement the business logic, state management, and backend integration
4. This approach ensures a clear separation of concerns and makes it easier to iterate on both design and functionality independently