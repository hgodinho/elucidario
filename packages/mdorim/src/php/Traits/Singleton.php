<?php
/**
 * Singleton trait.
 *
 * @since 0.1.0
 * @package elucidario/pkg-mdorim
 */

namespace Mdorim\Traits;

/**
 * Singleton trait.
 */
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
	 * @return mixed
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
}