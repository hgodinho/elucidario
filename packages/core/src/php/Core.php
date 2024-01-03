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
		$this->mdorim = \Mdorim\Core::get_instance();
		$this->users  = \LCDR\Users\Core::get_instance();
		$this->db     = \LCDR\DB\Core::get_instance();
		$this->rest   = \LCDR\Rest\Core::get_instance();
		// $this->options = new \LCDR\Options\Core(); phpcs:ignore

		add_action( 'init', array( $this, 'textdomain' ) );
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
}
