<?php
/**
 * ed-theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package ed-theme
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

if ( ! function_exists( 'ed_theme_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function ed_theme_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on ed-theme, use a find and replace
		 * to change 'ed-theme' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'ed-theme', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'menu-1' => esc_html__( 'Primary', 'ed-theme' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'ed_theme_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'ed_theme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function ed_theme_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'ed_theme_content_width', 640 );
}
add_action( 'after_setup_theme', 'ed_theme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function ed_theme_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'ed-theme' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'ed-theme' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'ed_theme_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function ed_theme_scripts() {
	wp_enqueue_style( 'ed-theme-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'ed-theme-style', 'rtl', 'replace' );

	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'ed-theme-vendors', get_template_directory_uri() . '/assets/js/vendor.min.js', array(), '20151215', true );
	wp_enqueue_script( 'ed-theme-custom', get_template_directory_uri() . '/assets/js/custom.js', array(), '20151215', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'ed_theme_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Extra.
 */
require get_template_directory() . '/inc/extra.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}


// style User Profile Edit screen
// ------------------------------
function custom_hide_profile_fields_css() {
    // Only load on user profile and user edit pages
    $screen = get_current_screen();
    if ( in_array( $screen->id, ['profile', 'user-edit'] ) ) {
        echo '<style>
			#your-profile .user-comment-shortcuts-wrap,
			#your-profile .user-user-login-wrap,
			#your-profile .user-admin-bar-front-wrap,
			#your-profile .user-language-wrap,
			#your-profile .user-role-wrap,
			#your-profile .user-description-wrap,
			#your-profile .user-profile-picture,
			#your-profile .user-admin-color-wrap,
            #your-profile .user-url-wrap,
            #your-profile .user-facebook-wrap,
            #your-profile .user-instagram-wrap,
            #your-profile .user-linkedin-wrap,
            #your-profile .user-myspace-wrap,
            #your-profile .user-pinterest-wrap,
            #your-profile .user-soundcloud-wrap,
            #your-profile .user-tumblr-wrap,
            #your-profile .user-wikipedia-wrap,
            #your-profile .user-twitter-wrap,
            #your-profile .user-youtube-wrap,
			#your-profile .application-passwords,
			#your-profile .yoast.yoast-settings {
                display: none !important;
            }
        </style>';
    }
	
	if ( in_array( $screen->id, ['user'] ) ) {
        echo '<style>
			#createuser .form-table .form-field:nth-child(5),
			#createuser .form-table .user-language-wrap {
                display: none !important;
            }
        </style>';
    }
}
add_action('admin_head', 'custom_hide_profile_fields_css');

add_action('admin_head-user-new.php', function() {
    echo '<style>#user_login, label[for="user_login"], .user-pass1-wrap {display:none !important;}</style>';
    ?>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        // Auto-fill username field with email when email is entered
        const emailField = document.getElementById('email');
        const usernameField = document.getElementById('user_login');
        
        if (emailField && usernameField) {
            emailField.addEventListener('input', function() {
                const email = this.value;
                if (email && email.includes('@')) {
                    const base = email.split('@')[0];
                    // Remove special characters and make it valid for WordPress
                    const username = base.replace(/[^a-zA-Z0-9._-]/g, '');
                    if (username) {
                        usernameField.value = username;
                    }
                }
            });
        }
    });
    </script>
    <?php
});

// Auto-generate username from email if missing - Multiple approaches
add_filter('pre_user_login', function($login) {
    // If no username was given, try to get email from various sources
    if (empty($login)) {
        $email = '';
        
        // Try to get email from POST data (admin interface)
        if (!empty($_POST['email'])) {
            $email = sanitize_email($_POST['email']);
        }
        // Try to get email from GET data (some cases)
        elseif (!empty($_GET['email'])) {
            $email = sanitize_email($_GET['email']);
        }
        // Try to get email from the current request context
        elseif (isset($_REQUEST['email'])) {
            $email = sanitize_email($_REQUEST['email']);
        }
        
        if (!empty($email)) {
            $base = strstr($email, '@', true); // part before @
            $login = sanitize_user($base, true);

            // Ensure uniqueness
            $i = 1;
            $new_login = $login;
            while (username_exists($new_login)) {
                $new_login = $login . $i;
                $i++;
            }
            $login = $new_login;
        }
    }
    return $login;
});

// Handle username generation before form validation
add_action('admin_init', function() {
    if (isset($_POST['action']) && $_POST['action'] === 'createuser' && isset($_POST['email'])) {
        // If username is empty or invalid, generate from email
        if (empty($_POST['user_login']) || !sanitize_user($_POST['user_login'])) {
            $email = sanitize_email($_POST['email']);
            if (!empty($email)) {
                $base = strstr($email, '@', true);
                $username = sanitize_user($base, true);
                
                // Ensure uniqueness
                $i = 1;
                $new_username = $username;
                while (username_exists($new_username)) {
                    $new_username = $username . $i;
                    $i++;
                }
                
                // Set the username in POST data
                $_POST['user_login'] = $new_username;
            }
        }
    }
});

// Additional hook for when users are created via wp_insert_user
add_action('user_register', function($user_id) {
    $user = get_user_by('id', $user_id);
    
    // If username is empty or just numbers, regenerate from email
    if (empty($user->user_login) || is_numeric($user->user_login)) {
        $email = $user->user_email;
        if (!empty($email)) {
            $base = strstr($email, '@', true);
            $new_login = sanitize_user($base, true);
            
            // Ensure uniqueness
            $i = 1;
            $final_login = $new_login;
            while (username_exists($final_login)) {
                $final_login = $new_login . $i;
                $i++;
            }
            
            // Update the user login
            global $wpdb;
            $wpdb->update(
                $wpdb->users,
                array('user_login' => $final_login),
                array('ID' => $user_id),
                array('%s'),
                array('%d')
            );
        }
    }
});

// Target the Add New User admin screen
add_action('admin_head-user-new.php', function() {
    ?>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        // Uncheck the box by default
        let checkbox = document.getElementById("send_user_notification");
        if (checkbox) {
            checkbox.checked = false;
            // Hide the checkbox + its label row
            let row = checkbox.closest("tr");
            if (row) row.style.display = "none";
        }
    });
    </script>
    <?php
});



// Add Subscribers menu item
// ------------------------------
function add_subscribers_submenu() {
    add_submenu_page(
        'users.php',
        __( 'Investor Portal Subscribers' ),
        __( 'Investor Portal Subscribers' ),
        'list_users',
        'users.php?role=subscriber'
    );
}
add_action( 'admin_menu', 'add_subscribers_submenu' );

/////////////////////// my_admin_hide_profile_sections
function my_admin_hide_profile_sections($hook) {
    // Only load on user profile and user edit pages
    if ($hook === 'profile.php' || $hook === 'user-edit.php') {
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const headings = document.querySelectorAll('#your-profile h2');

            headings.forEach(h2 => {
                if (
                    h2.textContent.includes('Connected Devices') ||
                    h2.textContent.includes('Headless Login - JWT Secret') ||
                    h2.textContent.includes('Linked User Identities') || 
					h2.textContent.includes('Account Management')
                ) {
                    let next = h2.nextElementSibling;
                    h2.style.display = 'none';
                    if (next) next.style.display = 'none';
                }
            });
        });
        </script>
        <?php
    }
}
add_action('admin_enqueue_scripts', 'my_admin_hide_profile_sections');

//////// my_admin_hide_change_role_dropdown
function my_admin_hide_change_role_dropdown($hook) {
    if ($hook === 'users.php') {
        ?>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.alignleft.actions').forEach(el => {
                const select = el.querySelector('#new_role');
                const button = el.querySelector('#changeit');
                if (select && button) {
                    el.style.display = 'none';
                }
            });
        });
        </script>
        <?php
    }
}
add_action('admin_enqueue_scripts', 'my_admin_hide_change_role_dropdown');



/**
 * Add "Registration Date" and "Last Login" columns to the Users list
 */
function my_add_user_columns($columns) {
    $columns['registered'] = __('Registration Date');
    $columns['last_login'] = __('Last Login');
    return $columns;
}
add_filter('manage_users_columns', 'my_add_user_columns');

/**
 * Populate the custom columns
 */
function my_show_user_column_content($value, $column_name, $user_id) {
    if ($column_name === 'registered') {
        $user = get_userdata($user_id);
        return date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($user->user_registered));
    }

    if ($column_name === 'last_login') {
        $last_login = get_user_meta($user_id, 'last_login', true);
        if ($last_login) {
            return date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($last_login));
        } else {
            return '—';
        }
    }

    return $value;
}
add_filter('manage_users_custom_column', 'my_show_user_column_content', 10, 3);

/**
 * Track user last login
 */
function my_track_last_login($login, $user) {
    update_user_meta($user->ID, 'last_login', current_time('mysql'));
}
add_action('wp_login', 'my_track_last_login', 10, 2);

