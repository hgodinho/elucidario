<?php
/**
 * Relationships class.
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
 * Entities query class.
 */
final class Relationships extends Query {
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
	protected $table_name = 'relationships';

	/**
	 * Item name
	 *
	 * @var string
	 */
	protected $item_name = 'relationship';

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
	protected $table_schema = '\\LCDR\\DB\\Schema\\Relationships';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\Relationship';

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
	 * Get relationships by entity id
	 *
	 * @param int         $entity_id Entity ID.
	 * @param string|null $predicate Predicate.
	 * @return \LCDR\DB\Interfaces\Relationship[] Array of relationships
	 */
	public function get_relationships_by_entity_id( $entity_id, $predicate = null ) {
		add_filter( lcdr_hook( array( $this->item_name_plural, 'query', 'clauses' ) ), array( $this, 'filter_query_clauses' ) );
		$items = $this->query(
			array(
				'order'   => 'ASC',
				'subject' => $entity_id,
				'object'  => $entity_id,
			),
		);
		remove_filter( lcdr_hook( array( $this->item_name_plural, 'query', 'clauses' ) ), array( $this, 'filter_query_clauses' ) );
		if ( $predicate ) {
			$items = array_filter(
				$items,
				function ( $item ) use ( $predicate ) {
					return $item->predicate === $predicate;
				}
			);
		}
		return $items;
	}

	/**
	 * Filter query clauses
	 *
	 * @param array $clauses Query clauses.
	 * @return array
	 */
	public function filter_query_clauses( $clauses = array() ) {
		$clauses['where'] = str_replace( 'AND', 'OR', $clauses['where'] );
		return $clauses;
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
	 * @param array $args Updated args.
	 * @return bool|int False on failure, the ID of the inserted relationship otherwise.
	 */
	public function update_relationship( $args = array() ) {
		$args            = $this->parse_args( $args );
		$relationship_id = false;

		if ( isset( $args['rel_id'] ) ) {
			$relationship_id = $args['rel_id'];
		}

		if ( ! $relationship_id ) {
			return $this->add_relationship( $args );
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
			$updated[] = $this->update_relationship( $relationship );
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
	 * @param array $relationships Relationships ids.
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

		if ( isset( $parsed['predicate'] ) ) {
			$relationships = array_merge(
				lcdr_get_relationships_names(),
				lcdr_get_mixed_names()
			);
			if ( ! in_array( $parsed['predicate'], $relationships, true ) ) {
				$this->dump(
					'cli',
					sprintf(
						/* translators: %s predicate value */
						__( '%s is not a valid relationship name.', 'lcdr' ),
						$parsed['predicate']
					),
					__CLASS__,
					__METHOD__,
					__LINE__,
					true
				);
			}
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
