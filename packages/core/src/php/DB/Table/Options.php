<?php

/**
 * Option class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Table;

use \BerlinDB\Database\Table;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

class Options extends Table {
	protected $name = 'options';

	protected $db_version_key = 'lcdr_db_version';

	protected $db_version = '1.0.0';

	protected $prefix = 'lcdr';

	protected function set_schema() {
		$this->schema = "
            id    bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name  varchar(127) NOT NULL DEFAULT '',
            value json NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY name (name)
        ";
	}
}