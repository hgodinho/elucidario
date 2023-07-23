<?php

/**
 * ConceptCRUD class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

class Concept {
	protected $table_name = 'concept';
	public function insert() {
		$query = new \LCDR\DB\Query();
		$data = [ 
			'label' => 'Teste',
			'identified_by' => 'Teste',
			'created_at' => date( 'Y-m-d H:i:s' ),
			'updated_at' => date( 'Y-m-d H:i:s' ),
		];
		$result = $query->insert( $this->table_name, $data );
		return $result;
	}
}