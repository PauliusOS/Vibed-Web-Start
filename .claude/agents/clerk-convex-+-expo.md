---
name: agent-clerk-auth-with-expo-convex
description: Best practices for Clerk authentication in Expo + Convex with proper token caching, protected routes, and real-time sync
model: inherit
color: purple
---

# Agent: Clerk Authentication for Expo + Convex

Best practices for implementing Clerk authentication in Expo React Native apps with Convex backend. Covers token caching, protected routes, OAuth integration, and real-time user authentication.

## =4 CRITICAL: SecureStore Token Cache

### Issue: Token Persistence and Security
Without proper token caching, users get signed out on app restarts and authentication fails silently.

**ERROR:** Authentication state lost on app reload, infinite authentication loops, or secure token storage failures

### Solution: Always Use SecureStore Token Cache

```typescript
// ❌ FAILS - No token cache
<ClerkProvider publishableKey={publishableKey}>
  <App />
</ClerkProvider>

// ✅ WORKS - Proper SecureStore token cache
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore getToken error:", error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore saveToken error:", error);
    }
  },
  async deleteToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore deleteToken error:", error);
    }
  },
};

// Basic setup - works with any app structure
<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
  <ClerkLoaded>
    <YourAppContent />
  </ClerkLoaded>
</ClerkProvider>
```

## =4 CRITICAL: Protected Routes with Automatic Redirects

### Issue: Unprotected Routes and Manual Navigation
Without proper route protection, users can access authenticated content while signed out.

### Solution: useAuth Hook with Automatic Redirects

```typescript
// ❌ FAILS - No authentication check
export default function ProtectedScreen() {
  return (
    <View>
      <Text>Protected content anyone can see</Text>
    </View>
  );
}

// ✅ WORKS - Protected with automatic redirect (Expo Router)
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function ProtectedScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />; // or return null
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />; // Adjust path to your auth screen
  }

  return (
    <View>
      <Text>Protected content</Text>
    </View>
  );
}

// ✅ ALTERNATIVE - For React Navigation
import { useAuth } from '@clerk/clerk-expo';

function AppNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## =4 CRITICAL: Environment Variable Validation

### Issue: Runtime Crashes from Missing Configuration
Missing publishable keys cause runtime crashes instead of helpful error messages.

### Solution: Always Validate Configuration

```typescript
// ❌ FAILS - No validation, cryptic runtime errors
function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <YourApp />
    </ClerkProvider>
  );
}

// ✅ WORKS - Validation with helpful error message
function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Clerk Setup Required
        </Text>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>
          1. Get your publishable key from Clerk Dashboard{'\n'}
          2. Add to .env.local or .env:{'\n'}
          EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_*****
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <YourApp />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
```

## =3 IMPORTANT: OAuth Integration with Session Handling

### Issue: Incomplete OAuth Flow
OAuth flows can fail at session creation or require additional steps for completion.

### Solution: Comprehensive OAuth Handler

```typescript
// ❌ FAILS - Incomplete OAuth handling
const onGoogleSignIn = async () => {
  const { createdSessionId } = await startOAuthFlow();
  await setActive({ session: createdSessionId });
  router.replace("/(tabs)");
};

// ✅ WORKS - Complete OAuth flow with fallback handling
const onGoogleSignIn = async () => {
  try {
    const { createdSessionId, signIn: oAuthSignIn, signUp: oAuthSignUp } = await startOAuthFlow();

    if (createdSessionId) {
      // Direct session creation - most common case
      await setActive({ session: createdSessionId });
      router.replace("/(tabs)");
    } else {
      // Handle incomplete flows
      if (oAuthSignIn && oAuthSignIn.status === "complete") {
        await setActive({ session: oAuthSignIn.createdSessionId });
        router.replace("/(tabs)");
      } else if (oAuthSignUp && oAuthSignUp.status === "complete") {
        await setActive({ session: oAuthSignUp.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // Log for debugging incomplete flows
        console.log("OAuth flow incomplete:", {
          signIn: oAuthSignIn,
          signUp: oAuthSignUp
        });
      }
    }
  } catch (err: any) {
    console.error("OAuth error:", JSON.stringify(err, null, 2));
    Alert.alert("Error", "Authentication failed. Please try again.");
  }
};

// Initialize OAuth provider
const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

// Required for OAuth completion
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
```

## =3 IMPORTANT: User-Friendly Error Handling

### Issue: Generic Error Messages
Default Clerk errors are technical and confusing for end users.

### Solution: Specific Error Code Handling

```typescript
// ❌ FAILS - Generic error handling
catch (err: any) {
  Alert.alert("Error", "Sign in failed");
}

// ✅ WORKS - Specific error messages
catch (err: any) {
  const errorCode = err.errors?.[0]?.code;
  let errorMessage = "Sign in failed";

  if (errorCode === "form_identifier_not_found") {
    errorMessage = "No account found with this email. Please check your email or sign up.";
  } else if (errorCode === "form_password_incorrect") {
    errorMessage = "Incorrect password. Please try again.";
  } else if (errorCode === "user_locked") {
    errorMessage = "Account locked. Please try again later.";
  } else if (errorCode === "too_many_requests") {
    errorMessage = "Too many attempts. Please wait before trying again.";
  } else if (err.errors?.[0]?.message) {
    errorMessage = err.errors[0].message;
  }

  setErrorMessage(errorMessage);
  Alert.alert("Sign In Failed", errorMessage);
}
```

## =3 IMPORTANT: Secure Sign Out with Token Cleanup

### Issue: Incomplete Logout
Failing to clear cached tokens can cause authentication state issues.

### Solution: Complete Token Cleanup

```typescript
// ❌ FAILS - Incomplete sign out
const handleSignOut = async () => {
  await signOut();
};

// ✅ WORKS - Complete token cleanup
const handleSignOut = async () => {
  try {
    // Clear cached tokens first
    await Promise.all([
      SecureStore.deleteItemAsync("__clerk_client_jwt"),
      SecureStore.deleteItemAsync("__clerk_db_jwt"),
      SecureStore.deleteItemAsync("__clerk_session_jwt"),
    ]);

    // Then sign out from Clerk
    await signOut();
  } catch (error) {
    console.error("Sign out error:", error);
    Alert.alert("Error", "Failed to sign out. Please try again.");
  }
};

// Platform-specific confirmation
const confirmSignOut = () => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) handleSignOut();
  } else {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: handleSignOut },
      ]
    );
  }
};
```

## =2 HELPFUL: Convex Integration Patterns

### Convex Authentication Setup
```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

### User-Scoped Queries and Mutations
- Always check `await ctx.auth.getUserIdentity()` in Convex functions
- Use `identity.subject` as the user ID for data filtering
- Return empty results (not errors) for unauthenticated users in queries
- Throw errors for unauthenticated mutation attempts

### ConvexProviderWithClerk Setup
- Wrap app with `ConvexProviderWithClerk` inside `ClerkLoaded`
- Pass `useAuth` hook to connect Clerk state with Convex
- Ensure Convex client is created after environment validation

## =2 HELPFUL: Expo + Convex Setup Template

### Complete Integration Pattern
```typescript
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";

// Environment validation
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convex = convexUrl?.startsWith('https://') ? new ConvexReactClient(convexUrl) : null;

// SecureStore token cache
const tokenCache = { /* SecureStore implementation */ };

function ConvexProviderWithAuth({ children }: { children: React.ReactNode }) {
  if (!convex) return <SetupErrorScreen type="convex" />;

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) return <SetupErrorScreen type="clerk" />;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithAuth>
          {children}
        </ConvexProviderWithAuth>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
```

## Environment Variables

### Required Configuration

```bash
# .env.local
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_*****
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Convex Dashboard Configuration
**CRITICAL:** Set in Convex Dashboard Environment Variables (NOT in .env):
```
CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev
```

## Package Dependencies

```json
{
  "dependencies": {
    "@clerk/clerk-expo": "^2.14.24",
    "expo-secure-store": "^13.0.2",
    "expo-web-browser": "^13.0.3",
    "convex": "^1.16.4",
    "convex/react-clerk": "^0.2.36"
  }
}
```

## Quick Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "Network request failed" | Missing publishable key | Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| Authentication loops | No token cache | Implement SecureStore token cache |
| OAuth popup closes immediately | Missing WebBrowser setup | Add `WebBrowser.maybeCompleteAuthSession()` |
| Users signed out on restart | SecureStore errors | Check SecureStore error handling |
| "Invalid token" in Convex | Wrong JWT issuer domain | Set `CLERK_JWT_ISSUER_DOMAIN` in Convex Dashboard |
| Convex queries return empty | No user authentication | Check `ctx.auth.getUserIdentity()` in functions |
| ConvexProviderWithClerk error | Missing useAuth prop | Pass `useAuth` hook to provider |
| Real-time updates don't work | Provider order wrong | ClerkProvider → ClerkLoaded → ConvexProviderWithClerk |

## =1 AUDIT: Implementation Health Check

### Quick Implementation Verification
Use this checklist to verify your Clerk implementation is following best practices:

```bash
# 1. Check environment variables
grep -r "EXPO_PUBLIC_CLERK" . --include="*.env*"
# Should find: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_*****

# 2. Check for SecureStore token cache
grep -r "tokenCache.*SecureStore" . --include="*.tsx" --include="*.ts"
# Should find token cache implementation

# 3. Check for ClerkLoaded wrapper
grep -r "ClerkLoaded" . --include="*.tsx" --include="*.ts"
# Should find ClerkLoaded wrapping your app

# 4. Check for protected routes
grep -r "useAuth.*isSignedIn" . --include="*.tsx" --include="*.ts"
# Should find route protection logic
```

### Authentication State Debugging
Key debugging points for Clerk auth issues:

- Check `isLoaded` before using any auth state
- Verify `getToken()` returns a valid JWT when signed in
- Log auth state changes to identify timing issues
- Check `user.primaryEmailAddress?.emailAddress` for user data

### Common Implementation Issues

**❌ Missing Token Cache** - Will lose auth state on app restart
**❌ No Loading State Handling** - Check `isLoaded` before rendering auth-dependent UI
**❌ Unprotected API Calls** - Always use `getToken()` for authenticated requests
**❌ Missing ClerkLoaded** - Wrap app content to prevent auth state flicker

## =1 MAINTENANCE: Ongoing Management

### Monitoring Authentication Health

**Key Metrics to Track:**
- Token refresh success/failure rates
- Auth state change frequency and timing
- SecureStore read/write errors
- Session expiry patterns

**Health Check Points:**
- Verify `getToken()` works for signed-in users
- Test SecureStore read/write functionality
- Monitor auth state persistence across app restarts
- Track authentication error frequencies

### User Management with Convex

**User Sync Pattern:**
- Create/update Convex user records when Clerk user data changes
- Use Convex mutations to sync `user.id`, `primaryEmailAddress`, `fullName`
- Handle user deletion from Convex when Clerk account is deleted

**Session Management:**
- Convex automatically handles JWT token validation and refresh
- User identity available via `ctx.auth.getUserIdentity()` in all functions
- No manual session expiry handling needed (Convex + Clerk manages this)

### Performance with Convex

**Optimize Real-time Subscriptions:**
- Use user-scoped queries to minimize unnecessary data subscriptions
- Avoid multiple auth hooks in same component - `useAuth()` provides user data
- Convex optimistic updates work automatically with Clerk authentication

**Efficient Data Patterns:**
- Filter data at Convex function level using `identity.subject`
- Use Convex indexes for user-specific data (`by_user` index pattern)
- Convex handles caching and real-time sync automatically

## Testing Checklist

### Initial Implementation Testing
- [ ] Test sign-up flow with email verification (if enabled)
- [ ] Test sign-in with valid/invalid credentials
- [ ] Test OAuth flow completion (Google, Apple, etc.)
- [ ] Test protected route redirects when signed out
- [ ] Test token persistence after app restart
- [ ] Test sign out with proper token cleanup
- [ ] Test error handling for network failures
- [ ] Test backend API calls with JWT tokens
- [ ] Test platform-specific behaviors (iOS/Android/web)
- [ ] Check SecureStore permissions and error handling
- [ ] Verify environment variable validation works
- [ ] Test authentication state changes in real-time

### Ongoing Health Testing (Convex-Specific)
- [ ] Verify Convex queries return user-scoped data only
- [ ] Test real-time updates work for authenticated users
- [ ] Check `ctx.auth.getUserIdentity()` works in all Convex functions
- [ ] Monitor Convex function authentication success rates
- [ ] Test user data sync between Clerk and Convex
- [ ] Verify `CLERK_JWT_ISSUER_DOMAIN` is correctly configured
- [ ] Test ConvexProviderWithClerk integration after updates