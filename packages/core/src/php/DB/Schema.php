<?php
/**
 * Schema class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

if ( ! class_exists( '\LCDR\DB\Schema' ) ) {
	class Schema {
		protected $wpdb;

		public $charset = '';

		public $prefix = '';

		/**
		 * Constructor.
		 */
		public function __construct() {
			global $wpdb;
			$this->wpdb = $wpdb;
			$this->charset = $wpdb->get_charset_collate();
			$this->prefix = $wpdb->prefix . 'lcdr_';

			add_action( lcdr_hook( [ 'activate' ] ), array( $this, 'register_tables' ) );
			add_action( lcdr_hook( [ 'uninstall' ] ), array( $this, 'unregister_tables' ) );
		}

		/**
		 * Register plugin tables.
		 *
		 * @return void
		 */
		public function register_tables() {
			$lcdr = $this->create_options();
			$concepts = $this->create_concepts();
			$concept_concept = $this->create_concept_concept();
		}

		/**
		 * Unregister plugin tables.
		 */
		public function unregister_tables() {
			$tables = [ 
				$this->prefix . 'options',
				$this->prefix . 'concepts',
				$this->prefix . 'concept_concept',
			];
			return array_map( function ($table) {
				return $this->wpdb->query( "DROP TABLE IF EXISTS $table" );
			}, $tables );
		}

		/**
		 * Include upgrade.php if exists.
		 *
		 * @return void
		 */
		public function maybe_include_upgrade() {
			if ( file_exists( ABSPATH . 'wp-admin/includes/upgrade.php' ) ) {
				require_once ABSPATH . 'wp-admin/includes/upgrade.php';
			}
		}

		/**
		 * Create concepts table.
		 *
		 * @return boolean True if the table was created, false if it already exists.
		 */
		public function create_concepts() {
			$this->maybe_include_upgrade();
			$table_name = $this->prefix . 'concepts';

			$query = "CREATE TABLE {$table_name} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                name varchar(200) NOT NULL DEFAULT '',
                label varchar(256) NOT NULL DEFAULT '',
                identified_by JSON,
                referred_to_by JSON,
                equivalent JSON,
                attributed_by JSON,
                PRIMARY KEY  (id)
            ) {$this->charset};";

			return \maybe_create_table( $table_name, $query );
		}

		/**
		 * Create concept_concept table.
		 *
		 * @return boolean True if the table was created, false if it already exists.
		 */
		public function create_concept_concept() {
			$this->maybe_include_upgrade();
			$table_name = $this->prefix . 'concept_concept';
			$query = $this->relationship_query( $table_name, 'concept_a', 'concept_b', 'concept', 'concept' );
			return \maybe_create_table( $table_name, $query );
		}

		/**
		 * Create lcdr_options table.
		 * @return boolean True if the table was created, false if it already exists.
		 */
		public function create_options() {
			$this->maybe_include_upgrade();
			$table_name = $this->prefix . 'options';

			$query = "CREATE TABLE {$table_name} (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                name varchar(191) NOT NULL DEFAULT '',
                value longtext NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY name (name)
            ) {$this->charset};";

			return \maybe_create_table( $table_name, $query );
		}

		/**
		 * Create relationship table query.
		 *
		 * @param string $table_name
		 * @param string $entity_a
		 * @param string $entity_b
		 * @return string
		 */
		public function relationship_query( $table_name, $entity_a, $entity_b, $ref_a, $ref_b ) {
			$query = "CREATE TABLE {$table_name} (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                %i bigint(20) unsigned NOT NULL,
                %i bigint(20) unsigned NOT NULL,
                `prop_name` varchar(64) NOT NULL DEFAULT '',
                `from_relation` varchar(64) NOT NULL DEFAULT '',
                PRIMARY KEY  (`id`)
            ) {$this->charset};";

			return $this->wpdb->prepare( $query, $entity_a, $entity_b );
		}

		/**
		 * Get wpdb.
		 *
		 * @return \wpdb
		 */
		public function get_wpdb() {
			return $this->wpdb;
		}
	}
}