<?php

/**
 * Core class for the database.
 * 
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

final class Core {
	public $table_names = [ 
		'options' => '\\LCDR\\DB\\Table\\Options',
	];

	protected $tables = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_db();
		$this->install_tables();

		add_action( lcdr_hook( [ 'uninstall' ] ), array( $this, 'uninstall_tables' ) );
	}

	/**
	 * Initialize the database.
	 *
	 * @return void
	 */
	public function init_db() {
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