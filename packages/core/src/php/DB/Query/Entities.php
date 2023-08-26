<?php
/**
 * Entities class.
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
class Entities extends Query {
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
	protected $table_name = 'entities';

	/**
	 * Item name
	 *
	 * @var string
	 */
	protected $item_name = 'entity';

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
	protected $table_schema = '\\LCDR\\DB\\Schema\\Entities';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\Entity';

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
	public function get_entities( $args = array() ) {
		$items = $this->query( $args );

		return $items;
	}

	/**
	 * Get entity
	 *
	 * @param int $entity_id ID of the entity.
	 * @return bool|\LCDR\DB\Interfaces\Entity False on failure, the entity otherwise.
	 */
	public function get_entity( int $entity_id ) {
		$item = $this->get_item_by( 'entity_id', $entity_id );
		return $item;
	}

	/**
	 * Add entity
	 *
	 * @param array $args Arguments to add the entity.
	 * @return bool|int False on failure, the ID of the inserted entity otherwise.
	 * @throws \Exception If there were errors while adding the entity.
	 */
	public function add_entity( $args = array() ) {
		try {
			$args = $this->parse_args( $args );
		} catch ( \Exception $e ) {
			throw $e;
		}

		$item_id = $this->add_item(
			/**
			 * Filter the arguments before adding the entity.
			 *
			 * @wp-filter lcdr_add_{this->item_name}_args
			 * @param array $args Arguments to add the entity.
			 * @return array
			 */
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $args['columns'] )
		);
		$item_id = lcdr_parse_item_id( $item_id );

		// add relationships.
		$this->add_relationships(
			$item_id,
			/**
			 * Filter the relationships before adding the entity.
			 *
			 * @wp-filter lcdr_add_{this->item_name}_relationships
			 * @param array $relationships Relationships.
			 * @param int   $item_id       Item ID.
			 * @return array
			 */
			apply_filters(
				lcdr_hook( array( 'add', $this->item_name, 'relationships' ) ),
				$args['relationships'],
				$item_id
			)
		);

		return $item_id;
	}

	/**
	 * Add entities
	 *
	 * @param array $args Arguments to add the entities.
	 * @return \LCDR\DB\Interfaces\Entity[]
	 */
	public function add_entities( $args = array() ) {
		$added = array();
		foreach ( $args as $arg ) {
			$added[] = $this->add_entity( $arg );
		}
		return $added;
	}

	/**
	 * Update entity
	 *
	 * @param int   $entity_id ID of the entity.
	 * @param array $args Arguments to update the entity.
	 * @return bool|int False on failure, the ID of the updated entity otherwise.
	 * @throws \Exception If no entity was found.
	 */
	public function update_entity( int $entity_id, $args = array() ) {
		$update = true;

		$entity = $this->get_entity( $entity_id );
		if ( ! $entity ) {
			throw new \Exception( __( 'Entity not found.', 'lcdr' ) );
		}

		$args = $this->parse_args( $args, $update );

		if ( $args['relationships'] ) {
			$add    = array();
			$update = array();

			/**
			 * Filter the relationships before updating the entity.
			 *
			 * @wp-filter lcdr_update_{this->item_name}_relationships
			 * @param array $relationships Relationships.
			 * @param \LCDR\DB\Interfaces\Entity $entity Entity.
			 * @return array
			 */
			$relationships = apply_filters(
				lcdr_hook( array( 'update', $this->item_name, 'relationships' ) ),
				$args['relationships'],
				$entity
			);

			foreach ( $relationships as $key => $new_relationships ) {
				$old_relationships = $entity->get_property( $key );

				// remove relationships.
				$to_remove = array_values( array_diff( $old_relationships, $new_relationships ) );
				$this->remove_relationships( $entity_id, $key, $to_remove );

				// prepare for add relationships.
				$to_add         = array_values( array_diff( $new_relationships, $old_relationships ) );
				$add[ $key ]    = $to_add;
				$update[ $key ] = array_diff( $new_relationships, $to_add );
			}

			$this->update_relationships( $entity_id, $update );
			$this->add_relationships( $entity_id, $add );
		}

		return $this->update_item(
			$entity_id,
			/**
			 * Filter the arguments before adding the entity.
			 *
			 * @wp-filter lcdr_update_{this->item_name}_args
			 * @param array $args Arguments to update the entity.
			 * @param \LCDR\DB\Interfaces\Entity $entity Entity.
			 * @return array
			 */
			apply_filters(
				lcdr_hook( array( 'update', $this->item_name, 'args' ) ),
				$args['columns'],
				$entity
			)
		);
	}

	/**
	 * Delete entity
	 *
	 * @param integer $entity_id Entity ID.
	 * @return bool|int False on failure, the ID of the deleted entity otherwise.
	 */
	public function delete_entity( int $entity_id ) {
		return $this->delete_item(
			/**
			 * Filter the entity ID before deleting it.
			 *
			 * @wp-filter lcdr_delete_{this->item_name}
			 * @param int $entity_id Entity ID.
			 * @return int
			 */
			apply_filters(
				lcdr_hook( array( 'delete', $this->item_name ) ),
				$entity_id
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
	 * @throws \Exception If the entity doesn't have one of the required fields.
	 */
	protected function parse_args( array $args, $update = false ) {
		if ( ! $update ) {
			if ( ! isset( $args['type'] ) ) {
				throw new \Exception( __( 'The data must have a type.', 'lcdr' ) );
			}
			if ( ! isset( $args['name'] ) ) {
				throw new \Exception( __( 'The data must have a name.', 'lcdr' ) );
			}
		}

		$columns       = array();
		$relationships = array();
		foreach ( $args as $key => $value ) {
			if ( in_array( $key, lcdr_get_columns_names(), true ) ) {
				$columns[ $key ] = $this->sanitize_data( $key, $value );
			}
			if ( in_array( $key, lcdr_get_relationships_names(), true ) ) {
				$relationships[ $key ] = $this->sanitize_data( $key, $value );
			}
			if ( in_array( $key, lcdr_get_mixed_names(), true ) ) {
				$mixed = $this->parse_mixed_args( $key, $value );
				foreach ( $mixed as $name => $col_or_rel ) {
					if ( 'columns' === $name ) {
						$columns[ $key ] = $this->sanitize_data( $key, $col_or_rel );
					}
					if ( 'relationships' === $name ) {
						$relationships[ $key ] = $col_or_rel;
					}
				}
			}
		}
		$columns['guid']   = isset( $columns['guid'] ) ? $columns['guid'] : \wp_generate_uuid4();
		$columns['author'] = isset( $columns['author'] ) ? $columns['author'] : \get_current_user_id();

		return array(
			'columns'       => ! empty( $columns ) ? $columns : null,
			'relationships' => ! empty( $relationships ) ? $relationships : null,
		);
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
		if ( in_array( $key, lcdr_get_json_properties(), true ) ) {
			return wp_json_encode( $data );
		}
		if ( in_array( $key, lcdr_get_mixed_names(), true ) ) {
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
	/**
	 * Parse mixed args, used for properties that can be either a column or a relationship.
	 *
	 * @param string $key Key of the data.
	 * @param array  $args Data to parse.
	 * @return array
	 */
	private function parse_mixed_args( string $key, array $args ) {
		$mixed = array();
		foreach ( $args as $arg ) {
			if ( is_object( $arg ) ) {
				$mixed['columns'][] = $arg;

			}
			if ( is_numeric( $arg ) ) {
				$mixed['relationships'][] = $arg;
			}
		}
		return $mixed;
	}

	/**
	 * Parse relationships
	 *
	 * @param int   $item_id Item ID.
	 * @param mixed $relationships Relationships.
	 * @return array|false
	 */
	private function parse_relationships( int $item_id, mixed $relationships ) {
		if ( ! $relationships ) {
			return false;
		}

		$parsed = array();
		foreach ( $relationships as $key => $relationship ) {
			$index = 0;
			foreach ( $relationship as $related_id ) {
				$parsed[] = $this->mount_relationship( $item_id, $key, $related_id, $index );
				++$index;
			}
		}

		return $parsed;
	}

	/**
	 * Mount relationship
	 *
	 * @param int    $subject_id Subject ID.
	 * @param string $predicate Predicate.
	 * @param int    $object_id Object ID.
	 * @param int    $order Order.
	 * @return array
	 */
	private function mount_relationship( $subject_id, $predicate, $object_id, $order = 0 ) {
		return array(
			'subject'   => $subject_id,
			'predicate' => $predicate,
			'object'    => $object_id,
			'order'     => $order,
		);
	}

	/**
	 * Add relationships
	 *
	 * @param int   $item_id Item ID.
	 * @param mixed $relationships Relationships.
	 * @return array|false
	 */
	private function add_relationships( int $item_id, mixed $relationships ) {
		$relationships = $this->parse_relationships( $item_id, $relationships );
		if ( ! $relationships ) {
			return false;
		}

		$query = new \LCDR\DB\Query\Relationships();
		return $query->add_relationships( $relationships );
	}

	/**
	 * Update relationships
	 *
	 * @param integer $item_id Item ID.
	 * @param mixed   $relationships Relationships.
	 * @return array|boolean
	 */
	private function update_relationships( int $item_id, mixed $relationships ) {
		$relationships = $this->parse_relationships( $item_id, $relationships );

		if ( ! $relationships ) {
			return false;
		}

		$query = new \LCDR\DB\Query\Relationships();
		$index = 0;
		foreach ( $relationships as $relationship ) {
			$stored                            = \wp_list_filter(
				$query->get_relationships_by_entity_id( $item_id, $relationship['predicate'] ),
				array(
					'object'    => $relationship['object'],
					'subject'   => $relationship['subject'],
					'predicate' => $relationship['predicate'],
				)
			);
			$to_update                         = array_pop( $stored );
			$relationships[ $index ]['rel_id'] = $to_update->rel_id;
			$index++;
		}

		return $query->update_relationships( $relationships );
	}

	/**
	 * Remove relationships
	 *
	 * @param integer $entity_id Entity ID.
	 * @param string  $predicate Predicate.
	 * @param array   $relationships Relationships.
	 * @return boolean
	 */
	private function remove_relationships( int $entity_id, string $predicate, array $relationships ) {
		if ( ! $relationships || ! $entity_id || ! $predicate ) {
			return false;
		}
		$query = new \LCDR\DB\Query\Relationships();

		foreach ( $relationships as $relationship ) {
			$rel_to_del = $query->get_results(
				array(
					'rel_id',
				),
				array(
					'subject'   => $entity_id,
					'predicate' => $predicate,
					'object'    => $relationship,
				)
			);

			$query->delete_relationships(
				array_map(
					function ( $del ) {
						return $del->rel_id;
					},
					$rel_to_del
				)
			);

		}
		return true;
	}
}
