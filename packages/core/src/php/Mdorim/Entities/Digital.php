<?php

/**
 * Digital class.
 * 
 * DigitalObject entity.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim\Entities;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

final class Digital extends \LCDR\Mdorim\Entities\AbstractEntity {
	/**
	 * The DigitalObject's objects.
	 * 
	 * @var array
	 */
	public function __construct( $digital = null ) {
		parent::__construct( $digital );
	}

	/**
	 * Set the DigitalObject's type.
	 * 
	 * @return void
	 */
	public function set_type() {
		$this->type = 'DigitalObject';
	}
}