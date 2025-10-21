# File Rejection Logging

## Overview
The form now logs all attempts to upload files larger than 5MB to help track user behavior and identify if the file size limit needs adjustment.

## Log Location

### Production (Vercel Deployment)
Logs are stored on your **WordPress server** at:
- Directory: `wp-content/uploads/file-rejection-logs/`
- Files: `rejections-YYYY-MM.log` (organized by month)
- Protected by `.htaccess` (not publicly accessible)

### Development (Local)
Logs fall back to local storage at: `logs/file-rejections.log` if WordPress is unavailable

## How to View Production Logs

### Option 1: WordPress Admin Dashboard (Recommended)
1. Log into your WordPress admin panel
2. Go to **Settings → File Rejection Logs**
3. View statistics and detailed logs with a visual interface
4. Select different months from the dropdown

**Features:**
- Total rejection count
- Average file size
- Largest/smallest files rejected
- Detailed table with timestamps, filenames, IPs

### Option 2: Direct Server Access (SSH/FTP)
Access the log files directly on your WordPress server:

```bash
# Navigate to logs directory
cd wp-content/uploads/file-rejection-logs/

# View current month's logs
cat rejections-2025-10.log

# View with jq for better formatting
cat rejections-2025-10.log | jq '.'

# Count total rejections
wc -l rejections-*.log

# Get statistics
cat rejections-*.log | jq -r '.fileSizeMB' | sort -n
```

## Log Format
Each line in the log file is a JSON object containing:
```json
{
  "timestamp": "2025-10-21 12:34:56",
  "fileName": "large-document.pdf",
  "fileSize": 8388608,
  "fileSizeMB": "8.00",
  "reason": "size_exceeded",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Viewing Logs via Command Line (SSH)

### Count rejections by month:
```bash
ls -la wp-content/uploads/file-rejection-logs/
```

### View specific month:
```bash
cat wp-content/uploads/file-rejection-logs/rejections-2025-10.log | jq '.'
```

### Count total rejections:
```bash
cat wp-content/uploads/file-rejection-logs/rejections-*.log | wc -l
```

### Get statistics on file sizes:
```bash
cat wp-content/uploads/file-rejection-logs/rejections-*.log | jq -r '.fileSizeMB' | sort -n
```

### Find the largest rejected file:
```bash
cat wp-content/uploads/file-rejection-logs/rejections-*.log | jq -r '.fileSizeMB' | sort -n | tail -1
```

### Average size of rejected files:
```bash
cat wp-content/uploads/file-rejection-logs/rejections-*.log | jq -r '.fileSizeMB' | awk '{sum+=$1; count++} END {print sum/count}'
```

### Group by date:
```bash
cat wp-content/uploads/file-rejection-logs/rejections-*.log | jq -r '.timestamp[:10]' | sort | uniq -c
```

## Architecture

```
User uploads large file
    ↓
Next.js Form validates size
    ↓
Rejected (>5MB)
    ↓
Logs to browser console
    ↓
Sends to Next.js API route (/api/log-file-rejection)
    ↓
Forwards to WordPress REST API (/wp-json/file-logging/v1/rejection)
    ↓
WordPress writes to file (wp-content/uploads/file-rejection-logs/)
    ↓
View in WordPress Admin (Settings → File Rejection Logs)
```

## Analyzing the Data

Use these insights to determine if you should:
1. **Increase the file size limit** - If many users are hitting the 5MB limit
2. **Provide better guidance** - If users are uploading very large files (20MB+)
3. **Add compression options** - If most rejected files are slightly over the limit

## Maintenance

- Logs are automatically organized by month
- Old logs can be deleted manually via FTP/SSH
- Each month creates a new file (rejections-YYYY-MM.log)
- Protected from public access via .htaccess

## Fallback Behavior

If WordPress is unavailable:
- Logs will be saved locally in development
- In production (Vercel), local logging won't persist but won't cause errors
- The form will still function normally

## Security

- Log directory protected by `.htaccess` (deny all)
- Only accessible via WordPress admin or server SSH/FTP
- IP addresses are logged for security analysis
- Ensure compliance with your privacy policy and GDPR

## WordPress Plugin Location

The logging endpoint is defined in:
- File: `wordpress-custom-endpoint.php`
- Endpoint: `/wp-json/file-logging/v1/rejection`
- Admin page: Settings → File Rejection Logs

