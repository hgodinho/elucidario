<?php
/**
 * RowTrait class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

trait Row {
	/**
	 * Allowed properties.
	 *
	 * @var array
	 */
	public $allowed_properties;

	/**
	 * Get the entity property.
	 *
	 * @param string $property Property.
	 * @return mixed|boolean Boolean false if property is not valid.
	 */
	public function get_property( string $property ): mixed {
		if ( ! in_array( $property, lcdr_get_valid_properties(), true ) ) {
			return false;
		}
		if ( in_array( $property, lcdr_get_json_properties(), true ) ) {
			return json_decode( $this->{$property} );
		}
		return $this->{$property};
	}

	/**
	 * Get the allowed properties.
	 *
	 * @return array
	 */
	public function get_allowed_properties(): array {
		return $this->allowed_properties;
	}

	/**
	 * Set the allowed properties.
	 *
	 * @return array
	 */
	abstract function set_allowed_properties();
}
