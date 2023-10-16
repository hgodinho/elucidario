<?php
/**
 * Error class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Error;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Error Base Class
 *
 * Extends the WP_Error class.
 */
abstract class Base extends \WP_Error implements Error {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug;

	/**
	 * Possible errors.
	 *
	 * @var array
	 */
	private $possible_errors = array();

	/**
	 * Prefix.
	 *
	 * @var string
	 */
	private $prefix = '';

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
	 *
	 * @param string $code    Error code.
	 * @param mixed  $data    Error data.
	 * @param string $message Error message.
	 */
	public function __construct( $code = '', $data = array(), $message = '' ) {
		$this->prefix = $this->set_prefix();
		if ( empty( $code ) ) {
			parent::__construct( $this->prefix_error_code( 'undefined_error' ), $message, $data );
			return;
		}
		$this->possible_errors = $this->set_possible_errors();
		if ( ! $this->is_valid_code( $code ) ) {
			$code = $this->prefix_error_code( 'unknown_error__' . $code );
		} else {
			$code = $this->prefix_error_code( $code );
		}
		$message = $this->get_possible_error_message( $code, $message );
		parent::__construct( $code, $message, $data );
	}

	/**
	 * Set the error codes.
	 *
	 * @return array
	 */
	abstract public function set_possible_errors();

	/**
	 * Set prefix.
	 *
	 * @return string
	 */
	abstract public function set_prefix();

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */
	/**
	 * Check if the code is valid.
	 *
	 * @param string $code Error code.
	 * @return boolean
	 */
	private function is_valid_code( $code ) {
		return in_array( $code, $this->get_possible_error_codes(), true );
	}

	/**
	 * Get the error codes.
	 *
	 * @return array
	 */
	private function get_possible_error_codes() {
		return array_keys( $this->possible_errors );
	}

	/**
	 * Get the error message.
	 *
	 * @param string $code    Error code.
	 * @param string $default Default error message.
	 * @return string
	 */
	private function get_possible_error_message( $code, $default = '' ) {
		return ! empty( $default ) ? $default : ( isset( $this->prefix_possible_error_codes()[ $code ] ) ? $this->prefix_possible_error_codes()[ $code ] : '' );
	}

	/**
	 * Prefix the possible error codes.
	 *
	 * @return array
	 */
	private function prefix_possible_error_codes() {
		$prefixed_possible_errors = array();
		foreach ( $this->possible_errors as $code => $message ) {
			$prefixed_possible_errors[ $this->prefix_error_code( $code ) ] = $message;
		}
		return $prefixed_possible_errors;
	}

	/**
	 * Prefix the error code.
	 *
	 * @param string $code Error code.
	 * @return string
	 */
	private function prefix_error_code( $code ) {
		return "{$this->prefix}_{$code}";
	}
}
