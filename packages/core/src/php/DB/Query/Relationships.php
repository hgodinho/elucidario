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
class Relationships extends Query {
	/**
	 * Name of the table
	 *
	 * @var string
	 */
	protected $table_name = 'lcdr_relationships';

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
	 * Add entity
	 *
	 * @param array $args Arguments to add the entity.
	 * @return bool|int False on failure, the ID of the inserted entity otherwise.
	 */
	public function add_relationship( $args = array() ) {
		$args = $this->parse_args( $args );
		/**
		 * Filter the arguments before adding the entity.
		 *
		 * @wp-filter lcdr_add_{this->item_name}_args
		 */
		return parent::add_item(
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $args )
		);
	}

	/**
	 * Parse args
	 *
	 * @param array $args Arguments to parse.
	 * @return mixed Parsed arguments.
	 */
	public function parse_args( array $args ) {
		$parsed = array();

		foreach ( $args as $key => $value ) {
			$parsed[ $key ] = $this->sanitize_data( $key, $value );
		}

		if ( isset( $parsed['order'] ) ) {
			$parsed['rel_order'] = $parsed['order'];
			unset( $parsed['order'] );
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
	 * @param mixed  $data Data to sanitize.
	 * @return mixed Sanitized data.
	 */
	public function sanitize_data( string $key, mixed $data ) {
		/**
		 * Filter the data before saving it to the database.
		 *
		 * @wp-filter lcdr_sanitize_data_{key}
		 */
		return apply_filters( lcdr_hook( array( 'sanitize_data', $key ) ), $data );
	}
}
