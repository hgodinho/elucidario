<?php
/**
 * Entity class.
 *
 * @since since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Abstracts\Mdorim;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

abstract class Entity implements \LCDR\Interfaces\Mdorim\Entity {
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
	 * @var \LCDR\Mdorim\History
	 */
	public $edit_history;

	/**
	 * Constructor.
	 *
	 * @param object|null $data
	 */
	public function __construct( object|null $data ) {
		$this->set_type();

		if ( $data ) {
			$this->set_data( $data );
		}
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

	/**
	 * Set data.
	 * 
	 * @param object $data
	 * @param bool $validate
	 * 
	 * @return void
	 * @throws \Exception
	 */
	public function set_data( object $data, bool $validate = true ) {
		$this->ID = $data->ID;
		$this->set_schema();
		if ( $validate ) {
			$this->schema->set_data( $data );
			$this->ID = $data->ID;
			try {
				$validate = $this->schema->validate();
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
		$this->schema = new \LCDR\Mdorim\Schema( $this->type, $this->data );
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