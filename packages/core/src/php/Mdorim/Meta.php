<?php
/**
 * Meta class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

final class Meta {
	/**
	 * ID.
	 *
	 * @var int
	 */
	public $ID;

	/**
	 * Type.
	 *
	 * @var string
	 */
	public $type;

	/**
	 * URI.
	 *
	 * @var string
	 */
	public $uri;

	/**
	 * Slug.
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * Author ID.
	 *
	 * @var int
	 */
	public $author;

	/**
	 * Status.
	 *
	 * @var string
	 * 
	 */
	public $status;

	/**
	 * Constructor.
	 */
	public function __construct( object $data ) {
		foreach ( $data as $key => $value ) {
			$this->$key = $value;
		}
	}
}