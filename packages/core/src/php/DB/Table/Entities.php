<?php
/**
 * Entities class.
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
 * Entities table class.
 */
final class Entities extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'entities';


	/**
	 * Table schema.
	 */
	protected function set_schema() {
		$this->schema = "
            entity_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL DEFAULT '',
            guid varchar(40) NOT NULL DEFAULT '',
            author bigint(20) unsigned NOT NULL DEFAULT '0',
            status varchar(20) NOT NULL DEFAULT 'publish',
            password varchar(255),
            created datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            modified datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            type varchar(60) NOT NULL DEFAULT '',
            label varchar(255) NOT NULL DEFAULT '',
            identified_by JSON NOT NULL,
            referred_to_by JSON,
            equivalent JSON,
            attributed_by JSON,
            dimension JSON,
            format varchar(60),
            digitally_available_via JSON,
            created_by JSON,
            contact_point JSON,
            begin_of_existence JSON,
            end_of_existence JSON,
            timespan JSON,
            part JSON,
            produced_by JSON,
            destroyed_by JSON,
            removed_by JSON,
            defined_by varchar(255),
            content varchar(255),
            PRIMARY KEY  (entity_id),
            KEY name (name),
            UNIQUE KEY guid (guid),
            KEY author (author),
            KEY label (label),
            KEY status (status),
            KEY created (created),
            KEY modified (modified)
        ";
	}
}
