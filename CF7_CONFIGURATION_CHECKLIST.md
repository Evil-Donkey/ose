# Contact Form 7 Configuration Checklist

## Quick Setup Guide for File Attachments

### Step 1: Upload and Activate the Plugin

1. Upload `wordpress-cf7-file-url-in-email.php` to `/wp-content/plugins/`
2. Go to WordPress Admin → Plugins
3. Activate "CF7 File Attachment Handler"

### Step 2: Configure Contact Form 7

Go to: **WordPress Admin → Contact → Contact Forms → Edit Form (ID: 1568)**

#### Mail Tab Settings

In the **Mail** tab, ensure these settings:

**To:**
```
your-email@example.com
```

**From:**
```
[your-name] <[your-email]>
```

**Subject:**
```
Website Form Submission - [your-subject]
```

**Message Body:**
```
First Name: [first-name]
Last Name: [last-name]
Email: [email]
Connection to Oxford: [connection]
Other Connection: [other-connection]
University Department: [university-department]

Research Summary:
[summary]

Challenge:
[challenge]

Conversation Goals:
[conversation]

Sector:
[sectors]
```

**File Attachments:** ⚠️ **IMPORTANT - Add this line:**
```
[file]
```

### Step 3: Verify Form Field

In the **Form** tab, ensure you have a file upload field that looks like this:

```
[file* file limit:3mb filetypes:txt|pdf]
```

This means:
- `file*` = required field
- `file` = field name (must match what you put in File Attachments)
- `limit:3mb` = 3MB size limit
- `filetypes:txt|pdf` = only allow .txt and .pdf files

### Step 4: Test the Setup

1. **Submit a test form** with a file attached
2. **Check the email** - you should see the file as an attachment
3. **Check WordPress logs** at `/wp-content/debug.log` for this message:
   ```
   Contact Form 7 - Files uploaded and will be attached:
     - Field: file, File: [filename].pdf (X MB)
   ```

### Common Mistakes to Avoid

❌ **Forgetting to add `[file]` in File Attachments field**
- This is the most common issue!
- Without this, CF7 won't attach the file

❌ **Field name mismatch**
- If your form field is `[file document]`, use `[document]` in attachments
- They must match exactly

❌ **Not activating the plugin**
- The plugin must be active for this to work
- Check: WordPress Admin → Plugins → look for "CF7 File Attachment Handler"

### Testing Checklist

- [ ] Plugin uploaded and activated
- [ ] `[file]` added to "File Attachments" in Mail tab
- [ ] Test submission sent
- [ ] Email received with attachment
- [ ] WordPress debug log shows file was attached

### Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| No email received at all | Check spam folder, verify email settings |
| Email received but no attachment | Check "File Attachments" field in Mail tab |
| File too large errors | Reduce file size limit or increase server limits |
| Attachment blocked by email | Use SMTP plugin (WP Mail SMTP recommended) |
| Files upload but email fails | Check WordPress debug logs for errors |

### Additional Configuration (Optional)

#### Enable Debug Logging

Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

#### Increase Server Limits (if needed)

Add to `wp-config.php`:
```php
@ini_set('upload_max_filesize', '10M');
@ini_set('post_max_size', '10M');
@ini_set('memory_limit', '256M');
```

#### Install SMTP Plugin (Recommended)

1. Install "WP Mail SMTP" plugin
2. Configure with your email provider
3. Test email delivery
4. This significantly improves email reliability with attachments

### Support

If files still aren't attaching:
1. Check all settings above
2. Review WordPress debug logs
3. Test with a smaller file (< 1MB)
4. Consider using SMTP plugin
5. As last resort, switch to URL-based approach (see CF7_FILE_URL_SETUP.md)


