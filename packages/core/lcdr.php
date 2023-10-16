<?php
/**
 * 
 *         __           _     __           _                   __
 *   ___  / /_  _______(_)___/ /___ ______(_)___   ____ ______/ /_
 *  / _ \/ / / / / ___/ / __  / __ `/ ___/ / __ \ / __ `/ ___/ __/
 * /  __/ / /_/ / /__/ / /_/ / /_/ / /  / / /_/ // /_/ / /  / /_
 * \___/_/\__,_/\___/_/\__,_/\__,_/_/  /_/\____(_)__,_/_/   \__/
 * 
 * 
 * @package @elucidario/pkg-core
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! defined( 'LCDR_PATH' ) ) {
	define( 'LCDR_PATH', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'LCDR_FILE' ) ) {
	define( 'LCDR_FILE', __DIR__ . '/index.php' );
}

if ( ! defined( 'LCDR_URL' ) ) {
	$url = plugin_dir_url( __FILE__ );
	define( 'LCDR_URL', $url );
}

if ( ! defined( 'LCDR_DEBUG' ) ) {
	define( 'LCDR_DEBUG', true );
}

if ( ! defined( 'LCDR_VERSION' ) ) {
	$header = get_file_data(
		__FILE__,
		array(
			'Version' => 'Version',
		)
	);
	define( 'LCDR_VERSION', $header['Version'] );
}

require LCDR_PATH . 'vendor/autoload.php';
require LCDR_PATH . 'src/php/functions.php';

global $lcdr;

$lcdr = LCDR\Core::get_instance();