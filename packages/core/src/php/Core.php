<?php

/**
 * Core class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

class Core {
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
	 * Schema.
	 *
	 * @var \LCDR\Mdorim\Schema
	 */
	public $schema;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->db = new \LCDR\DB\Core();
		$this->options = new \LCDR\Options\Core();
		$this->schema = new \LCDR\Mdorim\Schema();

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