<?php
/**
 * Schema Generator
 *
 * @since 0.1.0
 * @package elucidario/pkg-mdorim
 */

namespace Mdorim\Schema;

use AllowDynamicProperties;

/**
 * Schema Generator
 */
#[AllowDynamicProperties ]
abstract class Generator {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \Mdorim\Traits\Debug;

	/**
	 * Schema title.
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Schema description.
	 * 
	 * @var string
	 */
	public $description;

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Constructor
	 */
	public function __construct() {
		$this->init();
	}

	public function get( $property, array $options = null ) {
		if ( ! isset( $this->{$property} ) ) {
			throw new \Exception( sprintf( 'Property %s not found.', $property ) );
		}
		if ( null !== $options ) {
			return $this->merge_options( $this->{$property}, $options );
		}
		return $this->{$property};
	}

	/**
	 * Schema type array
	 *
	 * @param array $item Schema do item que fara parte do array.
	 * @param array $options Opções extras do schema.
	 * @return array
	 */
	public function array_schema( array $item, array $options = null ): array {
		$default = array(
			'type' => 'array',
			'items' => $item,
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema oneOf
	 *
	 * @param array $itens Schema dos itens oneOf.
	 * @param array $options Schema options.
	 * @return array
	 */
	public function one_of_schema( array $itens, array $options = null ): array {
		$default = array(
			'type' => 'array',
			'items' => array(
				'type' => null,
				'oneOf' => $itens,
			),
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema anyOf
	 *
	 * @param array $itens Schema dos itens anyOf.
	 * @param array $options Schema options.
	 * @return array
	 */
	public function any_of_schema( array $itens, array $options = null ): array {
		$default = array(
			'type' => 'array',
			'items' => array(
				'type' => null,
				'anyOf' => $itens,
			),
			'single' => true,
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Object schema
	 *
	 * @param array $properties Object properties.
	 * @param array $options Schema options.
	 * @return array
	 */
	public function object_schema( array $properties, array $options = null ): array {
		$default = array(
			'type' => 'object',
			'properties' => $properties,
			'additionalProperties' => false,
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema de string
	 *
	 * @param array $options opções do schema.
	 * @return array
	 */
	public function string_schema( array $options = null ): array {
		$default = array(
			'type' => 'string',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema de url
	 *
	 * @param array $options opções do schema.
	 * @return array
	 */
	public function uri_schema( array $options = null ): array {
		$default = array(
			'type' => 'string',
			'format' => 'url',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema de data
	 *
	 * @param array $options Schema options.
	 * @return array
	 */
	public function date_schema( array $options = null ): array {
		$default = array(
			'type' => 'string',
			'format' => 'date',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema de hora
	 *
	 * @param array $options Schema options.
	 * @return array
	 */
	public function time_schema( array $options = null ): array {
		$default = array(
			'type' => 'string',
			'format' => 'time',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema de integer
	 *
	 * @param array $options Schema options.
	 * @return array
	 */
	public function integer_schema( array $options = null ): array {
		$default = array(
			'type' => 'integer',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema de number
	 *
	 * @param array $options Schema options.
	 * @return array
	 */
	public function number_schema( array $options = null ): array {
		$default = array(
			'type' => 'number',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Schema booleano
	 *
	 * @param array $options Schema options.
	 * @return array
	 */
	public function boolean_schema( array $options = null ): array {
		$default = array(
			'type' => 'boolean',
		);
		return $this->merge_options( $default, $options );
	}

	/**
	 * Add schemas
	 *
	 * @param array $schemas Schemas.
	 * @return void
	 */
	public function add_schemas( array $schemas ) {
		foreach ( $schemas as $key => $schema ) {
			if ( ! isset( $this->{$key} ) ) {
				$this->{$key} = $schema;
			} else {
				if ( $schema !== $this->{$key} ) {
					$this->{$key} = $this->merge_options( $this->{$key}, $schema );
				}
			}
		}
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
	 * Merge options
	 *
	 * @param array $default Default.
	 * @param array $options Options.
	 * @return array
	 */
	protected function merge_options( $default, $options ): array {
		if ( null !== $options ) {
			return array_merge( $default, $options );
		}
		return $default;
	}

	protected function init() {
		$schema = $this->set_schema();
		$schema = $this->parse_schema( $schema );
		if ( isset( $schema['title'] ) ) {
			$this->title = $schema['title'];
		}
		if ( isset( $schema['description'] ) ) {
			$this->description = $schema['description'];
		}
		foreach ( $schema['properties'] as $name => $value ) {
			$this->{$name} = $value;
		}
	}

	protected function parse_schema( $schema ) {
		if ( ! isset( $schema['type'] ) ) {
			throw new \Exception( 'Schema type not defined.' );
		}
		if ( 'object' !== $schema['type'] ) {
			throw new \Exception( 'Schema type must be object.' );
		}
		if ( ! isset( $schema['properties'] ) ) {
			throw new \Exception( 'Schema properties not defined.' );
		}
		return $schema;
	}

	/**
	 *          __         __                  __ 
	 *   ____ _/ /_  _____/ /__________ ______/ /_
	 *  / __ `/ __ \/ ___/ __/ ___/ __ `/ ___/ __/
	 * / /_/ / /_/ (__  ) /_/ /  / /_/ / /__/ /_  
	 * \__,_/_.___/____/\__/_/   \__,_/\___/\__/
	 */
	abstract public function set_schema();

	abstract public static function get_instance();
}