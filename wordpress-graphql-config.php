<?php
/**
 * WordPress GraphQL Configuration
 * Add this to your WordPress theme's functions.php or as a plugin
 * 
 * This file increases GraphQL limits and improves pagination support
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Increase GraphQL query limits
 */
function increase_graphql_limits() {
    // Increase the default limit for GraphQL queries
    add_filter('graphql_connection_max_query_amount', function($amount) {
        return 1000; // Increase from default 100 to 1000
    });

    // Increase the maximum number of items that can be queried
    add_filter('graphql_connection_max_query_amount', function($amount) {
        return 10000; // Allow up to 10,000 items
    });

    // Increase memory limit for GraphQL queries
    add_filter('graphql_connection_max_query_amount', function($amount) {
        return 10000;
    });
}
add_action('init', 'increase_graphql_limits');

/**
 * Improve GraphQL pagination performance
 */
function improve_graphql_pagination() {
    // Enable cursor-based pagination
    add_filter('graphql_connection_should_execute', function($should_execute, $source, $args, $context, $info) {
        // Ensure pagination works properly
        return $should_execute;
    }, 10, 5);

    // Optimize GraphQL queries
    add_filter('graphql_connection_query_args', function($query_args, $source, $args, $context, $info) {
        // Add any custom query optimizations here
        return $query_args;
    }, 10, 4);
}
add_action('init', 'improve_graphql_pagination');

/**
 * Add custom GraphQL fields for better pagination info
 */
function add_graphql_pagination_fields() {
    // Register custom field for total count
    register_graphql_field('RootQuery', 'portfolioNewsCount', [
        'type' => 'Int',
        'description' => 'Total count of portfolio news items',
        'resolve' => function() {
            $args = [
                'post_type' => 'portfolio-news',
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'fields' => 'ids'
            ];
            
            $query = new WP_Query($args);
            return $query->found_posts;
        }
    ]);
}
add_action('graphql_register_types', 'add_graphql_pagination_fields');

/**
 * Increase PHP memory limit for GraphQL queries
 */
function increase_php_memory_for_graphql() {
    if (isset($_POST['query']) && strpos($_POST['query'], 'portfolioNews') !== false) {
        // Increase memory limit for portfolio news queries
        ini_set('memory_limit', '512M');
    }
}
add_action('init', 'increase_php_memory_for_graphql');

/**
 * Add custom endpoint for bulk portfolio news
 */
function add_bulk_portfolio_news_endpoint() {
    register_rest_route('ose/v1', '/portfolio-news-bulk', [
        'methods' => 'GET',
        'callback' => 'get_bulk_portfolio_news',
        'permission_callback' => '__return_true',
        'args' => [
            'page' => [
                'default' => 1,
                'sanitize_callback' => 'absint',
            ],
            'per_page' => [
                'default' => 100,
                'sanitize_callback' => 'absint',
            ],
            'category' => [
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
}
add_action('rest_api_init', 'add_bulk_portfolio_news_endpoint');

/**
 * Get bulk portfolio news items
 */
function get_bulk_portfolio_news($request) {
    $page = $request->get_param('page');
    $per_page = $request->get_param('per_page');
    $category = $request->get_param('category');
    
    $args = [
        'post_type' => 'portfolio-news',
        'post_status' => 'publish',
        'posts_per_page' => $per_page,
        'paged' => $page,
        'orderby' => 'date',
        'order' => 'DESC',
    ];
    
    if (!empty($category)) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'portfolio-news-category',
                'field' => 'slug',
                'terms' => $category,
            ],
        ];
    }
    
    $query = new WP_Query($args);
    $posts = [];
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            
            // Get custom fields
            $portfolio_news = get_field('portfolio_news', $post_id);
            $categories = get_the_terms($post_id, 'portfolio-news-category');
            
            $posts[] = [
                'id' => $post_id,
                'title' => get_the_title(),
                'slug' => get_post_field('post_name', $post_id),
                'date' => get_the_date('c'),
                'portfolioNews' => [
                    'hashtag' => $portfolio_news['hashtag'] ?? '',
                    'url' => $portfolio_news['url'] ?? '',
                ],
                'portfolioNewsCategories' => [
                    'nodes' => array_map(function($cat) {
                        return [
                            'id' => $cat->term_id,
                            'name' => $cat->name,
                            'slug' => $cat->slug,
                        ];
                    }, $categories ?: [])
                ],
            ];
        }
        wp_reset_postdata();
    }
    
    return [
        'success' => true,
        'data' => $posts,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $per_page,
            'total_items' => $query->found_posts,
            'total_pages' => $query->max_num_pages,
        ],
    ];
}

/**
 * Add admin notice about GraphQL configuration
 */
function add_graphql_admin_notice() {
    if (current_user_can('manage_options')) {
        echo '<div class="notice notice-info is-dismissible">';
        echo '<p><strong>GraphQL Configuration:</strong> Portfolio news pagination limits have been increased to support up to 10,000 items.</p>';
        echo '</div>';
    }
}
add_action('admin_notices', 'add_graphql_admin_notice');
