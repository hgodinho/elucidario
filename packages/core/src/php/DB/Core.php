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
	 * Instance.
	 *
	 * @var \LCDR\DB\Core
	 */
	private static $instance = null;

	/**
	 * Table names.
	 *
	 * @var array
	 */
	public static $tables_names = array(
		'options'             => '\\LCDR\\DB\\Table\\Options',
		'entities'            => '\\LCDR\\DB\\Table\\Entities',
		'relationships'       => '\\LCDR\\DB\\Table\\Relationships',
		'procedures'          => '\\LCDR\\DB\\Table\\Procedures',
		'procedures_entities' => '\\LCDR\\DB\\Table\\ProceduresEntities',
		'mappings'            => '\\LCDR\\DB\\Table\\Mappings',
		'props_maps'          => '\\LCDR\\DB\\Table\\PropsMaps',
	);

	/**
	 * Tables.
	 *
	 * @var array
	 */
	protected $tables = array();

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_tables();
		$this->install_tables();

		add_action( lcdr_hook( array( 'uninstall' ) ), array( $this, 'uninstall_tables' ) );
	}

	/**
	 * Get the instance.
	 *
	 * @return \LCDR\DB\Core
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initialize the database.
	 *
	 * @return void
	 */
	public function init_tables() {
		foreach ( $this::$tables_names as $name => $table ) {
			$this->tables[ $name ] = new $table();
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

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */

}
