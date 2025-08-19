# Secure File Download Implementation

## Overview

This implementation provides secure access to protected files stored in WordPress while preventing direct access to the `/protected/` directory. Users must be authenticated to download files.

## Architecture

### 1. API Endpoint (`/api/download`)
- **Location**: `src/app/api/download/route.js`
- **Purpose**: Acts as a secure proxy for protected file downloads
- **Authentication**: Uses existing JWT token-based auth system
- **Security**: Validates file URLs and user authentication

### 2. Client-Side Utility (`/lib/downloadFile.js`)
- **Location**: `src/lib/downloadFile.js`
- **Purpose**: Provides consistent download handling across components
- **Features**: Error handling, user feedback, and secure URL generation

### 3. Updated Components
- **Investor Portal**: `src/app/investor-portal/InvestorPortalClient.js`
- **Investor Portal Signup**: `src/app/investor-portal-signup/InvestorPortalSignupClient.js`

## Security Features

1. **URL Validation**: Only allows files from the configured WordPress domain
2. **Protected Directory Check**: Only serves files from `/protected/` directories
3. **Authentication Required**: Users must be logged in with valid JWT tokens
4. **Token Verification**: Validates tokens against WordPress GraphQL endpoint
5. **No Direct Access**: Protected files cannot be accessed directly via URL

## How It Works

1. User clicks on a file in the investor portal
2. Client-side code calls `downloadFile()` utility function
3. Utility creates a secure download URL pointing to `/api/download`
4. API endpoint validates:
   - User authentication (JWT token)
   - File URL domain
   - File location (must be in protected directory)
5. If validation passes, endpoint fetches file from WordPress with auth token
6. File is streamed to user with proper headers for download

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://oxfordscienceenterprises-cms.com
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=https://oxfordscienceenterprises-cms.com/graphql
```

## Testing

You can test the endpoint at: `/api/download/test`

## Error Handling

The implementation includes comprehensive error handling:
- Invalid URLs (400)
- Unauthorized access (401)
- Forbidden requests (403)
- File not found (404)
- Server errors (500)

## Future Enhancements

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **File Type Validation**: Restrict to specific file types
3. **Audit Logging**: Log download attempts for security monitoring
4. **Caching**: Implement caching for frequently accessed files
5. **Progress Indicators**: Add download progress for large files

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: User token expired or invalid
2. **403 Forbidden**: File not in protected directory or invalid domain
3. **404 Not Found**: File doesn't exist on WordPress server
4. **500 Server Error**: Check server logs for detailed error information

### Debug Steps

1. Check user authentication status
2. Verify file URL format
3. Ensure WordPress server is accessible
4. Check JWT token validity
5. Review server logs for detailed errors
