<?php
/**
 * Entity class.
 *
 * @since since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Abstracts\Model;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

abstract class Entity implements \LCDR\Interfaces\Model\Entity {
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
	 * Entity data.
	 * 
	 * @var object|null
	 */
	public $data = null;

	/**
	 * Entity schema.
	 * 
	 * @var object|null
	 */
	public $schema = null;

	/**
	 * Entity meta.
	 * 
	 * @var \LCDR\Model\Classes\Meta
	 */
	public $meta;

	/**
	 * Entity edit history.
	 * 
	 * @var \LCDR\Model\Classes\EditHistory
	 */
	public $edit_history;

	/**
	 * Construtor.
	 *
	 * @param object $schema
	 * @param object $data
	 */
	public function __construct( object $schema, object $data ) {
		$this->ID = $data->ID;
		$this->set_type();
		$this->schema = $schema;
		$this->set_data( $data );
	}

	/**
	 * Get property.
	 *
	 * @param string $property
	 * @return mixed
	 * @throws \Exception
	 */
	public function get( $propertyName ): mixed {
		if ( property_exists( $this->data, $propertyName ) ) {
			return $this->data->$propertyName;
		} else {
			throw new \Exception( "Property '$propertyName' does not exist in the class " . get_class( $this ) );
		}
	}

	public function set_data( object $data ) {
		$this->data = $data;
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
	 * Get entity schema.
	 * 
	 * @return object
	 */
	public function get_schema(): object {
		return $this->schema;
	}

	/**
	 * Set entity type.
	 * 
	 * @return void
	 */
	abstract public function set_type();
}