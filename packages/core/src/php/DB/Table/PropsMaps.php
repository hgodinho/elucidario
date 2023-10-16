<?php
/**
 * PropsMaps class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Table;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * PropsMaps table class.
 */
class PropsMaps extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'props_maps';

	/**
	 * Table schema.
	 */
	protected function set_schema() {
		$this->schema = "
            map_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            mapping_id bigint(20) unsigned NOT NULL,
            description longtext,
            prop_name varchar(50) NOT NULL DEFAULT '',
            entity_type varchar(50) NOT NULL DEFAULT '',
            external_prop_name varchar(100) NOT NULL,
            external_prop_description longtext,
            external_prop_uri varchar(255),
            external_prop_type varchar(20) NOT NULL,
            map_value JSON,
            editable tinyint(1) NOT NULL DEFAULT 1,
            status varchar(20) NOT NULL DEFAULT 'active',
            PRIMARY KEY (map_id),
            KEY mapping_id (mapping_id),
            KEY prop_name (prop_name),
            KEY entity_type (entity_type),
            KEY external_prop_name (external_prop_name),
            KEY status (status)
        ";
	}
}
