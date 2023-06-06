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


if (!class_exists('LCDR\DB\Schema')) {
    class Schema {
        public $wpdb;

        public $charset = '';

        public $prefix = '';

        public function __construct() {
            global $wpdb;
            $this->wpdb = $wpdb;
            $this->charset = $wpdb->get_charset_collate();
            $this->prefix = $wpdb->prefix;
        }

        public function create_lcdr() {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';

            $table_name = $this->prefix . 'lcdr';
            $query = "CREATE TABLE $table_name (
                id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                name varchar(64) unsigned NOT NULL,
                value longtext unsigned NOT NULL,
                PRIMARY KEY  (id),
                UNIQUE KEY name (name)
            ) $this->charset;";

            return \maybe_create_table($table_name, $query);
        }
    }
}
