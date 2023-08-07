<?php

/**
 * History class.
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

final class Core {
	/**
	 * Events.
	 *
	 * @var \LCDR\Mdorim\History\Event[]
	 */
	public $events = array();

	/**
	 * Constructor.
	 *
	 * @param $data
	 */
	public function __construct( object $data ) {
		$this->events = $data->events;
	}

	/**
	 * Add event.
	 *
	 * @param \LCDR\Mdorim\History\Event[] $events
	 * @return void
	 */
	public function add_event( \LCDR\Mdorim\History\Event $event ) {
		$this->events[] = $event;
	}

	/**
	 * Get events.
	 *
	 * @return \LCDR\Mdorim\History\Event[]
	 */
	public function get_events(): array {
		return $this->events;
	}

	/**
	 * Get event.
	 *
	 * @param integer $event_id
	 * @return \LCDR\Mdorim\History\Event
	 */
	public function get_event( int $event_id ) {
		return array_filter(
			$this->events,
			function ( $event ) use ( $event_id ) {
				return $event->ID === $event_id;
			}
		)[0];
	}

	/**
	 * Remove event.
	 *
	 * @param integer|array $event_id
	 * @return void
	 */
	public function remove_event( int|array $event_id ) {
		$this->events = array_filter(
			$this->events,
			function ( $event ) use ( $event_id ) {
				return ! in_array( $event->ID, (array) $event_id );
			}
		);
	}
}
