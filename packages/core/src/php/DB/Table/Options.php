<?php
/**
 * Option class.
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
 * Option table class.
 */
final class Options extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'options';

	/**
	 * Table schema.
	 */
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
