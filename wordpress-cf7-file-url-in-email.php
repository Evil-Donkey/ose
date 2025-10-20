<?php
/**
 * Plugin Name: CF7 File Attachment Handler
 * Description: Ensures files are properly attached to Contact Form 7 emails
 * Version: 1.0
 * Author: Oxford Science Enterprises
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Ensure files are attached to Contact Form 7 emails
 * This hooks into CF7 and makes sure all uploaded files are added as attachments
 */
add_filter('wpcf7_mail_components', 'ensure_cf7_file_attachments', 10, 3);

function ensure_cf7_file_attachments($components, $cf7_form, $mail_object) {
    // Get the form submission
    $submission = WPCF7_Submission::get_instance();
    
    if (!$submission) {
        return $components;
    }
    
    // Get uploaded files
    $uploaded_files = $submission->uploaded_files();
    
    if (empty($uploaded_files)) {
        return $components;
    }
    
    // Build attachments array
    $attachments = array();
    
    foreach ($uploaded_files as $field_name => $file_path) {
        if (is_array($file_path)) {
            // Multiple files
            foreach ($file_path as $single_file) {
                if (!empty($single_file) && file_exists($single_file)) {
                    $attachments[] = $single_file;
                }
            }
        } else {
            // Single file
            if (!empty($file_path) && file_exists($file_path)) {
                $attachments[] = $file_path;
            }
        }
    }
    
    // Set attachments in the email components
    if (!empty($attachments)) {
        // If there are existing attachments, merge them
        if (!empty($components['attachments'])) {
            if (is_string($components['attachments'])) {
                $existing = explode("\n", $components['attachments']);
                $attachments = array_merge($existing, $attachments);
            } elseif (is_array($components['attachments'])) {
                $attachments = array_merge($components['attachments'], $attachments);
            }
        }
        
        // Set the attachments
        $components['attachments'] = $attachments;
    }
    
    return $components;
}

/**
 * Optional: Log file uploads and attachments for debugging
 */
add_action('wpcf7_before_send_mail', 'log_cf7_file_uploads');

function log_cf7_file_uploads($cf7_form) {
    $submission = WPCF7_Submission::get_instance();
    
    if (!$submission) {
        return;
    }
    
    $uploaded_files = $submission->uploaded_files();
    
    if (!empty($uploaded_files)) {
        error_log('Contact Form 7 - Files uploaded and will be attached:');
        foreach ($uploaded_files as $field_name => $file_path) {
            if (is_array($file_path)) {
                foreach ($file_path as $single_file) {
                    error_log("  - Field: {$field_name}, File: " . basename($single_file) . " (" . size_format(filesize($single_file)) . ")");
                }
            } else {
                error_log("  - Field: {$field_name}, File: " . basename($file_path) . " (" . size_format(filesize($file_path)) . ")");
            }
        }
    } else {
        error_log('Contact Form 7 - No files uploaded with this submission');
    }
}

/**
 * Increase maximum email attachment size limit
 * Some servers have low limits that prevent file attachments
 */
add_filter('wp_mail', 'increase_email_attachment_limit', 10, 1);

function increase_email_attachment_limit($args) {
    // Set a reasonable limit (10MB)
    @ini_set('memory_limit', '256M');
    @ini_set('max_execution_time', '300');
    
    return $args;
}
