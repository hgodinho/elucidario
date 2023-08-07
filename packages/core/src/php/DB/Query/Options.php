<?php
/**
 * Options class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Query;

use \BerlinDB\Database\Query;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Options query class.
 */
class Options extends Query {
	/**
	 * Name of the table
	 *
	 * @var string
	 */
	protected $table_name = 'lcdr_options';

	/**
	 * Database version key
	 *
	 * @var string
	 */
	protected $db_version_key = 'lcdr_db_version';

	/**
	 * Database schema
	 *
	 * @var string
	 */
	protected $table_schema = '\\LCDR\\DB\\Schema\\Options';

	/**
	 * Name of the item
	 *
	 * @var string
	 */
	protected $item_name = 'option';

	/**
	 * Plural name of the item
	 *
	 * @var string
	 */
	protected $item_name_plural = 'options';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\Option';

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Get an option.
	 *
	 * @param string $option The name of the option.
	 * @param mixed  $default The default value to return if the option does not exist.
	 * @return mixed The value of the option, or the default value if the option does not exist.
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
	 *
	 * @return array Array of options.
	 */
	public function get_options() {
		$items = $this->query(
			array(
				'orderby' => array( 'id' ),
				'order'   => 'ASC',
			)
		);
		return $items;
	}

	/**
	 * Update an option.
	 *
	 * @param string $option The name of the option.
	 * @param mixed  $value The value of the option.
	 * @return bool if the value was updated, false if the value passed is equal to the value in the database, or if the update failed.
	 */
	public function update_option( string $option, mixed $value ) {
		$item = $this->get_item_by( 'name', $option );
		if ( $item && $item->value === $value ) {
			return false;
		}
		if ( ! $item ) {
			if ( $this->add_item(
				array(
					'name'  => $option,
					'value' => $value,
				)
			) ) {
				return true;
			} else {
				return false;
			}
		}
		$update = $this->update_item(
			$item->id,
			array(
				'name'  => $option,
				'value' => $value,
			)
		);
		if ( 1 === $update ) {
			return true;
		}
		return $update;
	}
}
