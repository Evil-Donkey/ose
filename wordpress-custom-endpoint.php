<?php
/**
 * Plugin Name: Email Check Endpoint
 * Description: Custom REST API endpoint for checking if an email exists
 * Version: 1.2
 * Author: Your Name
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API endpoint for email checking
 */
function register_email_check_endpoint() {
    register_rest_route('email-check/v1', '/verify', array(
        'methods' => 'POST',
        'callback' => 'check_email_exists',
        'permission_callback' => 'check_email_check_permissions',
        'args' => array(
            'email' => array(
                'required' => true,
                'type' => 'string',
                'format' => 'email',
                'sanitize_callback' => 'sanitize_email',
                'validate_callback' => 'validate_email_format',
            ),
        ),
    ));
}
add_action('rest_api_init', 'register_email_check_endpoint');

/**
 * Check permissions for email verification
 * Add rate limiting and security checks
 */
function check_email_check_permissions($request) {
    // Get client IP
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // More reasonable rate limiting: max 30 requests per IP per hour
    // This allows legitimate users to try multiple emails while still preventing abuse
    $rate_limit_key = 'email_check_rate_limit_' . md5($client_ip);
    $rate_limit_count = get_transient($rate_limit_key);
    
    if ($rate_limit_count === false) {
        // First request from this IP
        set_transient($rate_limit_key, 1, HOUR_IN_SECONDS);
    } elseif ($rate_limit_count >= 30) {
        // Rate limit exceeded
        log_email_check_attempt($client_ip, 'RATE_LIMIT_EXCEEDED', $request->get_param('email'));
        return new WP_Error('rate_limit_exceeded', 'Too many requests. Please try again later.', array('status' => 429));
    } else {
        // Increment counter
        set_transient($rate_limit_key, $rate_limit_count + 1, HOUR_IN_SECONDS);
    }
    
    // Log the attempt
    log_email_check_attempt($client_ip, 'ATTEMPT', $request->get_param('email'));
    
    return true;
}

/**
 * Validate email format
 */
function validate_email_format($email) {
    return is_email($email) && strlen($email) <= 100; // Reasonable length limit
}

/**
 * Check if email exists in the system
 */
function check_email_exists($request) {
    $email = $request->get_param('email');
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    if (empty($email)) {
        log_email_check_attempt($client_ip, 'INVALID_EMAIL', $email);
        return new WP_Error('missing_email', 'Email is required', array('status' => 400));
    }
    
    $user = get_user_by('email', $email);
    
    if ($user) {
        $user_status = get_user_meta($user->ID, 'user_status', true) ?: 'active';
        
        // Log the attempt
        log_email_check_attempt($client_ip, 'FOUND', $email, $user->ID);
        
        // Return different messages based on user status
        switch ($user_status) {
            case 'approved':
                // Send password reset email
                $email_sent = send_forgot_password_email($user->ID);
                
                if ($email_sent) {
                    return array(
                        'success' => true,
                        'exists' => true,
                        'status' => 'approved',
                        'message' => 'We\'ve sent you a password reset link',
                        'emailSent' => true,
                        'user' => array(
                            'id' => $user->ID,
                            'username' => $user->user_login,
                            'email' => $user->user_email,
                            'userStatus' => $user_status
                        )
                    );
                } else {
                    return array(
                        'success' => true,
                        'exists' => true,
                        'status' => 'approved',
                        'message' => 'Your account is approved, but we couldn\'t send the email. Please contact support.',
                        'emailSent' => false,
                        'user' => array(
                            'id' => $user->ID,
                            'username' => $user->user_login,
                            'email' => $user->user_email,
                            'userStatus' => $user_status
                        )
                    );
                }
                
            case 'denied':
            case 'pending':
                return array(
                    'success' => true,
                    'exists' => true,
                    'status' => $user_status,
                    'message' => 'Your email has not been approved yet. Please get in touch with a link to investors@oxfordsciences.com',
                    'user' => array(
                        'id' => $user->ID,
                        'username' => $user->user_login,
                        'email' => $user->user_email,
                        'userStatus' => $user_status
                    )
                );
                
            default: // 'active' or any other status
                // Send password reset email for active users too
                $email_sent = send_forgot_password_email($user->ID);
                
                if ($email_sent) {
                    return array(
                        'success' => true,
                        'exists' => true,
                        'status' => 'approved',
                        'message' => 'We\'ve sent you a password reset link',
                        'emailSent' => true,
                        'user' => array(
                            'id' => $user->ID,
                            'username' => $user->user_login,
                            'email' => $user->user_email,
                            'userStatus' => $user_status
                        )
                    );
                } else {
                    return array(
                        'success' => true,
                        'exists' => true,
                        'status' => 'approved',
                        'message' => 'Your account is active, but we couldn\'t send the email. Please contact support.',
                        'emailSent' => false,
                        'user' => array(
                            'id' => $user->ID,
                            'username' => $user->user_login,
                            'email' => $user->user_email,
                            'userStatus' => $user_status
                        )
                    );
                }
        }
    } else {
        // User doesn't exist
        log_email_check_attempt($client_ip, 'NOT_FOUND', $email);
        
        return array(
            'success' => true,
            'exists' => false,
            'status' => 'not_found',
            'message' => 'The email doesn\'t exist. Please sign up'
        );
    }
}

/**
 * Log email check attempts for security monitoring
 */
function log_email_check_attempt($ip, $action, $email, $user_id = null) {
    $log_entry = array(
        'timestamp' => current_time('mysql'),
        'ip' => $ip,
        'action' => $action,
        'email' => $email,
        'user_id' => $user_id,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    );
    
    // Store in WordPress options (last 100 attempts)
    $log_key = 'email_check_security_log';
    $logs = get_option($log_key, array());
    $logs[] = $log_entry;
    
    // Keep only last 100 entries
    if (count($logs) > 100) {
        $logs = array_slice($logs, -100);
    }
    
    update_option($log_key, $logs);
    
    // Also log to WordPress error log for server monitoring
    error_log(sprintf(
        'Email Check: IP=%s, Action=%s, Email=%s, UserID=%s',
        $ip,
        $action,
        $email,
        $user_id ?? 'none'
    ));
}

/**
 * Add CORS headers for the custom endpoint
 */
function add_cors_headers() {
    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/wp-json/email-check/') !== false) {
        // Only allow specific origins (your frontend domain)
        $allowed_origins = array(
            'http://localhost:3000',
            'http://localhost:3001', 
            'http://localhost:3002',
            'http://localhost:3003',
            'https://yourdomain.com' // Replace with your actual domain
        );
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 86400'); // 24 hours
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit();
        }
    }
}
add_action('init', 'add_cors_headers');

/**
 * Add admin page to view security logs
 */
function add_email_check_admin_page() {
    add_options_page(
        'Email Check Security',
        'Email Check Security',
        'manage_options',
        'email-check-security',
        'email_check_admin_page'
    );
}
add_action('admin_menu', 'add_email_check_admin_page');

/**
 * Admin page content
 */
function email_check_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    
    // Add clear rate limits button
    if (isset($_POST['clear_rate_limits']) && wp_verify_nonce($_POST['_wpnonce'], 'clear_rate_limits')) {
        clear_email_check_rate_limits();
        echo '<div class="notice notice-success"><p>Rate limits cleared successfully!</p></div>';
    }
    
    $logs = get_option('email_check_security_log', array());
    
    echo '<div class="wrap">';
    echo '<h1>Email Check Security Log</h1>';
    
    // Add clear rate limits form
    echo '<form method="post" style="margin-bottom: 20px;">';
    wp_nonce_field('clear_rate_limits');
    echo '<input type="submit" name="clear_rate_limits" value="Clear Rate Limits" class="button button-secondary">';
    echo '<p class="description">Use this to clear rate limits if legitimate users are being blocked.</p>';
    echo '</form>';
    
    echo '<p>Recent email check attempts (last 100):</p>';
    
    if (empty($logs)) {
        echo '<p>No logs found.</p>';
    } else {
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead><tr><th>Time</th><th>IP</th><th>Action</th><th>Email</th><th>User ID</th></tr></thead>';
        echo '<tbody>';
        
        foreach (array_reverse($logs) as $log) {
            echo '<tr>';
            echo '<td>' . esc_html($log['timestamp']) . '</td>';
            echo '<td>' . esc_html($log['ip']) . '</td>';
            echo '<td>' . esc_html($log['action']) . '</td>';
            echo '<td>' . esc_html($log['email']) . '</td>';
            echo '<td>' . esc_html($log['user_id'] ?? 'none') . '</td>';
            echo '</tr>';
        }
        
        echo '</tbody></table>';
    }
    
    echo '</div>';
}

/**
 * Clear all email check rate limits
 */
function clear_email_check_rate_limits() {
    global $wpdb;
    
    // Delete all transients that start with email_check_rate_limit_
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
            '_transient_email_check_rate_limit_%'
        )
    );
    
    // Also delete the transient timeouts
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
            '_transient_timeout_email_check_rate_limit_%'
        )
    );
}



// Send forgot password email to approved users
function send_forgot_password_email($user_id) {
    $user = get_userdata($user_id);
    $email = $user->user_email;
    
    // Generate password reset key
    $reset_key = get_password_reset_key($user);

    // Set expiration time (24 hours from now - shorter for security)
    $expires_at = time() + (24 * 60 * 60);

    // Encode the reset key and user_login to avoid URL issues
    $reset_token = urlencode(base64_encode(json_encode([
        'key' => $reset_key,
        'login' => $user->user_login,
        'expires' => $expires_at
    ])));

    // URL to Next.js password reset page
    $reset_link = "https://ose-git-staging-evildonkeyuk.vercel.app/reset-password?token=" . $reset_token;

    // Email subject and copy (you can customize these)
    $subject = "Reset Your Password - Oxford Science Enterprises";
    
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
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <img src="https://oxfordscienceenterprises-cms.com/wp-content/uploads/2025/08/ose-logo.jpg" alt="Oxford Science Enterprises Logo" />
            </div>
            <p>Hi ' . esc_html($user->display_name) . ',</p>
            <p>We received a request to reset your password for your Oxford Science Enterprises account.</p>
            
            <a class="button" href="' . esc_url($reset_link) . '">Reset Your Password</a>
            
            <p>If the button above does not work, copy and paste the following link into your browser:</p>
            <a href="' . esc_url($reset_link) . '">' . esc_url($reset_link) . '</a>
            
            <div class="warning">
                <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
                <p>If you did not request this password reset, please ignore this email or contact us immediately.</p>
            </div>
            
            <p>Once you\'ve reset your password, you can log in using:</p>
            <p><b>Username:</b> ' . esc_html($user->user_login) . '</p>
            
            <p>If you need any assistance, please contact us at <a href="mailto:investors@oxfordsciences.com">investors@oxfordsciences.com</a>.</p>
            
            <p>Kind regards,<br/>
            Oxford Science Enterprises (OSE)</p>
            
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
        error_log("Forgot password email failed to send to: " . $email);
        return false;
    } else {
        error_log("Forgot password email sent successfully to: " . $email);
        return true;
    }
}