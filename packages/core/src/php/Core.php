<?php
/**
 * Core class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Core class.
 */
class Core {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\singleton, \LCDR\Utils\debug;

	/**
	 * Options.
	 *
	 * @var \LCDR\Options\Core
	 */
	public $options;

	/**
	 * DB.
	 *
	 * @var \LCDR\DB\Core
	 */
	protected $db;

	/**
	 * Mdorim.
	 *
	 * @var \Mdorim\Core
	 */
	public $mdorim;

	/**
	 * Users.
	 *
	 * @var \LCDR\Users\Core
	 */
	public $users;

	/**
	 * Rest.
	 *
	 * @var \LCDR\Rest\Core
	 */
	public $rest;

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->mdorim  = \Mdorim\Core::get_instance();
		$this->users   = \LCDR\Users\Core::get_instance();
		$this->db      = \LCDR\DB\Core::get_instance();
		$this->rest    = \LCDR\Rest\Core::get_instance();
		$this->options = \LCDR\Options\Core::get_instance();

		add_action( 'init', array( $this, 'textdomain' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'load_script' ) );
		add_filter( 'script_loader_tag', array( $this, 'script_type_attribute' ), 10, 3 );
	}

	/**
	 * Load textdomain.
	 *
	 * @return void
	 */
	public function textdomain() {
		$domain = 'lcdr';
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );
		\load_textdomain( $domain, LCDR_PATH . "languages/php-{$domain}-{$locale}.mo" );
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function load_script( $hook_suffix ) {
		$package = json_decode( file_get_contents( LCDR_PATH . 'package.json' ) );

		$script_file = LCDR_DEBUG ? 'index.js' : 'index.min.js';

		// if LCDR_DEBUG is true, randomize version, else use package.json version
		$version = LCDR_DEBUG ? substr( str_shuffle( MD5( microtime() ) ), 0, 10 ) : $package->version;

		\wp_register_script(
			'lcdr',
			LCDR_URL . 'lib/' . $script_file,
			$package->wp_plugin->dependencies,
			$version,
			true
		);

		\wp_add_inline_script(
			'lcdr',
			'const lcdr = ' . json_encode(
				apply_filters(
					lcdr_hook( array( 'script', 'data' ) ),
					(object) array(
						'hook' => $hook_suffix,
					)
				)
			),
			'before'
		);
	}

	/**
	 * Add script data. (filter)
	 *
	 * @param string $tag
	 * @param string $handle
	 * @param string $src
	 * @return string
	 */
	function script_type_attribute( $tag, $handle, $src ) {
		// if not your script, do nothing and return original $tag
		if ( 'lcdr' !== $handle ) {
			return $tag;
		}
		// change the script tag by adding type="module" and return it.
		$tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
		return $tag;
	}
}
