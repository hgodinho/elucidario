<?php
/**
 * Core class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Rest;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Core Rest Class
 */
class Core {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\singleton;
	use \LCDR\Utils\debug;

	/**
	 * Routes.
	 *
	 * @var array
	 */
	public static $routes = array(
		'\\LCDR\\Rest\\Routes\\Concepts',
		'\\LCDR\\Rest\\Routes\\Objects',
		'\\LCDR\\Rest\\Routes\\Mapping',
	);

	/**                 __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Register routes.
	 */
	public function register_routes() {
		foreach ( self::$routes as $route ) {
			$endpoint = new $route();
			$endpoint->register_routes();
		}
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}
}
