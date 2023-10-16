<?php
/**
 * Singleton trait.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Utils;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

trait Singleton {
	/**
	 * Instance.
	 *
	 * @var mixed
	 */
	private static $instance = null;

	/**
	 * Get instance.
	 *
	 * @return \LCDR\Utils\singleton
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
}
