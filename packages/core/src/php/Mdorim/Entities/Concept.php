<?php

/**
 * Concept Object.
 * 
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim\Entities;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

final class Concept extends \LCDR\Mdorim\Entities\AbstractEntity {
	/**
	 * The Concepts's objects.
	 * 
	 * @var array
	 */
	public function __construct( $concept = null ) {
		parent::__construct( $concept );
	}

	/**
	 * Set the Concept's type.
	 * 
	 * @return void
	 */
	public function set_type() {
		$this->type = 'Concept';
	}
	// /**
	//  * Whether comments are allowed.
	//  *@todo ver necessidade
	//  * @var string
	//  */
	// public $comment_status = 'open';

	// /**
	//  * Whether pings are allowed.
	//  * @todo ver necessidade
	//  * @var string
	//  */
	// public $ping_status = 'open';

	// /**
	//  * The post's password in plain text.
	//  * @todo ver necessidade
	//  * @var string
	//  */
	// public $post_password = '';

	// /**
	//  * The post's slug.
	//  *
	//  * @var string
	//  */
	// public $post_name = '';

	// /**
	//  * URLs queued to be pinged.
	//  * @todo ver necessidade
	//  * @var string
	//  */
	// public $to_ping = '';

	// /**
	//  * URLs that have been pinged.
	//  * @todo ver necessidade
	//  * @var string
	//  */
	// public $pinged = '';

	// /**
	//  * Cached comment count.
	//  *
	//  * A numeric string, for compatibility reasons.
	//  *
	//  * @var string
	//  */
	// public $comment_count = 0;
}