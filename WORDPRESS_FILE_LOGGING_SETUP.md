# WordPress File Rejection Logging Setup

## Quick Setup Guide

### Step 1: Update WordPress Plugin

Copy the contents of `wordpress-custom-endpoint.php` to your WordPress site:

**Option A: Via WordPress Admin**
1. Log into WordPress admin
2. Go to Plugins → Plugin File Editor
3. Select "Email Check Endpoint"
4. Replace the content with the updated `wordpress-custom-endpoint.php`
5. Click "Update File"

**Option B: Via FTP/SSH**
1. Upload `wordpress-custom-endpoint.php` to your plugins directory
2. Overwrite the existing file

### Step 2: Verify Plugin is Active

1. Go to Plugins → Installed Plugins
2. Ensure "Email Check Endpoint" is activated
3. The plugin will automatically create the new REST API endpoint

### Step 3: Test the Endpoint

Test that the endpoint is accessible:

```bash
curl -X POST https://your-wordpress-site.com/wp-json/file-logging/v1/rejection \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.pdf",
    "fileSize": 10485760,
    "fileSizeMB": "10.00",
    "reason": "size_exceeded"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "File rejection logged successfully"
}
```

### Step 4: Check CORS Settings

The plugin includes CORS headers for these domains:
- `http://localhost:3000-3003` (development)
- `https://ose-six.vercel.app`
- `https://ose-git-staging-evildonkeyuk.vercel.app`
- `https://www.oxfordscienceenterprises.com`

If you deploy to a different domain, update the `$allowed_origins` array in the `add_cors_headers()` function.

### Step 5: View Logs in WordPress Admin

1. Log into WordPress admin
2. Go to **Settings → File Rejection Logs**
3. You'll see a statistics dashboard and detailed logs

### Step 6: Deploy Next.js Changes

No additional configuration needed! The Next.js app will automatically start sending logs to WordPress once deployed.

## File Locations

### WordPress Server
- **Plugin file**: `wp-content/plugins/email-check-endpoint/email-check-endpoint.php` (or wherever you installed it)
- **Log directory**: `wp-content/uploads/file-rejection-logs/`
- **Log files**: `rejections-YYYY-MM.log` (one per month)
- **Protection**: `.htaccess` file automatically created

### Next.js Project
- **Form component**: `src/components/Form/index.js`
- **API route**: `src/app/api/log-file-rejection/route.js`
- **Documentation**: `FILE_REJECTION_LOGS.md`

## Accessing Logs

### Via WordPress Admin (Easiest)
Settings → File Rejection Logs

### Via SSH/FTP
```bash
cd wp-content/uploads/file-rejection-logs
cat rejections-2025-10.log | jq '.'
```

### Via WP-CLI
```bash
wp eval 'print_r(json_decode(file_get_contents(wp_upload_dir()["basedir"] . "/file-rejection-logs/rejections-2025-10.log")));'
```

## Security Notes

- Log files are protected by `.htaccess` (not publicly accessible)
- Only WordPress admins can view logs via the admin panel
- Direct server access requires SSH/FTP credentials
- IP addresses are logged for security analysis

## Troubleshooting

### Logs not appearing in WordPress?

1. **Check endpoint is accessible:**
   ```bash
   curl https://your-wordpress-site.com/wp-json/file-logging/v1/rejection
   ```

2. **Check WordPress error log:**
   ```bash
   tail -f wp-content/debug.log
   ```

3. **Enable WordPress debugging** (in `wp-config.php`):
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```

4. **Check file permissions:**
   ```bash
   ls -la wp-content/uploads/file-rejection-logs/
   chmod 755 wp-content/uploads/file-rejection-logs/
   ```

### CORS errors in browser console?

1. Check that your domain is in the `$allowed_origins` array
2. Clear browser cache
3. Check that the WordPress endpoint is responding correctly

### Local development logs?

During local development, if WordPress is unreachable, logs will fall back to the local `logs/` directory. These won't persist in production on Vercel.

## Monthly Maintenance

Logs are automatically organized by month. To clean up old logs:

```bash
# List all log files
ls -la wp-content/uploads/file-rejection-logs/

# Remove logs older than 6 months
find wp-content/uploads/file-rejection-logs/ -name "*.log" -mtime +180 -delete
```

## What Changed

1. ✅ Added new WordPress REST API endpoint: `/wp-json/file-logging/v1/rejection`
2. ✅ Added WordPress admin page: Settings → File Rejection Logs
3. ✅ Updated Form validation to log oversized files
4. ✅ Updated Next.js API route to forward logs to WordPress
5. ✅ Added automatic monthly log organization
6. ✅ Added statistics dashboard in WordPress admin
7. ✅ Added `.htaccess` protection for log files

## Benefits

✅ **Persistent logging on Vercel** - Works with serverless deployments  
✅ **Easy to access** - WordPress admin dashboard  
✅ **Secure** - Protected by .htaccess and WordPress permissions  
✅ **Organized** - Automatic monthly log files  
✅ **Visual statistics** - See trends at a glance  
✅ **No database needed** - Simple file-based logging  
✅ **Fallback support** - Works locally if WordPress is down

