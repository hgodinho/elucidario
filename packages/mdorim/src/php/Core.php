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
	use \Mdorim\Traits\Singleton;
	use \Mdorim\Traits\Debug;

	/**
	 * Schema validator.
	 *
	 * @var \Mdorim\Schema\Validator
	 */
	public $validator;

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->init();
	}

	private function init() {
		$this->validator = \Mdorim\Schema\Validator::get_instance();
	}
}