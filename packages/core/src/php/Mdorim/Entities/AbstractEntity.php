<?php
/**
 * Entity class.
 *
 * @since since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim\Entities;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

abstract class AbstractEntity implements \LCDR\Mdorim\Entities\EntityInterface {
	/**
	 * Entity ID.
	 * 
	 * @var int
	 */
	public $ID;

	/**
	 * Entity type.
	 * 
	 * @var string
	 */
	public $type;

	/**
	 * Entity schema.
	 * 
	 * @var \LCDR\Mdorim\Schema
	 */
	public $schema;

	/**
	 * Entity data.
	 * 
	 * @var object|null
	 */
	public $data = null;

	/**
	 * Entity meta.
	 * 
	 * @var \LCDR\Mdorim\Meta
	 */
	public $meta;

	/**
	 * Entity edit history.
	 * 
	 * @var \LCDR\Mdorim\History\Core
	 */
	public $history;

	/**
	 * Constructor.
	 *
	 * @param object|null $data
	 */
	public function __construct( object|null $data ) {
		$this->set_type();

		if ( $data ) {
			$this->set_data( $data );
			$this->set_meta( $data );
			$this->set_history( $data );
		}
	}

	/**
	 * Get property.
	 *
	 * @param string $property
	 * @return mixed
	 * 
	 * @todo test
	 * 
	 * @throws \Exception
	 */
	public function get( $property ): mixed {
		if ( property_exists( $this->data, $property ) ) {
			return $this->data->$property;
		} else {
			throw new \Exception( "Property '$property' does not exist in the class " . get_class( $this ) );
		}
	}

	/**
	 * Set data.
	 * 
	 * @param object $data
	 * @param bool $validate
	 * 
	 * @todo test
	 * 
	 * @return void
	 * @throws \Exception
	 */
	public function set_data( object $data, bool $validate = true ) {
		$this->ID = $data->ID;
		$this->set_schema();
		if ( $validate ) {
			$this->ID = $data->ID;
			try {
				$validate = $this->schema->validate( 'schema', $this->data );
			} catch (\Exception $e) {
				throw new \Exception( $e->getMessage() );
			}
		} else {
			$this->data = $data;
		}
	}

	/**
	 * Get entity data.
	 * 
	 * @return object
	 */
	public function get_data(): object {
		return $this->data;
	}

	/**
	 * Set entity schema.
	 * 
	 * @return void
	 */
	public function set_schema() {
		global $lcdr;
		$this->schema = $lcdr->schema;
	}

	/**
	 * Get entity schema.
	 * 
	 * @return object
	 */
	public function get_schema(): object {
		return $this->schema;
	}

	/**
	 * Set meta.
	 * 
	 * @param object $data
	 */
	public function set_meta( object $data ) {
		$this->meta = new \LCDR\Mdorim\Meta( $data->meta );
	}

	/**
	 * Get meta.
	 * 
	 * @return \LCDR\Mdorim\Meta
	 */
	public function get_meta(): \LCDR\Mdorim\Meta {
		return $this->meta;
	}

	/**
	 * Set history.
	 * 
	 * @param object $data
	 */
	public function set_history( object $data ) {
		$this->history = new \LCDR\Mdorim\History\Core( $data->history );
	}

	/**
	 * Get history.
	 * 
	 * @return \LCDR\Mdorim\History\Core
	 */
	public function get_history(): \LCDR\Mdorim\History\Core {
		return $this->history;
	}

	/**
	 * Set entity type.
	 * 
	 * @return void
	 */
	abstract public function set_type();
}