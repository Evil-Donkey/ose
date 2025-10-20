# Contact Form 7 - File Attachment Handler Setup

## Problem
When files are uploaded through Contact Form 7, the receiver is not receiving the attached files in their email.

## Solution
This plugin ensures that all uploaded files are **properly attached to Contact Form 7 emails**. It automatically collects all uploaded files and adds them as email attachments.

## Benefits
- ✅ Files are sent as email attachments (traditional approach)
- ✅ Automatically handles all file fields
- ✅ Works with multiple file uploads
- ✅ Includes server optimization for larger files
- ✅ Debugging logs to troubleshoot issues

## Installation

### Option 1: As a Plugin (Recommended)

1. Copy the `wordpress-cf7-file-url-in-email.php` file
2. Upload it to your WordPress site at: `/wp-content/plugins/wordpress-cf7-file-url-in-email.php`
3. Go to WordPress Admin → Plugins
4. Find "CF7 File Attachment Handler" and activate it

### Option 2: Add to Theme Functions

Alternatively, you can add the code from `wordpress-cf7-file-url-in-email.php` to your theme's `functions.php` file (excluding the plugin header comment).

## How It Works

When a form is submitted with a file attachment:

1. The file is uploaded to WordPress (as usual)
2. The plugin intercepts the email sending process
3. It ensures all uploaded files are added as email attachments
4. The email is sent with files properly attached

## What Gets Attached

The plugin automatically attaches:
- All files uploaded through any file upload field in your Contact Form 7
- Multiple files if the form allows multiple uploads
- Files of any type allowed by your form configuration (.pdf, .txt, etc.)

## Server Optimizations

The plugin includes:
- Increased memory limit (256M) for handling larger files
- Extended execution time (300 seconds) for processing
- Debug logging to track file attachment status

## Configuration

No configuration needed! The plugin works automatically once activated. However, you should also check your Contact Form 7 mail settings:

### Contact Form 7 Mail Configuration

1. Go to WordPress Admin → Contact → Contact Forms
2. Edit your form (Form ID: 1568)
3. Go to the "Mail" tab
4. In the "File Attachments" field, add: `[file]`
5. Save the form

This tells Contact Form 7 to include the file field in email attachments.

## Testing

1. Submit a test form with a file attachment
2. Check the email received
3. You should see:
   - All form data as usual
   - The file attached to the email (check attachments)
   
4. Check WordPress debug logs at `/wp-content/debug.log` to see:
   ```
   Contact Form 7 - Files uploaded and will be attached:
     - Field: file, File: Rateyourcyber_accelerate.pdf (2.5 MB)
   ```

## Troubleshooting

### Files still not arriving as attachments?

**Check these common issues:**

1. **Email server limits**: Some email providers (Gmail, Outlook) have attachment size limits:
   - Gmail: 25MB limit
   - Outlook: 20MB limit
   - Your hosting provider may have lower limits

2. **Check WordPress logs**:
   - Enable debug logging in `wp-config.php`:
     ```php
     define('WP_DEBUG', true);
     define('WP_DEBUG_LOG', true);
     define('WP_DEBUG_DISPLAY', false);
     ```
   - Check `/wp-content/debug.log` for error messages

3. **Test with smaller files**:
   - Try uploading a small text file (< 1MB) to verify the mechanism works
   - If small files work but large ones don't, it's a size limit issue

4. **Mail delivery method**:
   - Default PHP `mail()` function may have issues with attachments
   - Consider using an SMTP plugin like "WP Mail SMTP" or "Easy WP SMTP"
   - These provide more reliable email delivery with attachments

5. **Check spam folder**:
   - Emails with attachments are more likely to be flagged as spam
   - Ask the receiver to check their spam/junk folder

### Alternative Solution: Use File URLs

If attachments continue to fail due to server/email provider restrictions, you can modify the plugin to include file download URLs instead. See the git history for the URL-based version of this plugin.

## Important Note About Email Attachments

Email attachments can fail for several reasons:

1. **Size limits** - Most email providers limit attachment sizes
2. **Spam filters** - Attachments trigger spam filters
3. **Server restrictions** - Hosting providers may limit email functionality
4. **File types** - Some file types are blocked for security

**Recommended approach for production:**
- Keep file size limits on the form (current: 3MB - good!)
- Use an SMTP plugin for reliable email delivery
- Consider notifying users that files may take time to arrive
- Have a backup plan (like providing file URLs in the email body)

## Support

For questions or issues:
1. Check WordPress error logs at `/wp-content/debug.log`
2. Enable WP_DEBUG in `wp-config.php` to see detailed errors
3. Check the browser console when submitting forms
4. Test with different file sizes and types

## Recommended SMTP Plugins

To improve email delivery reliability with attachments:

1. **WP Mail SMTP** (Free)
   - Supports Gmail, SendGrid, Mailgun, etc.
   - Better reliability than PHP mail()
   
2. **Easy WP SMTP** (Free)
   - Simple configuration
   - Works with most email providers

3. **Post SMTP** (Free)
   - Advanced features
   - Email logging

## Related Files

- `wordpress-cf7-file-url-in-email.php` - The plugin file (upload to WordPress)
- `src/components/Form/index.js` - The Next.js form component
- `SECURE_FILE_DOWNLOAD.md` - Guide for implementing secure file downloads

