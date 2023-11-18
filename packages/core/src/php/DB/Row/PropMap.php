<?php
/**
 * PropMap class.
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
 * PropMap row class.
 */
final class PropMap extends Row {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug, \LCDR\DB\Row\Row;

	/**
	 *                __
	 *    _________  / /_  ______ ___  ____  _____
	 *   / ___/ __ \/ / / / / __ `__ \/ __ \/ ___/
	 *  / /__/ /_/ / / /_/ / / / / / / / / (__  )
	 *  \___/\____/_/\__,_/_/ /_/ /_/_/ /_/____/
	 */
	/**
	 * PropMap ID.
	 *
	 * @var int
	 */
	public int $map_id = 0;

	/**
	 * PropMap ID.
	 *
	 * @var int
	 */
	public int $mapping_id = 0;

	/**
	 * PropMap description.
	 *
	 * @var string
	 */
	public string $description = '';

	/**
	 * PropMap prop_name.
	 *
	 * @var string
	 */
	public string $prop_name = '';

	/**
	 * PropMap entity_type.
	 *
	 * @var string
	 */
	public string $entity_type = '';

	/**
	 * PropMap external_prop_name.
	 *
	 * @var string
	 */
	public string $external_prop_name = '';

	/**
	 * PropMap external_prop_description.
	 *
	 * @var string
	 */
	public string $external_prop_description = '';

	/**
	 * PropMap external_prop_uri.
	 *
	 * @var string
	 */
	public string $external_prop_uri = '';

	/**
	 * PropMap external_prop_type.
	 *
	 * @var string
	 */
	public string $external_prop_type = '';

	/**
	 * PropMap map_value.
	 *
	 * @var mixed
	 */
	public mixed $map_value = '';

	/**
	 * PropMap editable.
	 *
	 * @var bool
	 */
	public bool $editable = true;

	/**
	 * PropMap status.
	 *
	 * @var string
	 */
	public string $status = 'active';

	/**
	 *      _       __                        __
	 *     (_)___  / /____  _________  ____ _/ /
	 *    / / __ \/ __/ _ \/ ___/ __ \/ __ `/ /
	 *   / / / / / /_/  __/ /  / / / / /_/ / /
	 *  /_/_/ /_/\__/\___/_/  /_/ /_/\__,_/_/
	 */


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
		$this->allowed_properties = $this->set_allowed_properties();

		// properties.
		$this->map_id                    = (int) $this->map_id;
		$this->mapping_id                = (int) $this->mapping_id;
		$this->prop_name                 = (string) $this->prop_name;
		$this->description               = (string) $this->description;
		$this->entity_type               = (string) $this->entity_type;
		$this->external_prop_name        = (string) $this->external_prop_name;
		$this->external_prop_description = (string) $this->external_prop_description;
		$this->external_prop_uri         = (string) $this->external_prop_uri;
		$this->external_prop_type        = (string) $this->external_prop_type;
		$this->map_value                 = is_string( $this->map_value ) ? json_decode( $this->map_value ) : $this->map_value;
		$this->editable                  = (bool) $this->editable;
		$this->status                    = (string) $this->status;
	}

	/**
	 * Set allowed properties.
	 *
	 * @return string[]
	 */
	public function set_allowed_properties() {
		return array(
			'map_id',
			'mapping_id',
			'prop_name',
			'description',
			'entity_type',
			'external_prop_name',
			'external_prop_description',
			'external_prop_uri',
			'external_prop_type',
			'map_value',
			'editable',
			'status',
		);
	}
}
