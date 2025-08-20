# Forgot Password Setup

This document explains how to set up the forgot password functionality for the Oxford Science Enterprises investor portal.

## Overview

The forgot password functionality includes:
1. A new page at `/forgot-password` where users can enter their email address
2. An API endpoint that checks if the user exists and their approval status
3. Integration with WordPress GraphQL to send password reset emails
4. User status checking to ensure only approved users can reset their passwords

## Files Created

- `src/app/forgot-password/page.js` - The forgot password page
- `src/app/api/auth/forgot-password/route.js` - API endpoint for processing forgot password requests

## Environment Variables Required

No additional environment variables are required for the forgot password functionality. The system uses your existing WordPress GraphQL endpoint.

## WordPress Setup

### 1. Add GraphQL Field for User Status

Add the following code to your WordPress plugin or `functions.php`:

```php
// Add user_status field to GraphQL User type
add_action('graphql_register_types', function() {
    register_graphql_field('User', 'userStatus', [
        'type' => 'String',
        'description' => __('User approval status', 'your-text-domain'),
        'resolve' => function($user) {
            return get_user_meta($user->ID, 'user_status', true) ?: 'pending';
        }
    ]);
});
```

### 2. User Status Plugin

The system expects a WordPress plugin that manages user approval status. The plugin should:

1. Save user status in the `user_status` meta field
2. Handle status changes (approved, pending, denied)
3. Send appropriate emails when status changes

Example plugin function (already provided by user):
```php
function save_user_approval_status($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    if (isset($_POST['user_status'])) {
        $previous_status = get_user_meta($user_id, 'user_status', true);
        $new_status = sanitize_text_field($_POST['user_status']);

        update_user_meta($user_id, 'user_status', $new_status);

        // If user is approved and was not previously approved, send the email
        if ($previous_status !== 'approved' && $new_status === 'approved') {
            send_approval_email($user_id);
        }
        
        if ($previous_status !== 'denied' && $new_status === 'denied') {
            send_denied_email($user_id);
        }
		
		if ($previous_status !== 'pending' && $new_status === 'pending') {
            send_user_signup_email($user_id);
        }
    }
}
add_action('personal_options_update', 'save_user_approval_status');
add_action('edit_user_profile_update', 'save_user_approval_status');
```

## How It Works

1. **User enters email**: User visits `/forgot-password` and enters their email address
2. **Check user existence and status**: The system checks if a user with that email exists and gets their approval status using WordPress GraphQL
3. **Send reset email**: Only if the user exists and is approved, a password reset email is sent via WordPress GraphQL
4. **Security**: The system always returns success to prevent email enumeration attacks

## User Status Logic

- **User doesn't exist**: Returns success (no email sent)
- **User exists but status is 'pending'**: Returns success (no email sent)
- **User exists but status is 'denied'**: Returns success (no email sent)
- **User exists and status is 'approved'**: Sends password reset email

## Testing

1. Create a test user in WordPress with status 'pending'
2. Try the forgot password flow - should not send email
3. Change user status to 'approved'
4. Try the forgot password flow again - should send email
5. Test with non-existent email - should not reveal user existence

## Security Considerations

- The system always returns success to prevent email enumeration
- User status is checked before sending reset emails
- WordPress GraphQL handles the actual password reset email sending
- Application passwords are used for secure API access

## Troubleshooting

### Common Issues

1. **"Failed to send password reset email"**: Check WordPress GraphQL configuration and email settings
2. **User status not found**: Ensure the WordPress plugin is properly saving the `user_status` meta field and the GraphQL field is registered
3. **GraphQL field not available**: Make sure the `userStatus` field is properly registered in your WordPress GraphQL schema

### Debug Logs

The system includes comprehensive logging. Check your server logs for:
- `📧 User not found for email:`
- `📧 User status for [email]: [status]`
- `📧 User not approved, status:`
- `✅ Password reset email sent successfully to:`

### Debugging GraphQL Field

1. **Check WordPress error logs** for the debugging messages from the GraphQL resolve function
2. **Test GraphQL directly** by visiting your WordPress GraphQL endpoint and running:
   ```graphql
   query TestUserStatus {
     user(email: "your-test-email@example.com") {
       id
       username
       email
       userStatus
     }
   }
   ```
3. **Verify user meta exists** by checking the WordPress database directly:
   ```sql
   SELECT user_id, meta_key, meta_value 
   FROM wp_usermeta 
   WHERE meta_key = 'user_status' 
   AND user_id = [your-user-id];
   ```
4. **Clear GraphQL cache** if you're using any caching plugins
