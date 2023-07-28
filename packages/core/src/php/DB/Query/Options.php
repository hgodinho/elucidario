<?php

/**
 * Options class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Query;

use \BerlinDB\Database\Query;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

class Options extends Query {
	protected $table_name = 'lcdr_options';
	protected $db_version_key = 'lcdr_db_version';

	protected $table_schema = '\\LCDR\\DB\\Schema\\Options';

	protected $item_name = 'option';

	protected $item_name_plural = 'options';

	protected $item_shape = '\\LCDR\\DB\\Row\\Options';

	/**
	 * Get an option.
	 *
	 * @param string $option
	 * @param mixed $default
	 * @return mixed
	 */
	public function get_option( string $option, mixed $default = '' ) {
		$item = $this->get_item_by( 'name', $option );

		if ( ! $item ) {
			return $default;
		}
		return $item->value;
	}

	/**
	 * Get all options.
	 */
	public function get_options() {
		$items = $this->query( [ 
			'orderby' => [ 'id' ],
			'order' => 'ASC',
		] );
		return $items;
	}

	/**
	 * Update an option.
	 *
	 * @param string $option
	 * @param mixed $value
	 * @return bool | true if the value was updated, false if the value passed is equal to the value in the database, or if the update failed.
	 */
	public function update_option( string $option, mixed $value ) {
		$item = $this->get_item_by( 'name', $option );
		if ( $item->value === $value ) {
			return false;
		}
		if ( ! $item ) {
			if ( $this->add_item( array(
				'name' => $option,
				'value' => $value,
			) ) ) {
				return true;
			} else {
				return false;
			}
		}
		$update = $this->update_item( $item->id, array(
			'name' => $option,
			'value' => $value,
		) );
		if ( $update === 1 ) {
			return true;
		}
		return $update;
	}
}