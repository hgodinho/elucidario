<?php
/**
 * Options class.
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
 * Entities query class.
 */
final class ProceduresEntities extends Query {
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
	protected $table_name = 'procedures_entities';

	/**
	 * Item name
	 *
	 * @var string
	 */
	protected $item_name = 'procedure_entity';

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
	protected $table_schema = '\\LCDR\\DB\\Schema\\ProceduresEntities';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\ProcedureEntity';

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Get entities
	 *
	 * @param array $args Arguments to query the database.
	 * @return array Array of entities.
	 */
	public function get_relationships( $args = array() ) {
		$items = $this->query( $args );

		return $items;
	}

	/**
	 * Get relationship
	 *
	 * @param int $relationship_id Relationship ID.
	 * @return \LCDR\DB\Interfaces\Relationship
	 */
	public function get_relationship( $relationship_id ) {
		$item = $this->get_item( $relationship_id );
		return $item;
	}

	/**
	 * Add relationship
	 *
	 * @param array $args Arguments to add the relationship.
	 * @return bool|int False on failure, the ID of the inserted relationship otherwise.
	 */
	public function add_relationship( $args = array() ) {
		$args = $this->parse_args( $args );

		$rel_id = parent::add_item(
			/**
			 * Filter the arguments before adding the relationship.
			 *
			 * @wp-filter lcdr_add_{this->item_name}_args
			 * @param array $args Arguments to add the relationship.
			 * @return array
			 */
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $args )
		);

		return lcdr_parse_item_id( $rel_id );
	}

	/**
	 * Add multiple relationships
	 *
	 * @param array $relationships Array of arguments to add the relationships.
	 * @return array Array of IDs of the inserted relationships.
	 */
	public function add_relationships( $relationships = array() ) {
		$added = array();
		foreach ( $relationships as $relationship ) {
			$added[] = $this->add_relationship( $relationship );
		}
		return $added;
	}

	/**
	 * Update relationship
	 *
	 * @param int   $relationship_id Relationship ID.
	 * @param array $args Updated args.
	 * @return bool|int False on failure, the ID of the inserted relationship otherwise.
	 * @throws \Exception If relationship ID is empty.
	 */
	public function update_relationship( int $relationship_id, $args = array() ) {
		$args = $this->parse_args( $args );

		if ( empty( $relationship_id ) ) {
			throw new \Exception( __( 'Relationship ID is required.', 'lcdr' ) );
		}

		return parent::update_item(
			$relationship_id,
			/**
			 * Filter the arguments before adding the relationship.
			 *
			 * @wp-filter lcdr_update_{this->item_name}_args
			 * @param array $args Arguments to add the relationship.
			 * @param int   $relationship->rel_id Relationship ID.
			 * @return array
			 */
			apply_filters( lcdr_hook( array( 'update', $this->item_name, 'args' ) ), $args, $relationship_id )
		);
	}

	/**
	 * Update multiple relationships
	 *
	 * @param array $relationships Array of arguments to update the relationships.
	 * @return array Array of IDs of the updated relationships.
	 */
	public function update_relationships( $relationships = array() ) {
		$updated = array();
		foreach ( $relationships as $relationship ) {
			$id = false;
			if ( isset( $relationship['rel_id'] ) ) {
				$id = $relationship['rel_id'];
				unset( $relationship['rel_id'] );
			}
			$updated[] = $this->update_relationship( $id, $relationship );
		}

		return $updated;
	}

	/**
	 * Delete relationship
	 *
	 * @param int $relationship_id Relationship ID.
	 * @return bool|int False on failure, the ID of the inserted relationship otherwise.
	 */
	public function delete_relationship( $relationship_id ) {
		return parent::delete_item(
			/**
			 * Filter the arguments before deleting the relationship.
			 *
			 * @wp-filter lcdr_delete_{this->item_name}
			 * @param int $relationship_id Relationship ID.
			 * @return int
			 */
			apply_filters(
				lcdr_hook( array( 'delete', $this->item_name ) ),
				$relationship_id
			)
		);
	}

	/**
	 * Delete relationships
	 *
	 * @param array $relationships ProceduresEntities ids.
	 * @return array
	 */
	public function delete_relationships( $relationships = array() ) {
		return array_map(
			function ( $relationship ) {
				return $this->delete_relationship( $relationship );
			},
			$relationships
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
	 * @return mixed Parsed arguments.
	 * @throws \Exception If predicate is not a valid relationship name.
	 */
	protected function parse_args( array $args ) {
		$parsed = array();

		foreach ( $args as $key => $value ) {
			$parsed[ $key ] = $this->sanitize_data( $key, $value );
		}

		if ( isset( $parsed['order'] ) ) {
			$parsed['rel_order'] = $parsed['order'];
			unset( $parsed['order'] );
		}

		return $parsed;
	}

	/**
	 * Sanitize data
	 *
	 * @param string $key Key of the data.
	 * @param mixed  $data Data to sanitize.
	 * @return mixed Sanitized data.
	 */
	protected function sanitize_data( string $key, mixed $data ) {
		// TODO: sanitize data.
		return $data;
	}
}