<?php
/**
 * Procedures query class.
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
 * Procedures query class.
 */
final class Procedures extends Query {
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
	protected $table_name = 'procedures';

	/**
	 * Item name
	 *
	 * @var string
	 */
	protected $item_name = 'procedure';

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
	protected $table_schema = '\\LCDR\\DB\\Schema\\Procedures';

	/**
	 * Name of the class to use for each item
	 *
	 * @var string
	 */
	protected $item_shape = '\\LCDR\\DB\\Row\\Procedure';

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Get procedures
	 *
	 * @param array $args Arguments to query the database.
	 * @return array Array of procedures.
	 */
	public function get_procedures( $args = array() ) {
		$items = $this->query( $args );

		return $items;
	}

	/**
	 * Get procedure
	 *
	 * @param int $procedure_id ID of the procedure.
	 * @return bool|\LCDR\DB\Interfaces\Entity False on failure, the procedure otherwise.
	 */
	public function get_procedure( int $procedure_id ) {
		$item = $this->get_item_by( 'procedure_id', $procedure_id );
		return $item;
	}

	/**
	 * Add procedure
	 *
	 * @param array $args Arguments to add the procedure.
	 * @return bool|int False on failure, the ID of the inserted procedure otherwise.
	 * @throws \Exception If there were errors while adding the procedure.
	 */
	public function add_procedure( $args = array() ) {
		$args = $this->parse_args( $args );

		$item_id = $this->add_item(
			/**
			 * Filter the arguments before adding the procedure.
			 *
			 * @wp-filter lcdr_add_{this->item_name}_args
			 * @param array $args Arguments to add the procedure.
			 * @return array
			 */
			apply_filters( lcdr_hook( array( 'add', $this->item_name, 'args' ) ), $args )
		);
		$item_id = lcdr_parse_item_id( $item_id );

		if ( isset( $args['entities'] ) ) {
			$this->add_procedure_entities( $item_id, $args['entities'] );
		}

		return $item_id;
	}

	/**
	 * Add procedures
	 *
	 * @param array $args Arguments to add the procedures.
	 * @return \LCDR\DB\Row\Procedure[] Array of added procedures.
	 */
	public function add_procedures( $args = array() ) {
		$added = array();
		foreach ( $args as $arg ) {
			$added[] = $this->add_procedure( $arg );
		}
		return $added;
	}

	/**
	 * Update procedure
	 *
	 * @param int   $procedure_id ID of the procedure.
	 * @param array $args Arguments to update the procedure.
	 * @return bool|int False on failure, the ID of the updated procedure otherwise.
	 */
	public function update_procedure( int $procedure_id, $args = array() ) {
		$update = true;

		$procedure = $this->get_procedure( $procedure_id );
		if ( ! $procedure ) {
			$update = false;
		}

		$args = $this->parse_args( $args, $update );

		return $this->update_item(
			$procedure_id,
			/**
			 * Filter the arguments before adding the procedure.
			 *
			 * @wp-filter lcdr_update_{this->item_name}_args
			 * @param array $args Arguments to update the procedure.
			 * @param \LCDR\DB\Row\Procedure $procedure Procedure.
			 * @param int $procedure_id Procedure ID.
			 * @return array
			 */
			apply_filters(
				lcdr_hook( array( 'update', $this->item_name, 'args' ) ),
				$args,
				$procedure,
				$procedure_id
			)
		);
	}

	/**
	 * Delete procedure
	 *
	 * @param integer $procedure_id Entity ID.
	 * @return bool|int False on failure, the ID of the deleted procedure otherwise.
	 */
	public function delete_procedure( int $procedure_id ) {
		return $this->delete_item(
			/**
			 * Filter the procedure ID before deleting it.
			 *
			 * @wp-filter lcdr_delete_{this->item_name}
			 * @param int $procedure_id Entity ID.
			 * @return int
			 */
			apply_filters(
				lcdr_hook( array( 'delete', $this->item_name ) ),
				$procedure_id
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
	 * @throws \Exception If the procedure doesn't have one of the required fields.
	 */
	protected function parse_args( array $args, $update = false ) {
		if ( ! $update ) {
			if ( ! isset( $args['type'] ) ) {
				throw new \Exception( __( 'The data must have a type.', 'lcdr' ) );
			}
		}

		foreach ( $args as $key => $value ) {
			$args[ $key ] = $this->sanitize_data( $key, $value );
		}
		$args['uuid'] = isset( $args['uuid'] ) ? $args['uuid'] : wp_generate_uuid4();

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
		// todo sanitize data.
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
	 * Add procedure entities
	 *
	 * @param integer $item_id Procedure ID.
	 * @param array   $entities Entities to add.
	 * @return void
	 */
	private function add_procedure_entities( int $item_id, array $entities ) {
		$entities = array_map( 'lcdr_parse_item_id', $entities );
		$entities = array_filter( $entities );
		$entities = array_unique( $entities );
		$entities = array_values( $entities );

		$entities = array_map(
			function ( $entity_id ) use ( $item_id ) {
				return array(
					'procedure_id' => $item_id,
					'entity_id'    => $entity_id,
				);
			},
			$entities
		);

		$procedures_entities = new \LCDR\DB\Query\ProceduresEntities();
		$procedures_entities->add_relationships( $entities );
	}
}
