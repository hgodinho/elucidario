<?php

/**
 * Schema class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB;

if (!defined('ABSPATH')) exit;

if (!defined('LCDR_PATH')) exit;

if (!class_exists('\LCDR\DB\Schema')) {
    class Schema {
        public $wpdb;

        public $charset = '';

        public $prefix = '';

        /**
         * Construtor.
         */
        public function __construct() {
            global $wpdb;
            $this->wpdb = $wpdb;
            $this->charset = $wpdb->get_charset_collate();
            $this->prefix = $wpdb->prefix;

            add_action(lcdr_hook(['activate']), array($this, 'register_tables'));
            add_action(lcdr_hook(['uninstall']), array($this, 'unregister_tables'));
        }

        /**
         * Register plugin tables.
         *
         * @return void
         */
        public function register_tables() {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
            $lcdr = $this->create_lcdr();
        }

        /**
         * Unregister plugin tables.
         */
        public function unregister_tables() {
            $table_name = $this->prefix . 'lcdr';
            // $this->wpdb->query("DROP TABLE IF EXISTS $table_name");
        }

        /**
         * Create lcdr table.
         * @return boolean True if the table was created, false if it already exists.
         */
        public function create_lcdr() {
            $table_name = $this->prefix . 'lcdr';

            $query = "CREATE TABLE $table_name (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                name varchar(191) NOT NULL DEFAULT '',
                value longtext NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY name (name)
            ) $this->charset;";

            return \maybe_create_table($table_name, $query);
        }
    }
}
