<?php
/**
 * Entities class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Entities table class.
 */
class Entities extends Table {
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
            guid varchar(255) NOT NULL DEFAULT '',
            author bigint(20) unsigned NOT NULL DEFAULT '0',
            status varchar(20) NOT NULL DEFAULT 'publish',
            password varchar(255),
            created datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
            type varchar(60) NOT NULL DEFAULT '',
            label varchar(255) NOT NULL DEFAULT '',
            identified_by JSON NOT NULL DEFAULT '0',
            referred_to_by JSON NUT NULL DEFAULT '0',
            equivalent JSON NUT NULL DEFAULT '0',
            attributed_by JSON NUT NULL DEFAULT '0',
            dimension JSON NUT NULL DEFAULT '0',
            format varchar(60),
            digitally_available_via JSON NUT NULL DEFAULT '0',
            created_by JSON NUT NULL DEFAULT '0',
            contact_point JSON NUT NULL DEFAULT '0',
            begin_of_existence JSON NUT NULL DEFAULT '0',
            end_of_existence JSON NUT NULL DEFAULT '0',
            timespan JSON NUT NULL DEFAULT '0',
            part JSON NUT NULL DEFAULT '0',
            produced_by JSON NUT NULL DEFAULT '0',
            destroyed_by JSON NUT NULL DEFAULT '0',
            removed_by JSON NUT NULL DEFAULT '0',
            defined_by varchar(255),
            content varchar(255),
            PRIMARY KEY (id),
            UNIQUE KEY name (name),
            INDEX guid (guid),
            INDEX author (author),
            INDEX status (status)
        ";
	}
}
