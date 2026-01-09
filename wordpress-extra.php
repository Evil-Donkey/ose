<?php
// Options page
if( function_exists('acf_add_options_page') ) {
    // add parent
   $parent = acf_add_options_page(array(
       'page_title' 	=> 'Theme General Settings',
       'menu_title' 	=> 'Theme Settings',
       'redirect' 		=> false,
       'position'		=> 2,
       'icon_url'		=> 'dashicons-admin-generic',
       'show_in_graphql' => true
   ));
}


// Add Custom User Registration Mutation
add_action('graphql_register_types', function () {
   // Register custom fields for User type
   register_graphql_field('User', 'organisation', [
       'type' => 'String',
       'description' => 'The organisation of the user',
       'resolve' => function($user) {
           return get_user_meta($user->ID, 'organisation', true);
       }
   ]);

   register_graphql_field('User', 'organisationRole', [
       'type' => 'String',
       'description' => 'The role of the user within the organisation',
       'resolve' => function($user) {
           return get_user_meta($user->ID, 'organisationRole', true); // Assuming 'role' is a user meta
       }
   ]);

   // Combine organisation and role into a custom field
   register_graphql_field('User', 'userOrganisationAndRole', [
       'type' => 'UserOrganisationAndRole', // Custom Type that includes both fields
       'description' => 'User organisation and role',
       'resolve' => function($user) {
           return [
               'organisation' => get_user_meta($user->ID, 'organisation', true),
               'organisationRole' => get_user_meta($user->ID, 'organisation_role', true),
           ];
       }
   ]);

   // Register the custom type for the 'userOrganisationAndRole' field
   register_graphql_object_type('UserOrganisationAndRole', [
       'description' => 'A type that contains the organisation and role of a user',
       'fields' => [
           'organisation' => [
               'type' => 'String',
               'description' => 'The organisation the user belongs to',
           ],
           'organisationRole' => [
               'type' => 'String',
               'description' => 'The role of the user in the organisation',
           ],
       ]
   ]);

   // Register the mutation to create the user (already present in your code)
   register_graphql_mutation('registerUserWithoutPassword', [
       'inputFields' => [
           'username' => [
               'type' => 'String',
               'description' => 'Username for the user',
           ],
           'email' => [
               'type' => 'String',
               'description' => 'Email for the user',
           ],
           'firstName' => [
               'type' => 'String',
               'description' => 'First name of the user',
           ],
           'lastName' => [
               'type' => 'String',
               'description' => 'Last name of the user',
           ],
           'organisation' => [
               'type' => 'String',
               'description' => 'Organisation of the user',
           ],
           'organisationRole' => [
               'type' => 'String',
               'description' => 'Role of the user',
           ],
       ],
       'outputFields' => [
           'user' => [
               'type' => 'User',
               'description' => 'The created user',
           ],
           'message' => [
               'type' => 'String',
               'description' => 'A message confirming user creation',
           ],
       ],
       'mutateAndGetPayload' => function ($input) {
           $username = sanitize_text_field($input['username']);
           $email = sanitize_email($input['email']);
           $first_name = sanitize_text_field($input['firstName']);
           $last_name = sanitize_text_field($input['lastName']);
           $organisation = sanitize_text_field($input['organisation']);
           $organisationRole = sanitize_text_field($input['organisationRole']);

           if (username_exists($username) || email_exists($email)) {
               return [
                   'message' => 'Email already exists',
               ];
           }

           // Create the user
           $user_id = wp_insert_user([
               'user_login' => $username,
               'user_email' => $email,
               'user_pass' => wp_generate_password(), // Temporary password
               'role' => 'subscriber', // Default role
               'first_name' => $first_name,
               'last_name' => $last_name,
           ]);

           if (is_wp_error($user_id)) {
               return [
                   'message' => 'Error creating user',
               ];
           }

           // Save the custom fields (organisation and role) for the user
           update_user_meta($user_id, 'organisation', $organisation);
           update_user_meta($user_id, 'organisation_role', $organisationRole);
           update_user_meta($user_id, 'user_status', 'pending');

           return [
               'user' => get_user_by('id', $user_id),
               'message' => 'User created successfully',
           ];
       }
   ]);
});


function add_cors_http_header() {
   $origin = get_http_origin();
   $allowed_origins = [
       'http://localhost:3000',
       'https://ose-six.vercel.app',
       'https://ose-evildonkeyuk.vercel.app'
   ];

   if (in_array($origin, $allowed_origins)) {
       header("Access-Control-Allow-Origin: $origin");
       header("Access-Control-Allow-Credentials: true");
       header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
       header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
   }
}
add_action('init', 'add_cors_http_header');

// allow subscribers to login with jwt
add_filter( 'jwt_auth_whitelist', function( $whitelist ) {
   $whitelist[] = 'wp-json/wp/v2/users/me';
   return $whitelist;
});

// portfolio custom post type
add_post_type_support( 'portfolio', 'thumbnail' );
add_action( 'init', function() {
  register_post_type( 'portfolio', [
     'show_ui' => true,
     'labels'  => [
         'name' => __( 'Portfolio', 'your-textdomain' ),
         'singular_name' => __( 'Portfolio', 'your-textdomain' ),
       'menu_name' => __( 'Portfolio', 'your-textdomain' ),
     ],
     'hierarchical' => true,
     'show_in_graphql' => true,
     'graphql_single_name' => 'portfolio',
     'graphql_plural_name' => 'portfolio',
     'public' => true,
     'publicly_queryable' => true,
      'menu_icon' => 'dashicons-portfolio'
  ] );
} );

// portfolio categories
add_action('init', function() {
 register_taxonomy( 'portfolio-category', 'portfolio', [
   'labels'  => [
       'name' => __( 'Portfolio Categories', 'your-textdomain' ),
         'singular_name' => __( 'Portfolio Categories', 'your-textdomain' ),
     'menu_name' => __( 'Portfolio Categories', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'portfolioCategory',
   'graphql_plural_name' => 'portfolioCategories',
 ]);
});

// portfolio stage
add_action('init', function() {
 register_taxonomy( 'portfolio-stage', 'portfolio', [
   'labels'  => [
       'name' => __( 'Stage', 'your-textdomain' ),
     'menu_name' => __( 'Portfolio Stage', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'portfolioStage',
   'graphql_plural_name' => 'portfolioStages',
 ]);
});


// stories custom post type
add_post_type_support( 'stories', 'thumbnail' );
add_action( 'init', function() {
  register_post_type( 'stories', [
     'show_ui' => true,
     'labels'  => [
         'name' => __( 'Stories', 'your-textdomain' ),
         'singular_name' => __( 'Stories', 'your-textdomain' ),
       'menu_name' => __( 'Stories', 'your-textdomain' ),
     ],
     'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
     'hierarchical' => true,
     'show_in_graphql' => true,
     'graphql_single_name' => 'story',
     'graphql_plural_name' => 'stories',
     'graphql_sortable_fields' => ['menuOrder'],
     'public' => true,
     'publicly_queryable' => true,
      'menu_icon' => 'dashicons-portfolio'
  ] );
} );
// stories types
add_action('init', function() {
 register_taxonomy( 'stories-type', 'stories', [
   'labels'  => [
       'name' => __( 'Stories Types', 'your-textdomain' ),
         'singular_name' => __( 'Stories Types', 'your-textdomain' ),
     'menu_name' => __( 'Stories Types', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'storiesType',
   'graphql_plural_name' => 'storiesTypes',
 ]);
});
// stories sectors
add_action('init', function() {
 register_taxonomy( 'stories-sector', 'stories', [
   'labels'  => [
       'name' => __( 'Stories Sector', 'your-textdomain' ),
         'singular_name' => __( 'Stories Sector', 'your-textdomain' ),
     'menu_name' => __( 'Stories Sector', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'storiesSector',
   'graphql_plural_name' => 'storiesSectors',
 ]);
});

// team custom post type
add_post_type_support( 'team', 'thumbnail' );
add_action( 'init', function() {
  register_post_type( 'team', [
     'show_ui' => true,
     'labels'  => [
         'name' => __( 'Team', 'your-textdomain' ),
         'singular_name' => __( 'Team', 'your-textdomain' ),
       'menu_name' => __( 'Team', 'your-textdomain' ),
     ],
      'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
     'hierarchical' => true,
     'show_in_graphql' => true,
     'graphql_single_name' => 'team',
     'graphql_plural_name' => 'allTeam',
      'graphql_sortable_fields' => ['menuOrder'],
     'public' => true,
     'publicly_queryable' => true,
      'menu_icon' => 'dashicons-admin-users'
  ] );
} );
add_action('init', function() {
 register_taxonomy( 'team-category', 'team', [
   'labels'  => [
     'menu_name' => __( 'Team Categories', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'teamCategory',
   'graphql_plural_name' => 'teamCategories',
 ]);
});
// Add custom column for team-category taxonomy
add_filter('manage_team_posts_columns', function($columns) {
   // Insert the new column after the title column
   $new_columns = [];
   foreach ($columns as $key => $label) {
       $new_columns[$key] = $label;
       if ($key === 'title') {
           $new_columns['team_category'] = __('Team Categories', 'your-textdomain');
       }
   }
   return $new_columns;
});

// Populate the team-category column
add_action('manage_team_posts_custom_column', function($column, $post_id) {
   if ($column === 'team_category') {
       $terms = get_the_terms($post_id, 'team-category');
       if (!empty($terms) && !is_wp_error($terms)) {
           echo implode(', ', wp_list_pluck($terms, 'name'));
       } else {
           echo '—';
       }
   }
}, 10, 2);


// founders custom post type
add_post_type_support( 'founders', 'thumbnail' );
add_action( 'init', function() {
  register_post_type( 'founders', [
     'show_ui' => true,
     'labels'  => [
         'name' => __( 'Founders', 'your-textdomain' ),
         'singular_name' => __( 'Founder', 'your-textdomain' ),
       'menu_name' => __( 'Founders', 'your-textdomain' ),
     ],
      'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
     'hierarchical' => true,
     'show_in_graphql' => true,
     'graphql_single_name' => 'founders',
     'graphql_plural_name' => 'allFounders',
      'graphql_sortable_fields' => ['menuOrder'],
     'public' => true,
     'publicly_queryable' => true,
      'menu_icon' => 'dashicons-admin-users'
  ] );
} );
add_action('init', function() {
 register_taxonomy( 'founders-category', 'founders', [
   'labels'  => [
     'menu_name' => __( 'Founders Categories', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'foundersCategory',
   'graphql_plural_name' => 'foundersCategories',
 ]);
});
// Add custom column for founders-category taxonomy
add_filter('manage_founders_posts_columns', function($columns) {
   // Insert the new column after the title column
   $new_columns = [];
   foreach ($columns as $key => $label) {
       $new_columns[$key] = $label;
       if ($key === 'title') {
           $new_columns['founders_category'] = __('Founders Categories', 'your-textdomain');
       }
   }
   return $new_columns;
});

// Populate the team-category column
add_action('manage_founders_posts_custom_column', function($column, $post_id) {
   if ($column === 'founders_category') {
       $terms = get_the_terms($post_id, 'founders-category');
       if (!empty($terms) && !is_wp_error($terms)) {
           echo implode(', ', wp_list_pluck($terms, 'name'));
       } else {
           echo '—';
       }
   }
}, 10, 2);


// Add the field in the Edit Term screen - Portfolio Stage
add_action('portfolio-stage_edit_form_fields', function($term) {
   $value = get_term_meta($term->term_id, 'custom_order', true);
   ?>
   <tr class="form-field">
       <th scope="row"><label for="custom_order">Custom Order</label></th>
       <td>
           <input name="custom_order" id="custom_order" type="number" value="<?php echo esc_attr($value); ?>" />
           <p class="description">Set a numeric value for custom order.</p>
       </td>
   </tr>
   <?php
});

// Save the value
add_action('edited_portfolio-stage', function($term_id) {
   if (isset($_POST['custom_order'])) {
       update_term_meta($term_id, 'custom_order', intval($_POST['custom_order']));
   }
});

add_action( 'graphql_register_types', function() {
 register_graphql_field( 'PortfolioStage', 'customOrder', [
   'type' => 'Int',
   'description' => 'Custom order value of the term.',
   'resolve' => function( $term ) {
     return (int) get_term_meta( $term->term_id, 'custom_order', true );
   }
 ]);
});


// Add the field in the Edit Term screen - Stories Type
add_action('stories-type_edit_form_fields', function($term) {
   $value = get_term_meta($term->term_id, 'stories_custom_order', true);
   ?>
   <tr class="form-field">
       <th scope="row"><label for="stories_custom_order">Custom Order</label></th>
       <td>
           <input name="stories_custom_order" id="stories_custom_order" type="number" value="<?php echo esc_attr($value); ?>" />
           <p class="description">Set a numeric value for custom order.</p>
       </td>
   </tr>
   <?php
});
// Save the value
add_action('edited_stories-type', function($term_id) {
   if (isset($_POST['stories_custom_order'])) {
       update_term_meta($term_id, 'stories_custom_order', intval($_POST['stories_custom_order']));
   }
});
add_action( 'graphql_register_types', function() {
 register_graphql_field( 'storiesType', 'customOrder', [
   'type' => 'Int',
   'description' => 'Custom order value of the term.',
   'resolve' => function( $term ) {
     return (int) get_term_meta( $term->term_id, 'stories_custom_order', true );
   }
 ]);
});


// Add the field in the Edit Term screen - Team category
add_action('team-category_edit_form_fields', function($term) {
   $value = get_term_meta($term->term_id, 'team_custom_order', true);
   ?>
   <tr class="form-field">
       <th scope="row"><label for="team_custom_order">Custom Order</label></th>
       <td>
           <input name="team_custom_order" id="team_custom_order" type="number" value="<?php echo esc_attr($value); ?>" />
           <p class="description">Set a numeric value for custom order.</p>
       </td>
   </tr>
   <?php
});
// Save the value
add_action('edited_team-category', function($term_id) {
   if (isset($_POST['team_custom_order'])) {
       update_term_meta($term_id, 'team_custom_order', intval($_POST['team_custom_order']));
   }
});
add_action( 'graphql_register_types', function() {
 register_graphql_field( 'teamCategory', 'customOrder', [
   'type' => 'Int',
   'description' => 'Custom order value of the term.',
   'resolve' => function( $term ) {
     return (int) get_term_meta( $term->term_id, 'team_custom_order', true );
   }
 ]);
});


// Add the field in the Edit Term screen - Founders category
add_action('founders-category_edit_form_fields', function($term) {
   $value = get_term_meta($term->term_id, 'founders_custom_order', true);
   ?>
   <tr class="form-field">
       <th scope="row"><label for="founders_custom_order">Custom Order</label></th>
       <td>
           <input name="founders_custom_order" id="founders_custom_order" type="number" value="<?php echo esc_attr($value); ?>" />
           <p class="description">Set a numeric value for custom order.</p>
       </td>
   </tr>
   <?php
});
// Save the value
add_action('edited_founders-category', function($term_id) {
   if (isset($_POST['founders_custom_order'])) {
       update_term_meta($term_id, 'founders_custom_order', intval($_POST['founders_custom_order']));
   }
});
add_action( 'graphql_register_types', function() {
 register_graphql_field( 'foundersCategory', 'customOrder', [
   'type' => 'Int',
   'description' => 'Custom order value of the term.',
   'resolve' => function( $term ) {
     return (int) get_term_meta( $term->term_id, 'founders_custom_order', true );
   }
 ]);
});








// Add custom column to the Portfolio post type
add_filter('manage_edit-portfolio_columns', function($columns) {
   $columns['portfolio_title'] = __('Portfolio Title');
   return $columns;
});

// Show the field value in the column
add_action('manage_portfolio_posts_custom_column', function($column, $post_id) {
   if ($column === 'portfolio_title') {
       echo esc_html(get_field('portfolio_title', $post_id));
   }
}, 10, 2);
// Add the quick edit field to the form
add_action('quick_edit_custom_box', function($column_name, $post_type) {
   if ($column_name !== 'portfolio_title' || $post_type !== 'portfolio') return;
   ?>
   <fieldset class="inline-edit-col-right">
       <div class="inline-edit-col">
           <label>
               <span class="title"><?php _e('Portfolio Title'); ?></span>
               <span class="input-text-wrap">
                   <input type="text" name="portfolio_title" class="portfolio_title" value="">
               </span>
           </label>
       </div>
   </fieldset>
   <?php
}, 10, 2);
// Add JavaScript to populate the quick edit field
add_action('admin_footer', function() {
   global $post_type;
   if ($post_type !== 'portfolio') return;

   ?>
   <script>
   jQuery(function($) {
       $('body').on('click', '.editinline', function() {
           var post_id = $(this).closest('tr').attr('id').replace('post-', '');
           var title = $('#portfolio_title_' + post_id).text();
           $('input.portfolio_title', '.inline-edit-row').val(title);
       });
   });
   </script>
   <?php
});
add_action('manage_portfolio_posts_custom_column', function($column, $post_id) {
   if ($column === 'portfolio_title') {
       echo '<span id="portfolio_title_' . $post_id . '">' . esc_html(get_field('portfolio_title', $post_id)) . '</span>';
   }
}, 10, 2);
add_action('save_post_portfolio', function($post_id) {
   if (!current_user_can('edit_post', $post_id)) return;
   if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
   if (isset($_POST['portfolio_title'])) {
       update_field('field_6810d53d82aee', sanitize_text_field($_POST['portfolio_title']), $post_id);
   }
});


// Portfolio News custom post type
add_action( 'init', function() {
  register_post_type( 'portfolio-news', [
     'show_ui' => true,
     'labels'  => [
         'name' => __( 'Portfolio News', 'your-textdomain' ),
         'singular_name' => __( 'Portfolio News', 'your-textdomain' ),
       'menu_name' => __( 'Portfolio News', 'your-textdomain' ),
     ],
     'hierarchical' => true,
     'show_in_graphql' => true,
     'graphql_single_name' => 'portfolioNewsItem',
     'graphql_plural_name' => 'portfolioNews',
     'public' => true,
     'publicly_queryable' => true,
	  'menu_position' => 5
  ] );
} );

// portfolio categories
add_action('init', function() {
 register_taxonomy( 'portfolio-news-category', 'portfolio-news', [
   'labels'  => [
       'name' => __( 'Portfolio News Categories', 'your-textdomain' ),
         'singular_name' => __( 'Portfolio News Categories', 'your-textdomain' ),
     'menu_name' => __( 'Portfolio News Categories', 'your-textdomain' ),
   ],
    'hierarchical' => true,
   'show_in_graphql' => true,
   'graphql_single_name' => 'portfolioNewsCategory',
   'graphql_plural_name' => 'portfolioNewsCategories',
 ]);
});






// Add custom columns to the Team post type
add_filter('manage_edit-team_columns', function($columns) {
   $columns['hero_desktop_image'] = __('Hero Desktop Image');
   $columns['hero_mobile_image'] = __('Hero Mobile Image');
   return $columns;
});

// Show the field values in the columns
add_action('manage_team_posts_custom_column', function($column, $post_id) {
   if ($column === 'hero_desktop_image') {
       $image = get_field('field_6899d3922fd7a', $post_id);
       $image_id = '';
       
       if ($image && is_array($image) && isset($image['url'])) {
           echo '<img src="' . esc_url($image['url']) . '" alt="' . esc_attr($image['alt']) . '" style="max-width: 50px; height: auto;">';
           $image_id = $image['ID'];
       } elseif ($image && is_numeric($image)) {
           $image_url = wp_get_attachment_image_url($image, 'thumbnail');
           if ($image_url) {
               echo '<img src="' . esc_url($image_url) . '" alt="" style="max-width: 50px; height: auto;">';
           }
           $image_id = $image;
       } elseif ($image && is_string($image)) {
           // Handle case where field returns URL string
           echo '<img src="' . esc_url($image) . '" alt="" style="max-width: 50px; height: auto;">';
           $image_id = attachment_url_to_postid($image);
       }
       
       echo '<span id="hero_desktop_image_' . $post_id . '" style="display: none;">' . esc_html($image_id) . '</span>';
   }
   
   if ($column === 'hero_mobile_image') {
       $image = get_field('field_6899c61546384', $post_id);
       $image_id = '';
       
       if ($image && is_array($image) && isset($image['url'])) {
           echo '<img src="' . esc_url($image['url']) . '" alt="' . esc_attr($image['alt']) . '" style="max-width: 50px; height: auto;">';
           $image_id = $image['ID'];
       } elseif ($image && is_numeric($image)) {
           $image_url = wp_get_attachment_image_url($image, 'thumbnail');
           if ($image_url) {
               echo '<img src="' . esc_url($image_url) . '" alt="" style="max-width: 50px; height: auto;">';
           }
           $image_id = $image;
       } elseif ($image && is_string($image)) {
           // Handle case where field returns URL string
           echo '<img src="' . esc_url($image) . '" alt="" style="max-width: 50px; height: auto;">';
           $image_id = attachment_url_to_postid($image);
       }
       
       echo '<span id="hero_mobile_image_' . $post_id . '" style="display: none;">' . esc_html($image_id) . '</span>';
   }
}, 10, 2);

// Add the quick edit fields to the form
add_action('quick_edit_custom_box', function($column_name, $post_type) {
   if ($post_type !== 'team') return;
   
   if ($column_name === 'hero_desktop_image') {
   ?>
   <fieldset class="inline-edit-col-right">
       <div class="inline-edit-col">
           <label>
               <span class="title"><?php _e('Hero Desktop Image'); ?></span>
               <span class="input-text-wrap">
                   <input type="hidden" name="hero_desktop_image" class="hero_desktop_image" value="">
                   <button type="button" class="button hero_desktop_image_upload"><?php _e('Select Image'); ?></button>
                   <button type="button" class="button hero_desktop_image_remove" style="display:none;"><?php _e('Remove Image'); ?></button>
                   <div class="hero_desktop_image_preview" style="margin-top: 5px;"></div>
               </span>
           </label>
       </div>
   </fieldset>
   <?php
   }
   
   if ($column_name === 'hero_mobile_image') {
   ?>
   <fieldset class="inline-edit-col-right">
       <div class="inline-edit-col">
           <label>
               <span class="title"><?php _e('Hero Mobile Image'); ?></span>
               <span class="input-text-wrap">
                   <input type="hidden" name="hero_mobile_image" class="hero_mobile_image" value="">
                   <button type="button" class="button hero_mobile_image_upload"><?php _e('Select Image'); ?></button>
                   <button type="button" class="button hero_mobile_image_remove" style="display:none;"><?php _e('Remove Image'); ?></button>
                   <div class="hero_mobile_image_preview" style="margin-top: 5px;"></div>
               </span>
           </label>
       </div>
   </fieldset>
   <?php
   }
}, 10, 2);

// Add JavaScript to populate the quick edit fields
add_action('admin_footer', function() {
   global $post_type;
   if ($post_type !== 'team') return;

   // Ensure media scripts are loaded
   wp_enqueue_media();
   
   // Print media templates
   wp_print_media_templates();
   
   ?>
   <script>
   jQuery(function($) {
       
       // Handle quick edit population
       $('body').on('click', '.editinline', function() {
           var post_id = $(this).closest('tr').attr('id').replace('post-', '');
           var desktop_image = $('#hero_desktop_image_' + post_id).text();
           var mobile_image = $('#hero_mobile_image_' + post_id).text();
           
           $('input.hero_desktop_image', '.inline-edit-row').val(desktop_image);
           $('input.hero_mobile_image', '.inline-edit-row').val(mobile_image);
           
           // Update previews with attachment IDs
           updateImagePreviewFromID('.hero_desktop_image_preview', desktop_image);
           updateImagePreviewFromID('.hero_mobile_image_preview', mobile_image);
       });
       
       // Handle desktop image upload
       $('body').on('click', '.hero_desktop_image_upload', function() {
           var button = $(this);
           var input = button.siblings('input.hero_desktop_image');
           var preview = button.siblings('.hero_desktop_image_preview');
           var removeBtn = button.siblings('.hero_desktop_image_remove');
           
           // Check if wp.media is available
           if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
               console.log('wp.media not available, attempting to load...');
               // Try to load media scripts dynamically
               if (typeof wp === 'undefined') {
                   alert('WordPress media library is not loaded. Please refresh the page and try again.');
                   return;
               }
               if (typeof wp.media === 'undefined') {
                   alert('Media library is not available. Please refresh the page and try again.');
                   return;
               }
               return;
           }
           
           // Create a new media uploader instance for each click
           var frame = wp.media({
               title: 'Select Hero Desktop Image',
               button: {
                   text: 'Use this image'
               },
               multiple: false,
               library: {
                   type: 'image'
               }
           });
           
           frame.on('select', function() {
               var attachment = frame.state().get('selection').first().toJSON();
               input.val(attachment.id);
               if (attachment.sizes && attachment.sizes.thumbnail) {
                   preview.html('<img src="' + attachment.sizes.thumbnail.url + '" style="max-width: 80px; height: auto;" />');
               } else {
                   preview.html('<img src="' + attachment.url + '" style="max-width: 80px; height: auto;" />');
               }
               removeBtn.show();
           });
           
           frame.open();
       });
       
       // Handle mobile image upload
       $('body').on('click', '.hero_mobile_image_upload', function() {
           var button = $(this);
           var input = button.siblings('input.hero_mobile_image');
           var preview = button.siblings('.hero_mobile_image_preview');
           var removeBtn = button.siblings('.hero_mobile_image_remove');
           
           // Check if wp.media is available
           if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
               console.log('wp.media not available, attempting to load...');
               // Try to load media scripts dynamically
               if (typeof wp === 'undefined') {
                   alert('WordPress media library is not loaded. Please refresh the page and try again.');
                   return;
               }
               if (typeof wp.media === 'undefined') {
                   alert('Media library is not available. Please refresh the page and try again.');
                   return;
               }
               return;
           }
           
           // Create a new media uploader instance for each click
           var frame = wp.media({
               title: 'Select Hero Mobile Image',
               button: {
                   text: 'Use this image'
               },
               multiple: false,
               library: {
                   type: 'image'
               }
           });
           
           frame.on('select', function() {
               var attachment = frame.state().get('selection').first().toJSON();
               input.val(attachment.id);
               if (attachment.sizes && attachment.sizes.thumbnail) {
                   preview.html('<img src="' + attachment.sizes.thumbnail.url + '" style="max-width: 80px; height: auto;" />');
               } else {
                   preview.html('<img src="' + attachment.url + '" style="max-width: 80px; height: auto;" />');
               }
               removeBtn.show();
           });
           
           frame.open();
       });
       
       // Handle remove buttons
       $('body').on('click', '.hero_desktop_image_remove', function() {
           var button = $(this);
           var input = button.siblings('input.hero_desktop_image');
           var preview = button.siblings('.hero_desktop_image_preview');
           input.val('');
           preview.empty();
           button.hide();
       });
       
       $('body').on('click', '.hero_mobile_image_remove', function() {
           var button = $(this);
           var input = button.siblings('input.hero_mobile_image');
           var preview = button.siblings('.hero_mobile_image_preview');
           input.val('');
           preview.empty();
           button.hide();
       });
       
       // Function to update image preview from attachment ID
       function updateImagePreviewFromID(selector, attachmentId) {
           var preview = $(selector);
           var removeBtn = preview.siblings('.hero_desktop_image_remove, .hero_mobile_image_remove');
           
           if (attachmentId && attachmentId.trim() !== '') {
               // Use AJAX to get image URL from attachment ID
               $.ajax({
                   url: ajaxurl,
                   type: 'POST',
                   data: {
                       action: 'get_attachment_url',
                       attachment_id: attachmentId,
                       nonce: '<?php echo wp_create_nonce("get_attachment_url_nonce"); ?>'
                   },
                   success: function(response) {
                       if (response.success && response.data.url) {
                           preview.html('<img src="' + response.data.url + '" style="max-width: 80px; height: auto;" />');
                           removeBtn.show();
                       } else {
                           preview.empty();
                           removeBtn.hide();
                       }
                   },
                   error: function() {
                       preview.empty();
                       removeBtn.hide();
                   }
               });
           } else {
               preview.empty();
               removeBtn.hide();
           }
       }
       
       // Function to update image preview from URL (for backward compatibility)
       function updateImagePreview(selector, imageUrl) {
           var preview = $(selector);
           if (imageUrl && imageUrl.trim() !== '') {
               preview.html('<img src="' + imageUrl + '" style="max-width: 80px; height: auto;" />');
               preview.siblings('.hero_desktop_image_remove, .hero_mobile_image_remove').show();
           } else {
               preview.empty();
               preview.siblings('.hero_desktop_image_remove, .hero_mobile_image_remove').hide();
           }
       }
   });
   </script>
   <?php
});

// AJAX handler to get attachment URL
add_action('wp_ajax_get_attachment_url', function() {
   if (!wp_verify_nonce($_POST['nonce'], 'get_attachment_url_nonce')) {
       wp_die('Security check failed');
   }
   
   $attachment_id = intval($_POST['attachment_id']);
   if ($attachment_id > 0) {
       $image_url = wp_get_attachment_image_url($attachment_id, 'thumbnail');
       if ($image_url) {
           wp_send_json_success(array('url' => $image_url));
       }
   }
   
   wp_send_json_error('Invalid attachment ID');
});

// Save the quick edit field values
add_action('save_post_team', function($post_id) {
   if (!current_user_can('edit_post', $post_id)) return;
   if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
   
   if (isset($_POST['hero_desktop_image'])) {
       $attachment_id = intval($_POST['hero_desktop_image']);
       if ($attachment_id > 0) {
           update_field('field_6899d3922fd7a', $attachment_id, $post_id);
       } else {
           update_field('field_6899d3922fd7a', '', $post_id);
       }
   }
   
   if (isset($_POST['hero_mobile_image'])) {
       $attachment_id = intval($_POST['hero_mobile_image']);
       if ($attachment_id > 0) {
           update_field('field_6899c61546384', $attachment_id, $post_id);
       } else {
           update_field('field_6899c61546384', '', $post_id);
       }
   }
});



// Add custom columns to the Founders post type
add_filter('manage_edit-founders_columns', function($columns) {
   $columns['hero_desktop_image'] = __('Hero Desktop Image');
   $columns['hero_mobile_image'] = __('Hero Mobile Image');
   return $columns;
});

// Show the field values in the columns for founders
add_action('manage_founders_posts_custom_column', function($column, $post_id) {
   if ($column === 'hero_desktop_image') {
       $image = get_field('field_6899d3922fd7a', $post_id);
       $image_id = '';
       
       if ($image && is_array($image) && isset($image['url'])) {
           echo '<img src="' . esc_url($image['url']) . '" alt="' . esc_attr($image['alt']) . '" style="max-width: 50px; height: auto;">';
           $image_id = $image['ID'];
       } elseif ($image && is_numeric($image)) {
           $image_url = wp_get_attachment_image_url($image, 'thumbnail');
           if ($image_url) {
               echo '<img src="' . esc_url($image_url) . '" alt="" style="max-width: 50px; height: auto;">';
           }
           $image_id = $image;
       } elseif ($image && is_string($image)) {
           // Handle case where field returns URL string
           echo '<img src="' . esc_url($image) . '" alt="" style="max-width: 50px; height: auto;">';
           $image_id = attachment_url_to_postid($image);
       }
       
       echo '<span id="hero_desktop_image_' . $post_id . '" style="display: none;">' . esc_html($image_id) . '</span>';
   }
   
   if ($column === 'hero_mobile_image') {
       $image = get_field('field_6899c61546384', $post_id);
       $image_id = '';
       
       if ($image && is_array($image) && isset($image['url'])) {
           echo '<img src="' . esc_url($image['url']) . '" alt="' . esc_attr($image['alt']) . '" style="max-width: 50px; height: auto;">';
           $image_id = $image['ID'];
       } elseif ($image && is_numeric($image)) {
           $image_url = wp_get_attachment_image_url($image, 'thumbnail');
           if ($image_url) {
               echo '<img src="' . esc_url($image_url) . '" alt="" style="max-width: 50px; height: auto;">';
           }
           $image_id = $image;
       } elseif ($image && is_string($image)) {
           // Handle case where field returns URL string
           echo '<img src="' . esc_url($image) . '" alt="" style="max-width: 50px; height: auto;">';
           $image_id = attachment_url_to_postid($image);
       }
       
       echo '<span id="hero_mobile_image_' . $post_id . '" style="display: none;">' . esc_html($image_id) . '</span>';
   }
}, 10, 2);

// Add the quick edit fields to the form for founders
add_action('quick_edit_custom_box', function($column_name, $post_type) {
   if ($post_type !== 'founders') return;
   
   if ($column_name === 'hero_desktop_image') {
   ?>
   <fieldset class="inline-edit-col-right">
       <div class="inline-edit-col">
           <label>
               <span class="title"><?php _e('Hero Desktop Image'); ?></span>
               <span class="input-text-wrap">
                   <input type="hidden" name="hero_desktop_image" class="hero_desktop_image" value="">
                   <button type="button" class="button hero_desktop_image_upload"><?php _e('Select Image'); ?></button>
                   <button type="button" class="button hero_desktop_image_remove" style="display:none;"><?php _e('Remove Image'); ?></button>
                   <div class="hero_desktop_image_preview" style="margin-top: 5px;"></div>
               </span>
           </label>
       </div>
   </fieldset>
   <?php
   }
   
   if ($column_name === 'hero_mobile_image') {
   ?>
   <fieldset class="inline-edit-col-right">
       <div class="inline-edit-col">
           <label>
               <span class="title"><?php _e('Hero Mobile Image'); ?></span>
               <span class="input-text-wrap">
                   <input type="hidden" name="hero_mobile_image" class="hero_mobile_image" value="">
                   <button type="button" class="button hero_mobile_image_upload"><?php _e('Select Image'); ?></button>
                   <button type="button" class="button hero_mobile_image_remove" style="display:none;"><?php _e('Remove Image'); ?></button>
                   <div class="hero_mobile_image_preview" style="margin-top: 5px;"></div>
               </span>
           </label>
       </div>
   </fieldset>
   <?php
   }
}, 10, 2);

// Add JavaScript to populate the quick edit fields for founders
add_action('admin_footer', function() {
   global $post_type;
   if ($post_type !== 'founders') return;

   // Ensure media scripts are loaded
   wp_enqueue_media();
   
   // Print media templates
   wp_print_media_templates();
   
   ?>
   <script>
   jQuery(function($) {
       
       // Handle quick edit population for founders
       $('body').on('click', '.editinline', function() {
           var post_id = $(this).closest('tr').attr('id').replace('post-', '');
           var desktop_image = $('#hero_desktop_image_' + post_id).text();
           var mobile_image = $('#hero_mobile_image_' + post_id).text();
           
           $('input.hero_desktop_image', '.inline-edit-row').val(desktop_image);
           $('input.hero_mobile_image', '.inline-edit-row').val(mobile_image);
           
           // Update previews with attachment IDs
           updateImagePreviewFromID('.hero_desktop_image_preview', desktop_image);
           updateImagePreviewFromID('.hero_mobile_image_preview', mobile_image);
       });
       
       // Handle desktop image upload for founders
       $('body').on('click', '.hero_desktop_image_upload', function() {
           var button = $(this);
           var input = button.siblings('input.hero_desktop_image');
           var preview = button.siblings('.hero_desktop_image_preview');
           var removeBtn = button.siblings('.hero_desktop_image_remove');
           
           // Check if wp.media is available
           if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
               console.log('wp.media not available, attempting to load...');
               // Try to load media scripts dynamically
               if (typeof wp === 'undefined') {
                   alert('WordPress media library is not loaded. Please refresh the page and try again.');
                   return;
               }
               if (typeof wp.media === 'undefined') {
                   alert('Media library is not available. Please refresh the page and try again.');
                   return;
               }
               return;
           }
           
           // Create a new media uploader instance for each click
           var frame = wp.media({
               title: 'Select Hero Desktop Image',
               button: {
                   text: 'Use this image'
               },
               multiple: false,
               library: {
                   type: 'image'
               }
           });
           
           frame.on('select', function() {
               var attachment = frame.state().get('selection').first().toJSON();
               input.val(attachment.id);
               if (attachment.sizes && attachment.sizes.thumbnail) {
                   preview.html('<img src="' + attachment.sizes.thumbnail.url + '" style="max-width: 80px; height: auto;" />');
               } else {
                   preview.html('<img src="' + attachment.url + '" style="max-width: 80px; height: auto;" />');
               }
               removeBtn.show();
           });
           
           frame.open();
       });
       
       // Handle mobile image upload for founders
       $('body').on('click', '.hero_mobile_image_upload', function() {
           var button = $(this);
           var input = button.siblings('input.hero_mobile_image');
           var preview = button.siblings('.hero_mobile_image_preview');
           var removeBtn = button.siblings('.hero_mobile_image_remove');
           
           // Check if wp.media is available
           if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
               console.log('wp.media not available, attempting to load...');
               // Try to load media scripts dynamically
               if (typeof wp === 'undefined') {
                   alert('WordPress media library is not loaded. Please refresh the page and try again.');
                   return;
               }
               if (typeof wp.media === 'undefined') {
                   alert('Media library is not available. Please refresh the page and try again.');
                   return;
               }
               return;
           }
           
           // Create a new media uploader instance for each click
           var frame = wp.media({
               title: 'Select Hero Mobile Image',
               button: {
                   text: 'Use this image'
               },
               multiple: false,
               library: {
                   type: 'image'
               }
           });
           
           frame.on('select', function() {
               var attachment = frame.state().get('selection').first().toJSON();
               input.val(attachment.id);
               if (attachment.sizes && attachment.sizes.thumbnail) {
                   preview.html('<img src="' + attachment.sizes.thumbnail.url + '" style="max-width: 80px; height: auto;" />');
               } else {
                   preview.html('<img src="' + attachment.url + '" style="max-width: 80px; height: auto;" />');
               }
               removeBtn.show();
           });
           
           frame.open();
       });
       
       // Handle remove buttons for founders
       $('body').on('click', '.hero_desktop_image_remove', function() {
           var button = $(this);
           var input = button.siblings('input.hero_desktop_image');
           var preview = button.siblings('.hero_desktop_image_preview');
           input.val('');
           preview.empty();
           button.hide();
       });
       
       $('body').on('click', '.hero_mobile_image_remove', function() {
           var button = $(this);
           var input = button.siblings('input.hero_mobile_image');
           var preview = button.siblings('.hero_mobile_image_preview');
           input.val('');
           preview.empty();
           button.hide();
       });
       
       // Function to update image preview from attachment ID for founders
       function updateImagePreviewFromID(selector, attachmentId) {
           var preview = $(selector);
           var removeBtn = preview.siblings('.hero_desktop_image_remove, .hero_mobile_image_remove');
           
           if (attachmentId && attachmentId.trim() !== '') {
               // Use AJAX to get image URL from attachment ID
               $.ajax({
                   url: ajaxurl,
                   type: 'POST',
                   data: {
                       action: 'get_attachment_url',
                       attachment_id: attachmentId,
                       nonce: '<?php echo wp_create_nonce("get_attachment_url_nonce"); ?>'
                   },
                   success: function(response) {
                       if (response.success && response.data.url) {
                           preview.html('<img src="' + response.data.url + '" style="max-width: 80px; height: auto;" />');
                           removeBtn.show();
                       } else {
                           preview.empty();
                           removeBtn.hide();
                       }
                   },
                   error: function() {
                       preview.empty();
                       removeBtn.hide();
                   }
               });
           } else {
               preview.empty();
               removeBtn.hide();
           }
       }
       
       // Function to update image preview from URL (for backward compatibility) for founders
       function updateImagePreview(selector, imageUrl) {
           var preview = $(selector);
           if (imageUrl && imageUrl.trim() !== '') {
               preview.html('<img src="' + imageUrl + '" style="max-width: 80px; height: auto;" />');
               preview.siblings('.hero_desktop_image_remove, .hero_mobile_image_remove').show();
           } else {
               preview.empty();
               preview.siblings('.hero_desktop_image_remove, .hero_mobile_image_remove').hide();
           }
       }
   });
   </script>
   <?php
});

// Save the quick edit field values for founders
add_action('save_post_founders', function($post_id) {
   if (!current_user_can('edit_post', $post_id)) return;
   if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
   
   if (isset($_POST['hero_desktop_image'])) {
       $attachment_id = intval($_POST['hero_desktop_image']);
       if ($attachment_id > 0) {
           update_field('field_6899d3922fd7a', $attachment_id, $post_id);
       } else {
           update_field('field_6899d3922fd7a', '', $post_id);
       }
   }
   
   if (isset($_POST['hero_mobile_image'])) {
       $attachment_id = intval($_POST['hero_mobile_image']);
       if ($attachment_id > 0) {
           update_field('field_6899c61546384', $attachment_id, $post_id);
       } else {
           update_field('field_6899c61546384', '', $post_id);
       }
   }
});


/**
 * Secure ACF File Uploads (for specific fields inside repeaters)
 */

// -------------------------------------------------
// 1. Store restricted files in a private location
// -------------------------------------------------
// Apply only to our two restricted fields
add_filter('acf/upload_prefilter/key=field_68888890f60b8', 'acf_restrict_file_upload');
add_filter('acf/upload_prefilter/key=field_688889ddf60bb', 'acf_restrict_file_upload');

function acf_restrict_file_upload($errors) {
    // Hook upload_dir now that we know it's one of our restricted fields
    add_filter('upload_dir', 'acf_private_upload_dir');
    return $errors;
}

function acf_private_upload_dir($upload) {
    if (strpos($upload['subdir'], '/protected') !== 0) {
        $upload['subdir'] = '/protected' . $upload['subdir'];
        $upload['path']   = $upload['basedir'] . $upload['subdir'];
        $upload['url']    = $upload['baseurl'] . $upload['subdir'];
        
        // Ensure .htaccess exists in protected directory
        ensure_protected_directory_htaccess();
    }
    return $upload;
}


// -------------------------------------------------
// 2. Serve files through a secure PHP proxy
// -------------------------------------------------
add_action('init', 'serve_protected_file');

function serve_protected_file() {
    if ( ! isset($_GET['protected_file']) ) {
        return;
    }

    // Get Bearer token from Authorization header
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = null;
    
    if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        $token = trim($matches[1]);
    }
    
    // Validate token is present
    // Note: Full token validation happens in Next.js API route before this is called
    // This is a secondary check for defense in depth
    if ( ! $token || empty(trim($token)) ) {
        status_header(401);
        wp_die('Authentication required to access protected files.', 'Unauthorized', ['response' => 401]);
    }
    
    // Basic token format validation (JWT tokens are base64 encoded and have 3 parts)
    $token_parts = explode('.', $token);
    if ( count($token_parts) !== 3 ) {
        status_header(401);
        wp_die('Invalid token format.', 'Unauthorized', ['response' => 401]);
    }
    
    // Optional: You can add more validation here if needed
    // For now, we trust the Next.js API route validation since it already verified
    // the token before making this request

    $file = sanitize_text_field($_GET['protected_file']);
    $upload_dir = wp_upload_dir();
    $base = $upload_dir['basedir'] . '/protected/';
    $path = realpath($base . $file);

    // Security: ensure the requested path is inside /protected/
    if ( ! $path || strpos($path, $base) !== 0 || ! file_exists($path) ) {
        status_header(403);
        wp_die('File not found or access denied.', 'Forbidden', ['response' => 403]);
    }

    // Determine MIME type
    $mime_type = 'application/octet-stream';
    if ( function_exists('mime_content_type') ) {
        $mime_type = mime_content_type($path);
    } elseif ( function_exists('wp_check_filetype') ) {
        $filetype = wp_check_filetype($path);
        if ( $filetype['type'] ) {
            $mime_type = $filetype['type'];
        }
    }

    // Serve file
    header("Content-Type: " . $mime_type);
    header("Content-Length: " . filesize($path));
    header('Content-Disposition: inline; filename="' . basename($path) . '"');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    readfile($path);
    exit;
}

// -------------------------------------------------
// 3. Make GraphQL return proxy URLs instead of direct file URLs
// -------------------------------------------------
add_filter('graphql_acf_register_field', function($config, $field_name, $field_config) {
    if ( in_array($field_config['key'], ['field_68888890f60b8','field_688889ddf60bb']) ) {
        $config['resolve'] = function($root, $args, $context, $info) use ($field_config) {
            $value = get_field($field_config['name'], $root->ID);

            if ( $value ) {
                $upload_dir = wp_upload_dir();
                $protected_url = $upload_dir['baseurl'] . '/protected/';
                $relative = str_replace($protected_url, '', $value);

                return add_query_arg('protected_file', $relative, home_url('/'));
            }
            return null;
        };
    }
    return $config;
}, 10, 3);

// -------------------------------------------------
// 4. Block direct access to protected uploads
// -------------------------------------------------

// Create/update .htaccess file in protected directory to deny direct access
add_action('admin_init', 'ensure_protected_directory_htaccess');
add_action('init', 'ensure_protected_directory_htaccess'); // Also run on frontend init

function ensure_protected_directory_htaccess() {
    $upload_dir = wp_upload_dir();
    $protected_dir = $upload_dir['basedir'] . '/protected';
    
    // Create protected directory if it doesn't exist
    if (!file_exists($protected_dir)) {
        wp_mkdir_p($protected_dir);
    }
    
    $htaccess_file = $protected_dir . '/.htaccess';
    $htaccess_content = "# Deny direct access to protected files\n";
    $htaccess_content .= "# Files must be accessed through WordPress proxy endpoint\n";
    $htaccess_content .= "Order deny,allow\n";
    $htaccess_content .= "Deny from all\n";
    
    // Only update if content is different or file doesn't exist
    if (!file_exists($htaccess_file) || file_get_contents($htaccess_file) !== $htaccess_content) {
        file_put_contents($htaccess_file, $htaccess_content);
    }
}

// Also block via PHP as a fallback (though .htaccess is primary protection)
// This catches requests that somehow bypass .htaccess
add_action('parse_request', function($wp) {
    $request_uri = $_SERVER['REQUEST_URI'] ?? '';
    
    // Check if this is a direct request to a protected file
    if (strpos($request_uri, '/wp-content/uploads/protected/') !== false) {
        // Check if this is coming through our proxy endpoint (allow it)
        // The proxy endpoint uses ?protected_file= parameter, not direct file path
        if (isset($_GET['protected_file'])) {
            return; // Allow proxy requests
        }
        
        // Block direct access
        header('X-Robots-Tag: noindex');
        status_header(403);
        wp_die('Access denied. Files in this directory are protected and cannot be accessed directly.', 'Forbidden', ['response' => 403]);
    }
}, 1); // Priority 1 to run early