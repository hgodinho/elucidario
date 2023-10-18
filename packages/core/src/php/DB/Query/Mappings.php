<?php
/**
 * Mappings query class.
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
 * Mappings query class.
 */
class Mappings extends Query {
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
	protected $table_name = 'mappings';

	/**
	 * Item name
	 *
	 * @var string
	 */
	protected $item_name = 'mapping';

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
	protected $table_schema = '\\LCDR\\DB\\Schema\\Mappings';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\Mapping';

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Get mappings
	 *
	 * @param array $args Arguments to query the database.
	 * @return array Array of mappings.
	 */
	public function get_mappings( $args = array() ) {
		$items = $this->query( $args );

		return $items;
	}

	/**
	 * Get mapping
	 *
	 * @param int $mapping_id ID of the mapping.
	 * @return bool|\LCDR\DB\Interfaces\Entity False on failure, the mapping otherwise.
	 */
	public function get_mapping( int $mapping_id ) {
		$item = $this->get_item_by( 'mapping_id', $mapping_id );
		return $item;
	}

	/**
	 * Add mapping
	 *
	 * @param array $args Arguments to add the mapping.
	 * @return bool|int False on failure, the ID of the inserted mapping otherwise.
	 * @throws \Exception If there were errors while adding the mapping.
	 */
	public function add_mapping( $args = array() ) {
		$columns = $this->parse_args( $args );

		$item_id = $this->add_item(
			/**
			 * Filter the arguments before adding the mapping.
			 *
			 * @wp-filter lcdr_add_{this->item_name}_args
			 * @param array $args Arguments to add the mapping.
			 * @return array
			 */
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $columns )
		);
		$item_id = lcdr_parse_item_id( $item_id );

		$this->add_props_maps( $item_id, $args );

		return $item_id;
	}

	/**
	 * Add mappings
	 *
	 * @param array $args Arguments to add the mappings.
	 * @return \LCDR\DB\Row\Procedure[] Array of added mappings.
	 */
	public function add_mappings( $args = array() ) {
		$added = array();
		foreach ( $args as $arg ) {
			$added[] = $this->add_mapping( $arg );
		}
		return $added;
	}

	/**
	 * Update mapping
	 *
	 * @param int   $mapping_id ID of the mapping.
	 * @param array $args Arguments to update the mapping.
	 * @return bool|int False on failure, the ID of the updated mapping otherwise.
	 */
	public function update_mapping( int $mapping_id, $args = array() ) {
		$update = true;
		if ( ! $mapping_id ) {
			return false;
		}

		$mapping = $this->get_mapping( $mapping_id );

		if ( ! $mapping || is_lcdr_error( $mapping ) ) {
			return $mapping;
		}

		$args = $this->parse_args( $args, $update );

		return $this->update_item(
			$mapping_id,
			/**
			 * Filter the arguments before adding the mapping.
			 *
			 * @wp-filter lcdr_update_{this->item_name}_args
			 * @param array $args Arguments to update the mapping.
			 * @param \LCDR\DB\Row\Procedure $mapping Procedure.
			 * @param int $mapping_id Procedure ID.
			 * @return array
			 */
			apply_filters(
				lcdr_hook( array( 'update', $this->item_name, 'args' ) ),
				$args,
				$mapping,
				$mapping_id
			)
		);
	}

	/**
	 * Delete mapping
	 *
	 * @param integer $mapping_id Entity ID.
	 * @return bool|int False on failure, the ID of the deleted mapping otherwise.
	 */
	public function delete_mapping( int $mapping_id ) {
		return $this->delete_item(
			/**
			 * Filter the mapping ID before deleting it.
			 *
			 * @wp-filter lcdr_delete_{this->item_name}
			 * @param int $mapping_id Entity ID.
			 * @return int
			 */
			apply_filters(
				lcdr_hook( array( 'delete', $this->item_name ) ),
				$mapping_id
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
	 *
	 * @param array $args Arguments to parse.
	 * @param bool  $update Whether the arguments are for an update or not.
	 * @return mixed Parsed arguments.
	 *
	 * @throws \Exception If the mapping doesn't have one of the required fields.
	 */
	protected function parse_args( array $args, $update = false ) {
		if ( ! $update ) {
			if ( ! isset( $args['title'] ) ) {
				throw new \Exception( __( 'The data must have a title.', 'lcdr' ) );
			}
			if ( ! isset( $args['standard'] ) ) {
				throw new \Exception( __( 'The data must have a standard.', 'lcdr' ) );
			}
		}

		$columns = array();
		foreach ( $args as $key => $value ) {
			if ( in_array( $key, lcdr_get_columns_names( 'mapping' ), true ) ) {
				$columns[ $key ] = $this->sanitize_data( $key, $value );
			}
		}

		$mapping = null;
		if ( isset( $columns['mapping_id'] ) && ! empty( $columns['mapping_id'] ) ) {
			$mapping = $this->get_mapping( $columns['mapping_id'] );
		}
		if ( is_lcdr_error( $mapping ) ) {
			return $mapping;
		}

		// Column UUID.
		if ( ! isset( $columns['uuid'] ) && $mapping ) {
			$columns['uuid'] = $mapping->uuid;
		} elseif ( ! isset( $columns['uuid'] ) && ! $mapping ) {
			$columns['uuid'] = \wp_generate_uuid4();
		}

		// Column Author.
		if ( ! isset( $columns['author'] ) && $mapping ) {
			$columns['author'] = $mapping->author;
		} elseif ( ! isset( $columns['author'] ) && ! $mapping ) {
			$columns['author'] = \get_current_user_id();
		}

		// Column Status.
		if ( ! isset( $columns['status'] ) && $mapping ) {
			$columns['status'] = $mapping->status;
		} elseif ( ! isset( $columns['status'] ) && ! $mapping ) {
			$columns['status'] = 'active';
		}

		// If the name is not previously set, set it based on the title property.
		if ( ! isset( $columns['name'] ) && $mapping ) {
			$columns['name'] = $mapping->name;
		} elseif ( ! isset( $columns['name'] ) && ! $mapping ) {
			$columns['name'] = lcdr_unique_entity_slug(
				isset( $columns['mapping_id'] ) ? (int) $columns['mapping_id'] : 0,
				$columns['title'],
				$columns['status']
			);
		}

		return $columns;
	}

	public function add_props_maps( $mapping_id, $args ) {
		$mapping = array();
		if ( ! isset( $args['mapping'] ) ) {
			return false;
		} else {
			$mapping = $args['mapping'];
		}
		if ( is_array( $args ) ) {
			$mapping = array_map(
				function ( $item ) use ( $mapping_id ) {
					$item               = (array) $item;
					$item['mapping_id'] = $mapping_id;
					return $item;
				},
				$mapping
			);
		} else {
			$mapping['mapping_id'] = $mapping_id;
		}
		$query = new \LCDR\DB\Query\PropsMaps();
		return $query->add_props_maps( $mapping );
	}

	/**
	 * Sanitize data
	 *
	 * @param string $key Key of the data.
	 * @param mixed  $data Data to sanitize.
	 * @return mixed Sanitized data.
	 */
	protected function sanitize_data( string $key, mixed $data ) {
		// todo - sanitize data.
		return $data;
	}
}
