<?php
/**
 * Error class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Error;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Error Base Class
 *
 * Extends the WP_Error class.
 */
abstract class Base extends \WP_Error {
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
	 * @param string  $code    Error code.
	 * @param string  $data    Error data.
	 * @param string  $message Error message.
	 * @param boolean $dump   Dump the error.
	 */
	public function __construct( $code = '', $data = '', $message = '', $dump = false ) {
		if ( empty( $code ) ) {
			return;
		}
		$this->possible_errors = $this->set_possible_errors();
		if ( ! $this->is_valid_code( $code ) ) {
			$code = 'unknown_error__' . $code;
		}
		$message = $this->get_possible_error_message( $code, $message );
		parent::__construct( $code, $message, $data );
		if ( $dump ) {
			$this->dump( 'cli', $this->get_error_message(), __CLASS__, __METHOD__, __LINE__, false );
		}
	}

	/**
	 * Set the error codes.
	 *
	 * @return array
	 */
	abstract public function set_possible_errors();

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
		return ! empty( $default ) ? $default : ( isset( $this->possible_errors[ $code ] ) ? $this->possible_errors[ $code ] : '' );
	}
}
