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
 * Entities query class.
 */
class Entities extends Query {
	/**
	 * Name of the table
	 *
	 * @var string
	 */
	protected $table_name = 'lcdr_entities';

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
	 */
	public function add_entity( $args = array() ) {
		$args = $this->parse_args( $args );

		/**
		 * Filter the arguments before adding the entity.
		 *
		 * @wp-filter lcdr_add_{this->item_name}_args
		 */
		return $this->add_item(
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $args )
		);
	}

	/**
	 * Update entity
	 *
	 * @param int   $entity_id ID of the entity.
	 * @param array $args Arguments to update the entity.
	 * @return bool|int False on failure, the ID of the updated entity otherwise.
	 */
	public function update_entity( int $entity_id, $args = array() ) {
		$args = $this->parse_args( $args );

		/**
		 * Filter the arguments before adding the entity.
		 *
		 * @wp-filter lcdr_update_{this->item_name}_args
		 */
		return $this->update_item(
			$entity_id,
			apply_filters( lcdr_hook( array( 'update', $this->item_name, 'args' ) ), $args )
		);
	}

	/**
	 * Delete entity
	 *
	 * @param integer $entity_id Entity ID.
	 * @return bool|int False on failure, the ID of the deleted entity otherwise.
	 */
	public function delete_entity( int $entity_id ) {
		return $this->delete_item( $entity_id );
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
	 *
	 * @throws \Exception If the entity doesn't have an identifier.
	 */
	protected function parse_args( array $args ) {
		if ( ! isset( $args['identified_by'] ) ) {
			throw new \Exception( __( 'The entity must have an identifier.', 'lcdr' ) );
		}

		$parsed = array();

		foreach ( $args as $key => $value ) {
			$parsed[ $key ] = $this->sanitize_data( $key, $value );
		}

		/**
		 * Filter the arguments after sanitizing them.
		 *
		 * @wp-filter lcdr_parse_{this->item_name}_query_args
		 */
		return apply_filters(
			lcdr_hook( array( 'parse', $this->item_name, 'query', 'args' ) ),
			$parsed
		);
	}

	/**
	 * Sanitize data
	 *
	 * @param string $key Key of the data.
	 * @param array  $data Data to sanitize.
	 * @return mixed Sanitized data.
	 */
	protected function sanitize_data( string $key, array $data ) {
		$data = $this->maybe_encode_data( $key, $data );

		/**
		 * Filter the data before saving it to the database.
		 *
		 * @wp-filter lcdr_sanitize_data_{key}
		 */
		return apply_filters( lcdr_hook( array( 'sanitize_data', $key ) ), $data );
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
		return $data;
	}
}
