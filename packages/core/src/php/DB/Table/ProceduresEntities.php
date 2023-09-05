<?php
/**
 * ProceduresEntities class.
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
 * ProceduresEntities table class.
 */
final class ProceduresEntities extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'procedures_entities';

	/**
	 * Table schema.
	 */
	protected function set_schema() {
		$this->schema = '
            rel_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            entity_id bigint(20) unsigned NOT NULL,	
            procedure_id varchar(30) NOT NULL,
            rel_order int(11) NOT NULL,
            PRIMARY KEY (rel_id),
            KEY entity_id (entity_id),
            KEY procedure_id (procedure_id),
            KEY rel_order (rel_order)
        ';
	}
}
