<?php
/**
 * Core class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-mdorim
 */
namespace Mdorim;

define( 'MDORIM_PATH', dirname( __FILE__, 3 ) );

class Core {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \Mdorim\Traits\Singleton, \Mdorim\Traits\Debug;

	/**
	 * Schemas.
	 *
	 * @var \Mdorim\Schema\Schemas
	 */
	public $schemas;

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->init();
	}

	private function init() {
		$this->schemas = \Mdorim\Schema\Schemas::get_instance();
	}
}