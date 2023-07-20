<?php

/**
 * Concept Object.
 * 
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Model\Entities;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

final class Concept extends \LCDR\Abstracts\Model\Entity {
	/**
	 * The Concepts's attribution
	 *
	 * @var array
	 */
	public $attributed_by = [];

	/**
	 * The Concepts's representations.
	 *
	 * @var array
	 */
	public $representation = [];

	/**
	 * The Concepts's parts.
	 *
	 * @var array
	 */
	public $part_of = [];

	/**
	 * The Concepts's Sets.
	 *
	 * @var array
	 */
	public $member_of = [];

	/**
	 * The Concepts's subjects.
	 *
	 * @var array
	 */
	public $subject_of = [];

	/**
	 * The post's status.
	 * @var string
	 */
	public $post_status = 'publish';

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