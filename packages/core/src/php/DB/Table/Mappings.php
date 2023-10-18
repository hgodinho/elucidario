<?php
/**
 * Mapping class.
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
 * Mapping table class.
 */
class Mappings extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'mappings';

	/**
	 * Table schema.
	 */
	protected function set_schema() {
		$this->schema = "
            mapping_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL DEFAULT '',
            uuid varchar(40) NOT NULL DEFAULT '',
            title varchar(255) NOT NULL DEFAULT '',
            standard varchar(255) NOT NULL DEFAULT '',
            description longtext,
            uri varchar(255) NOT NULL DEFAULT '',
            author bigint(20) unsigned NOT NULL,
            version varchar(30),
            created datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            modified datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            PRIMARY KEY (mapping_id),
            KEY name (name),
            KEY uuid (uuid),
            KEY title (title),
            KEY standard (standard),
            KEY author (author),
            KEY version (version),
            KEY created (created),
            KEY modified (modified)
        ";
	}
}
