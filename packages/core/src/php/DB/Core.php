<?php
/**
 * Core class for the database.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Core DB Class
 *
 * Controls all the database tables.
 */
final class Core {
	/**
	 * Table names.
	 *
	 * @var array
	 */
	public $table_names = array(
		'options'             => '\\LCDR\\DB\\Table\\Options',
		'entities'            => '\\LCDR\\DB\\Table\\Entities',
		'relationships'       => '\\LCDR\\DB\\Table\\Relationships',
		'procedures'          => '\\LCDR\\DB\\Table\\Procedures',
		'procedures_entities' => '\\LCDR\\DB\\Table\\ProceduresEntities',
	);

	/**
	 * Tables.
	 *
	 * @var array
	 */
	protected $tables = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_tables();
		$this->install_tables();

		add_action( lcdr_hook( array( 'uninstall' ) ), array( $this, 'uninstall_tables' ) );
	}

	/**
	 * Initialize the database.
	 *
	 * @return void
	 */
	public function init_tables() {
		foreach ( $this->table_names as $table_name => $table ) {
			$this->tables[ $table_name ] = new $table();
		}
	}

	/**
	 * Install the database tables.
	 *
	 * @return void
	 */
	public function install_tables() {
		foreach ( $this->tables as $table ) {
			if ( ! $table->exists() ) {
				$table->install();
			}
		}
	}

	/**
	 * Uninstall the database tables.
	 *
	 * @return void
	 */
	public function uninstall_tables() {
		foreach ( $this->tables as $table ) {
			if ( $table->exists() ) {
				$table->uninstall();
			}
		}
	}
}
