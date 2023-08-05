<?php

/**
 * Event class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim\History;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

final class Event {
	/**
	 * Event ID.
	 *
	 * @var int
	 */
	public $ID;

	/**
	 * Event type.
	 *
	 * @var string
	 */
	public $type;

	/**
	 * Event timestamp.
	 *
	 * @var \datetime
	 */
	public $timestamp;

	/**
	 * Event entity.
	 *
	 * @var int
	 */
	public $entity;

	/**
	 * Event user.
	 *
	 * @var int
	 */
	public $user;

	/**
	 * Property name.
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Another Event to reference (ID).
	 *
	 * @var int
	 */
	public $reference;

	/**
	 * Previous value.
	 *
	 * @var mixed
	 */
	public $previous;

	/**
	 * Current value.
	 *
	 * @var mixed
	 */
	public $current;

	/**
	 * Constructor.
	 *
	 * @param object $data
	 */
	public function __construct( object $data ) {
		foreach ( $data as $key => $value ) {
			$this->$key = $value;
		}
	}
}
