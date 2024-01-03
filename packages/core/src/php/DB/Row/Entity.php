<?php
/**
 * Entity class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Row;

use \BerlinDB\Database\Row;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Entity row class.
 */
class Entity extends Row implements \LCDR\DB\Interfaces\Entity {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug;
	use \LCDR\DB\Row\Row;

	/**
	 *                __
	 *    _________  / /_  ______ ___  ____  _____
	 *   / ___/ __ \/ / / / / __ `__ \/ __ \/ ___/
	 *  / /__/ /_/ / / /_/ / / / / / / / / (__  )
	 *  \___/\____/_/\__,_/_/ /_/ /_/_/ /_/____/
	 */
	/**
	 * Entity ID.
	 *
	 * @var int
	 */
	public int $entity_id = 0;

	/**
	 * Entity name.
	 *
	 * @var string
	 */
	public string $name = '';

	/**
	 * Entity uuid.
	 *
	 * @var string
	 */
	public string $uuid = '';

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
	public string $_label = ''; // phpcs:ignore

	/**
	 * Entity identifiers.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $identified_by = null;

	/**
	 * Entity equivalent.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $equivalent = null;

	/**
	 * Entity attributed by.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $attributed_by = null;

	/**
	 *               __      __  _
	 *    ________  / /___ _/ /_(_)___  ____  _____
	 *   / ___/ _ \/ / __ `/ __/ / __ \/ __ \/ ___/
	 *  / /  /  __/ / /_/ / /_/ / /_/ / / / (__  )
	 * /_/   \___/_/\__,_/\__/_/\____/_/ /_/____/
	 */
	/**
	 * Entity referred to by.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $referred_to_by = null;

	/**
	 * Entity description.
	 *
	 * JSON encoded.
	 *
	 * @var mixed
	 */
	public mixed $classified_as = null;

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
	 *      _       __                        __
	 *     (_)___  / /____  _________  ____ _/ /
	 *    / / __ \/ __/ _ \/ ___/ __ \/ __ `/ /
	 *   / / / / / /_/  __/ /  / / / / /_/ / /
	 *  /_/_/ /_/\__/\___/_/  /_/ /_/\__,_/_/
	 */
	/**
	 * Entity relationships.
	 *
	 * @var \LCDR\DB\Interfaces\Relationship[]
	 */
	private array $relationships;

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
		parent::__construct( $this->trim_keys( $item ) );

		$this->allowed_properties = $this->set_allowed_properties();

		// properties.
		$this->entity_id = (int) $this->entity_id;
		$this->type      = (string) $this->type;
		$this->name      = (string) $this->name;
		$this->uuid      = (string) $this->uuid;
		$this->author    = (int) $this->author;
		$this->status    = (string) $this->status;
		$this->password  = (string) $this->password;
		$this->created   = false === $this->created ? 0 : wp_date( get_option( 'date_format' ), $this->created );
		$this->modified  = false === $this->modified ? 0 : wp_date( get_option( 'date_format' ), $this->created );
		$this->_label = (string) $this->label; // phpcs:ignore

		$this->init_relationships();
		$this->init_mixed();
	}


	/**
	 * Get the entity relationships.
	 *
	 * @return array
	 */
	public function get_relationships(): array {
		return $this->relationships;
	}

	/**
	 * Set the entity allowed properties.
	 *
	 * @return array|\LCDR\Error\Error
	 */
	public function set_allowed_properties() {
		return new \LCDR\Error\DB( 'not_implemented' );
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
	 * Initialize relationships.
	 *
	 * @return void
	 */
	protected function init_relationships() {
		$query               = new \LCDR\DB\Query\Relationships(
			array(
				'fields'   => 'ids',
				'order_by' => 'rel_order',
			)
		);
		$this->relationships = $query->get_relationships_by_entity_id( $this->entity_id );
		$allowed             = $this->allowed_properties ?? array();
		$relationships       = array_merge(
			lcdr_get_relationships_names(),
		);
		foreach ( $allowed as $property ) {
			if ( in_array( $property, $relationships, true ) ) {
				$property          = trim( $property );
				$this->{$property} = $this->get_relationships_by_predicate( $property );
			}
		}
	}

	/**
	 * Initialize mixed properties.
	 *
	 * @return void
	 */
	protected function init_mixed() {
		foreach ( lcdr_get_mixed_names() as $mixed ) {
			${$mixed}       = $this->{$mixed} ? json_decode( $this->{$mixed} ) : null;
			$init           = array_merge(
				array(),
				${$mixed} ?? array(),
				$this->get_relationships_by_predicate( $mixed ) ?? array()
			);
			$this->{$mixed} = $init;
		}
	}

	/**
	 * Get relationships by predicate.
	 *
	 * @param string $predicate Predicate.
	 * @return array
	 */
	protected function get_relationships_by_predicate( string $predicate ) {
		$relationships = \wp_list_filter( $this->relationships, array( 'predicate' => $predicate ) );

		return array_values(
			array_map(
				function ( $relationship ) {
					$relationship = $this->parse_relationship_ids( $relationship );
					if ( $relationship->subject === $this->entity_id ) {
						return $relationship->object;
					}
					return $relationship->subject;
				},
				$relationships
			)
		);
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
	 * Parse relationship ids.
	 *
	 * @param mixed $relationship Relationship.
	 * @return object
	 */
	private function parse_relationship_ids( $relationship ) {
		if ( is_object( $relationship ) ) {
			$relationship = (array) $relationship;
		}
		if ( is_array( $relationship ) ) {
			$relationship = array_map(
				function ( $item ) {
					return lcdr_parse_item_id( $item );
				},
				$relationship
			);
		} else {
			$relationship = lcdr_parse_item_id( $relationship );
		}
		return (object) $relationship;
	}

	/**
	 * Trim $item keys.
	 *
	 * @param array|\LCDR\DB\Interfaces\Entity $item Item.
	 * @return array
	 */
	private function trim_keys( $item ) {
		if ( ! is_array( $item ) ) {
			$item = (array) $item;
		}
		$new_array = array();
		foreach ( $item as $key => $value ) {
			$new_array[ trim( $key ) ] = $value;
		}
		return $new_array;
	}
}
