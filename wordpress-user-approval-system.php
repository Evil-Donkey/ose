<?php
/**
 * Plugin Name: User Approval System
 * Plugin URI:  https://yourwebsite.com
 * Description: Adds an approval system for new user registrations.
 * Version: 1.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

// Prevent unapproved users from logging in
function prevent_unapproved_users_login($user, $username, $password = null) {
    // Check for error in user object
    if (is_wp_error($user)) {
        return $user;
    }

    // Get user status from metadata
    $status = get_user_meta($user->ID, 'user_status', true);

    // Handle 'pending' status
    if ($status === 'pending') {
        return new WP_Error('approval_pending', 'Your account is pending approval.');
    }

    // Handle 'denied' status
    if ($status === 'denied') {
        return new WP_Error('approval_denied', 'Your account application was denied.');
    }

    return $user;
}
add_filter('wp_authenticate_user', 'prevent_unapproved_users_login', 10, 3);


// Add a meta box to the user profile for approval status
function add_user_approval_meta_box($user) {
    $status = get_user_meta($user->ID, 'user_status', true);
    ?>
    <div id="approval-section">
        <h2>User Approval</h2>
        <table class="form-table">
            <tr>
                <th><label for="user_status">Approval Status</label></th>
                <td>
                    <input type="radio" name="user_status" value="pending" <?php checked($status, 'pending'); ?>> Pending<br>
                    <input type="radio" name="user_status" value="approved" <?php checked($status, 'approved'); ?>> Approved<br>
                    <input type="radio" name="user_status" value="denied" <?php checked($status, 'denied'); ?>> Denied
                </td>
            </tr>
        </table>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            var approvalSection = document.getElementById("approval-section");
            var profileForm = document.getElementById("your-profile"); // WordPress profile form container

            if (approvalSection && profileForm) {
                profileForm.insertBefore(approvalSection, profileForm.firstChild); // Move only the div
            }
        });
    </script>
    <?php
}
add_action('edit_user_profile', 'add_user_approval_meta_box');
add_action('show_user_profile', 'add_user_approval_meta_box');


// Save the approval status when the user profile is updated
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


// Add user_status field to GraphQL User type
add_action('graphql_register_types', function() {
    register_graphql_field('User', 'userStatus', [
        'type' => 'String',
        'description' => __('User approval status', 'your-text-domain'),
        'resolve' => function($user) {
            // Get the real WordPress user ID
            $user_id = $user->ID ?? $user->userId ?? $user->databaseId ?? null;

            if (!$user_id) {
                error_log('GraphQL: Could not resolve user ID');
                return 'pending';
            }

            $status = get_user_meta($user_id, 'user_status', true);

            // Default to pending if not set
            return $status ?: 'pending';
        }
    ]);
});



// Send an email to the user when their account is approved
function send_approval_email($user_id) {
    $user = get_userdata($user_id);
    $email = $user->user_email;
    
    // Generate password reset key
    $reset_key = get_password_reset_key($user);

    // Set expiration time (30 days from now)
    $expires_at = time() + (30 * 24 * 60 * 60);

    // Encode the reset key and user_login to avoid URL issues
    $reset_token = urlencode(base64_encode(json_encode([
        'key' => $reset_key,
        'login' => $user->user_login,
        'expires' => $expires_at
    ])));

    // URL to Next.js password reset page
    #$reset_link = "http://localhost:3000/create-password?token=" . $reset_token;
	$reset_link = "https://ose-six.vercel.app/create-password?token=" . $reset_token;

    // Email subject
    $subject = get_field('approved_email_subject', 'options');
	$copy = get_field('approved_email_copy', 'options');
	
	$first_name = get_user_meta( $user->ID, 'first_name', true );
	if ( empty( $first_name ) ) {
		$first_name = $user->display_name; // fallback
	}

    // Styled HTML email template
    $message = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
            .logo { margin-bottom: 20px; }
            .logo img { max-width: 150px; }
            p { color: #666; }
            .button {
                display: block; width: 200px; margin: 20px auto; padding: 10px 20px;
                text-align: center; background-color: #0073e6; color: white !important;
                text-decoration: none; border-radius: 5px; font-size: 16px;
            }
            .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Hi ' . esc_html($first_name) . '</p>'
            . $copy .
			'<a class="button" href="' . esc_url($reset_link) . '">Set Your Password</a>
			<p>If the button above does not work, copy and paste the following link into your browser:</p>
			<a href="' . esc_url($reset_link) . '">' . esc_url($reset_link) . '</a>
			<p>Once your password is set, you can log in at any time using:</p>
			<p><b>Email:</b> ' . esc_html($user->user_email) . '<br/>
			<b>Password:</b> Your chosen password</p>
			<p>If you need any assistance, please contact us at <a href="mailto:investors@oxfordsciences.com">investors@oxfordsciences.com</a>.</p>
			<p>Kind regards</p>
			<div class="logo">
                <img src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/2025/09/OSE-POSITIVE-RGB-LOGO.png" alt="Oxford Science Enterprises Logo" />
            </div>
            <div class="footer">
                <p>&copy; ' . date('Y') . ' Oxford Science Enterprises. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Oxford Science Enterprises <investors@oxfordsciences.com>',
        'Reply-To: investors@oxfordsciences.com'
    ];

    $mail_sent = wp_mail($email, $subject, $message, $headers);

    if (!$mail_sent) {
        error_log("Approval email failed to send to: " . $email);
    } else {
        error_log("Approval email sent successfully to: " . $email);
    }
}


// Send an email to the user when their account is denied
function send_denied_email($user_id) {
    $user = get_userdata($user_id);
    $email = $user->user_email;

    // Email subject
    $subject = get_field('denied_email_subject', 'options');
	$copy = get_field('denied_email_copy', 'options');
	
	$first_name = get_user_meta( $user->ID, 'first_name', true );
	if ( empty( $first_name ) ) {
		$first_name = $user->display_name; // fallback
	}

    // Styled HTML email template
    $message = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
            .logo { center; margin-bottom: 20px; }
            .logo img { max-width: 150px; }
            p { color: #666; }
            .button {
                display: block; width: 200px; margin: 20px auto; padding: 10px 20px;
                text-align: center; background-color: #0073e6; color: white !important;
                text-decoration: none; border-radius: 5px; font-size: 16px;
            }
            .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Hi ' . esc_html($first_name) . '</p>'
            . $copy .
            '<div class="logo">
                <img src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/2025/09/OSE-POSITIVE-RGB-LOGO.png" alt="Oxford Science Enterprises Logo" />
            </div>
			<div class="footer">
                <p>&copy; ' . date('Y') . ' Oxford Science Enterprises. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Oxford Science Enterprises <investors@oxfordsciences.com>',
        'Reply-To: investors@oxfordsciences.com'
    ];

    $mail_sent = wp_mail($email, $subject, $message, $headers);

    if (!$mail_sent) {
        error_log("Denied email failed to send to: " . $email);
    } else {
        error_log("Denied email sent successfully to: " . $email);
    }
}


// Send a welcome email after user registration using WP Mail SMTP (Brevo)
function send_user_signup_email($user_id) {
    $user = get_userdata($user_id);
    $email = $user->user_email;
    $username = $user->user_login;

	$subject = get_field('welcome_email_subject', 'options');
	$copy = get_field('welcome_email_copy', 'options');
	
	$first_name = get_user_meta( $user->ID, 'first_name', true );
	if ( empty( $first_name ) ) {
		$first_name = $user->display_name; // fallback
	}

    // Styled HTML email template
    $message = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
            .logo { margin-bottom: 20px; }
            .logo img { max-width: 150px; }
            p { color: #666; }
            .button {
                display: block; width: 200px; margin: 20px auto; padding: 10px 20px;
                text-align: center; background-color: #0073e6; color: white !important;
                text-decoration: none; border-radius: 5px; font-size: 16px;
            }
            .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Hi ' . esc_html($first_name) . '</p>'
            . $copy .
            '<div class="logo">
                <img src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/2025/09/OSE-POSITIVE-RGB-LOGO.png" alt="Oxford Science Enterprises Logo" />
            </div>
			<div class="footer">
                <p>&copy; ' . date('Y') . ' Oxford Science Enterprises. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';

    // Set the correct content type header for HTML emails
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Oxford Science Enterprises <investors@oxfordsciences.com>',
        'Reply-To: investors@oxfordsciences.com'
    ];

    // Send the email using wp_mail
    $mail_sent = wp_mail($email, $subject, $message, $headers);

    if (!$mail_sent) {
        error_log("Signup email failed to send to: " . $email);
    } else {
        error_log("Signup email sent successfully to: " . $email);
    }
}
// Hook into WordPress user registration
add_action('user_register', 'send_user_signup_email');



// Send admin notification email after user registration
function send_admin_new_user_notification($user_id) {
    $user = get_userdata($user_id);

    // Get user data
    $first_name = get_user_meta($user->ID, 'first_name', true);
    $last_name  = get_user_meta($user->ID, 'last_name', true);
    $email      = $user->user_email;

    // Get ACF fields (Organisation & Role)
    $organisation = get_field('organisation', 'user_' . $user_id);
    $organisation_role = get_field('organisation_role', 'user_' . $user_id);

    // Email subject
    $subject = 'OSE Shareholder Portal: New User Registration';

    // Email body (HTML)
    $message = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
            p { color: #333; }
            .button {
                display: inline-block; margin-top: 20px; padding: 10px 20px;
                background-color: #0073e6; color: white !important; text-decoration: none;
                border-radius: 5px; font-size: 16px;
            }
            .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <p>A new user has requested access to the OSE investor portal:</p>
            <p><b>Name:</b> ' . esc_html($first_name . ' ' . $last_name) . '<br/>
               <b>Email:</b> ' . esc_html($email) . '</p>
            <p>Please log in to the CMS to approve or deny this registration.</p>
            <a href="' . esc_url(admin_url()) . '" class="button">Login to CMS</a>
            <div class="footer">
                <p>&copy; ' . date('Y') . ' Oxford Science Enterprises. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';

    // Headers
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Oxford Science Enterprises <investors@oxfordsciences.com>',
        'Reply-To: investors@oxfordsciences.com'
    ];

    // Send email
    $mail_sent = wp_mail('investors@oxfordsciences.com', $subject, $message, $headers);

    if (!$mail_sent) {
        error_log("Admin notification email failed to send for user ID: " . $user_id);
    } else {
        error_log("Admin notification email sent successfully for user ID: " . $user_id);
    }
}

// Hook into user registration
add_action('user_register', 'send_admin_new_user_notification');




// Add a column to the user list table for approval status
function add_user_status_column($columns) {
    $columns['user_status'] = 'Approval Status';
    return $columns;
}
add_filter('manage_users_columns', 'add_user_status_column');

// Display the approval status in the user list table
function show_user_status_column($value, $column_name, $user_id) {
    if ($column_name == 'user_status') {
        $status = get_user_meta($user_id, 'user_status', true);
        if (!$status) {
            return '<span style="color: gray;">Pending</span>';
        }
        return ucfirst($status);
    }
    return $value;
}
add_filter('manage_users_custom_column', 'show_user_status_column', 10, 3);


// Prevent unapproved users from logging in
function restrict_unapproved_users($user, $username, $password = null) {
    if (!is_wp_error($user)) {
        $approval_status = get_user_meta($user->ID, 'user_status', true);

        if ($approval_status !== 'approved') {
            // Specific error message for better clarity
            return new WP_Error('approval_required', __('Your account is pending approval. Please wait for an admin to approve your request.'));
        }
    }
    return $user;
}
add_filter('wp_authenticate_user', 'restrict_unapproved_users', 10, 3);


// Invalidate expired password reset keys
function invalidate_expired_password_reset_keys() {
    global $wpdb;

    // Fetch users with reset keys older than 30 days
    $threshold = time() - (30 * 24 * 60 * 60);
    $users = $wpdb->get_results("SELECT ID FROM {$wpdb->users} WHERE user_activation_key != ''");

    foreach ($users as $user) {
        $user_data = get_userdata($user->ID);
        $reset_key = get_password_reset_key($user_data);

        if (!empty($reset_key)) {
            // If reset key was created before threshold, invalidate it
            if (strtotime($user_data->user_registered) < $threshold) {
                delete_user_meta($user->ID, 'user_activation_key');
            }
        }
    }
}

// Schedule cleanup (runs daily)
if (!wp_next_scheduled('invalidate_expired_keys_event')) {
    wp_schedule_event(time(), 'daily', 'invalidate_expired_keys_event');
}

add_action('invalidate_expired_keys_event', 'invalidate_expired_password_reset_keys');
