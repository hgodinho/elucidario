<?php
/**
 * Option class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

use \BerlinDB\Database\Row;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Entity row class.
 */
abstract class Entity extends Row implements \LCDR\DB\Interfaces\Entity {

	/**
	 * Entity ID.
	 *
	 * @var int
	 */
	public int $id = 0;

	/**
	 * Entity name.
	 *
	 * @var string
	 */
	public string $name = '';

	/**
	 * Entity guid.
	 *
	 * @var string
	 */
	public string $guid = '';

	/**
	 * Entity author.
	 *
	 * @var int
	 */
	public int $author = 0;

	/**
	 * Entity status.
	 *
	 * @var string
	 */
	public string $status = 'publish';

	/**
	 * Entity password.
	 *
	 * @var string
	 */
	public string $password = '';

	/**
	 * Entity created.
	 *
	 * @var string
	 */
	public string $created = '';

	/**
	 * Entity type.
	 *
	 * @var string
	 */
	public string $type = '';

	/**
	 * Entity label.
	 *
	 * @var string
	 */
	public string $label = '';

	/**
	 * Entity identifiers.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $identified_by = null;

	/**
	 * Entity description.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $classified_as = null;

	/**
	 * Entity referred to by.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $referred_to_by = null;

	/**
	 * Entity equivalent.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $equivalent = null;

	/**
	 * Entity representation.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $representation = null;

	/**
	 * Entity member of.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $member_of = null;

	/**
	 * Entity subject of.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $subject_of = null;

	/**
	 * Entity attributed by.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $attributed_by = null;

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Constructor.
	 *
	 * @param mixed $item Item.
	 */
	public function __construct( $item = null ) {
		parent::__construct( $item );

		// properties.
		$this->id       = (int) $this->entity_id;
		$this->type     = (string) $this->type;
		$this->name     = (string) $this->name;
		$this->guid     = (string) $this->guid;
		$this->author   = (int) $this->author;
		$this->status   = (string) $this->status;
		$this->password = (string) $this->password;
		$this->created  = false === $this->created ? 0 : strtotime( $this->created );
		$this->label    = (string) $this->label;
	}

	/**
	 * Get the entity property.
	 *
	 * @param string $property Property.
	 * @return mixed
	 * @throws \Exception If property does not exist.
	 */
	public function get_property( string $property ): mixed {
		if ( ! property_exists( $this, $property ) ) {
			throw new \Exception( __( 'Property does not exist.', 'lcdr' ) );
		}
		if ( in_array( $property, lcdr_get_json_properties() ) ) {
			return json_decode( $this->{$property} );
		}
		return $this->{$property};
	}
}
