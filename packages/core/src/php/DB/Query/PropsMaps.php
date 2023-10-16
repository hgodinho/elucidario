<?php
/**
 * PropsMaps query class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Query;

use \BerlinDB\Database\Query;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * PropsMaps query class.
 */
class PropsMaps extends Query {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug;

	/**
	 * Prefix for the table name
	 *
	 * @var string
	 */
	protected $prefix = 'lcdr';

	/**
	 * Table name
	 *
	 * @var string
	 */
	protected $table_name = 'props_maps';

	/**
	 * Item name
	 *
	 * @var string
	 */
	protected $item_name = 'prop_map';

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
	protected $table_schema = '\\LCDR\\DB\\Schema\\PropsMaps';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\PropMap';

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Get props_maps
	 *
	 * @param array $args Arguments to query the database.
	 * @return array Array of props_maps.
	 */
	public function get_props_maps( $args = array() ) {
		$items = $this->query( $args );

		return $items;
	}

	/**
	 * Get prop_map
	 *
	 * @param int $map_id ID of the prop_map.
	 * @return bool|\LCDR\DB\Interfaces\Entity False on failure, the prop_map otherwise.
	 */
	public function get_prop_map( int $map_id ) {
		$item = $this->get_item_by( 'map_id', $map_id );
		return $item;
	}

	/**
	 * Get props_maps by mapping_id
	 *
	 * @param integer $mapping_id Mapping ID.
	 * @param integer $limit Limit of props_maps to get.
	 * @param string  $order Order of props_maps to get.
	 * @return \LCDR\DB\Row\PropMap[]
	 */
	public function get_props_maps_by_mapping_id( int $mapping_id, int $limit = 0, $order = 'ASC' ) {
		$items = $this->query(
			array(
				'mapping_id' => $mapping_id,
				'number'     => $limit,
				'order'      => $order,
			)
		);

		return $items;
	}

	/**
	 * Add prop_map
	 *
	 * @param array $args Arguments to add the prop_map.
	 * @return bool|int False on failure, the ID of the inserted prop_map otherwise.
	 * @throws \Exception If there were errors while adding the prop_map.
	 */
	public function add_prop_map( $args = array() ) {
		try {
			$args = $this->parse_args( $args );
		} catch ( \Exception $e ) {
			throw $e;
		}

		$item_id = $this->add_item(
			/**
			 * Filter the arguments before adding the prop_map.
			 *
			 * @wp-filter lcdr_add_{this->item_name}_args
			 * @param array $args Arguments to add the prop_map.
			 * @return array
			 */
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $args )
		);
		$item_id = lcdr_parse_item_id( $item_id );

		return $item_id;
	}

	/**
	 * Add props_maps
	 *
	 * @param array $args Arguments to add the props_maps.
	 * @return \LCDR\DB\Row\Procedure[] Array of added props_maps.
	 */
	public function add_props_maps( $args = array() ) {
		$added = array();
		foreach ( $args as $arg ) {
			$added[] = $this->add_prop_map( $arg );
		}
		return $added;
	}

	/**
	 * Update prop_map
	 *
	 * @param int   $prop_map_id ID of the prop_map.
	 * @param array $args Arguments to update the prop_map.
	 * @return bool|int False on failure, the ID of the updated prop_map otherwise.
	 */
	public function update_prop_map( int $prop_map_id, $args = array() ) {
		if ( ! $prop_map_id ) {
			return false;
		}

		$args = $this->parse_args( $args, true );

		return $this->update_item(
			$prop_map_id,
			/**
			 * Filter the arguments before adding the prop_map.
			 *
			 * @wp-filter lcdr_update_{this->item_name}_args
			 * @param array $args Arguments to update the prop_map.
			 * @param \LCDR\DB\Row\Procedure $prop_map Procedure.
			 * @param int $prop_map_id Procedure ID.
			 * @return array
			 */
			apply_filters(
				lcdr_hook( array( 'update', $this->item_name, 'args' ) ),
				$args,
				// $prop_map,
				$prop_map_id
			)
		);
	}

	/**
	 * Delete prop_map
	 *
	 * @param integer $prop_map_id Entity ID.
	 * @return bool|int False on failure, the ID of the deleted prop_map otherwise.
	 */
	public function delete_prop_map( int $prop_map_id ) {
		return $this->delete_item(
			/**
			 * Filter the prop_map ID before deleting it.
			 *
			 * @wp-filter lcdr_delete_{this->item_name}
			 * @param int $prop_map_id Entity ID.
			 * @return int
			 */
			apply_filters(
				lcdr_hook( array( 'delete', $this->item_name ) ),
				$prop_map_id
			)
		);
	}

	/**
	 *                       __            __           __
	 *     ____  _________  / /____  _____/ /____  ____/ /
	 *    / __ \/ ___/ __ \/ __/ _ \/ ___/ __/ _ \/ __  /
	 *   / /_/ / /  / /_/ / /_/  __/ /__/ /_/  __/ /_/ /
	 *  / .___/_/   \____/\__/\___/\___/\__/\___/\__,_/
	 * /_/
	 */
	/**
	 * Parse args
	 * s Arguments to parse.
	 *
	 * @param array $args true Whether the arguments are for an update or not.
	 * @param bool  $update Whether the arguments are for an update or not.
	 * @return mixed Parsed arguments.
	 *
	 * @throws \Exception If the prop_map doesn't have one of the required fields.
	 */
	protected function parse_args( array $args, $update = false ) {
		if ( ! $update ) {
			if ( ! isset( $args['mapping_id'] ) ) {
				throw new \Exception( __( 'The data must have a mapping_id.', 'lcdr' ) );
			}
			if ( ! isset( $args['prop_name'] ) ) {
				throw new \Exception( __( 'The data must have a prop_name.', 'lcdr' ) );
			}
			if ( ! isset( $args['entity_type'] ) ) {
				throw new \Exception( __( 'The data must have a entity_type.', 'lcdr' ) );
			}
			if ( ! isset( $args['external_prop_name'] ) ) {
				throw new \Exception( __( 'The data must have a external_prop_name.', 'lcdr' ) );
			}
			if ( ! isset( $args['external_prop_type'] ) ) {
				throw new \Exception( __( 'The data must have a external_prop_type.', 'lcdr' ) );
			}
			if ( ! isset( $args['map_value'] ) ) {
				throw new \Exception( __( 'The data must have a map_value.', 'lcdr' ) );
			}
		}

		foreach ( $args as $key => $value ) {
			$args[ $key ] = $this->sanitize_data( $key, $value );
		}

		$args['editable'] = isset( $args['editable'] ) ? $args['editable'] : 1;
		$args['status']   = isset( $args['status'] ) ? $args['status'] : 'active';

		return $args;
	}

	/**
	 * Sanitize data
	 *
	 * @param string $key Key of the data.
	 * @param mixed  $data Data to sanitize.
	 * @return mixed Sanitized data.
	 */
	protected function sanitize_data( string $key, mixed $data ) {
		// maybe encode data to json.
		$data = $this->maybe_encode_data( $key, $data );

		return $data;
	}

	/**
	 * Maybe encode data
	 *
	 * @param string $key Property name.
	 * @param mixed  $data Data of the property.
	 * @return mixed
	 */
	protected function maybe_encode_data( $key, $data ) {
		if ( 'map_value' === $key ) {
			if ( is_object( $data ) || is_array( $data ) ) {
				return wp_json_encode( $data );
			}
		}
		return $data;
	}

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */
}
