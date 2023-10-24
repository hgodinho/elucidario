<?php
/**
 * Procedures class.
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
 * Procedures table class.
 */
final class Procedures extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'procedures';

	/**
	 * Table schema.
	 */
	protected function set_schema() {
		$this->schema = "
            procedure_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            type varchar(64),
            uuid varchar(40) NOT NULL DEFAULT '',
            description longtext,
            author bigint(20) unsigned NOT NULL,
            created datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            modified datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            status varchar(30) NOT NULL DEFAULT 'draft',
            schedule JSON,
            PRIMARY KEY (procedure_id),
            KEY type (type),
            KEY uuid (uuid),
            KEY author (author),
            KEY created (created),
            KEY modified (modified),
            KEY status (status)
        ";
	}
}
