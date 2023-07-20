<?php

/**
 * Query class.
 *
 * @since since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

if ( ! class_exists( 'Query' ) ) {
	class Query {
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
			$this->prefix = $wpdb->prefix . 'lcdr_';
		}

		/**
		 * Insert data.
		 *
		 * @param string $table_name
		 * @param array $data
		 * @return int|false The number of rows inserted, or false on error.
		 */
		public function insert( $table_name, $data ) {
			$table_name = $this->prefix . $table_name;
			$result = $this->wpdb->insert( $table_name, $data );
			return $result;
		}

		/**
		 * Update data.
		 *
		 * @param string $table_name
		 * @param array $data
		 * @param array $where
		 * @return int|false The number of rows updated, or false on error.
		 */
		public function update( $table_name, $data, $where ) {
			$table_name = $this->prefix . $table_name;
			return $this->wpdb->update( $table_name, $data, $where );
		}

		/**
		 * Delete data.
		 *
		 * @param string $table_name
		 * @param array $where
		 * @return int|false The number of rows updated, or false on error.
		 */
		public function delete( $table_name, $where ) {
			$table_name = $this->prefix . $table_name;
			return $this->wpdb->delete( $table_name, $where );
		}

		/**
		 * Select data.
		 *
		 * @param string $table_name
		 * @param array $where
		 * @param array $select
		 * @return array|null|object
		 */
		public function select( $table_name, $where = [], $select = [] ) {
			$table_name = $this->prefix . $table_name;
			$query = "SELECT * FROM $table_name";
			if ( ! empty( $where ) ) {
				$query .= " WHERE ";
				foreach ( $where as $key => $value ) {
					$query .= "$key = '$value' AND ";
				}
				$query = substr( $query, 0, -5 );
			}
			if ( ! empty( $select ) ) {
				$query .= " ORDER BY ";
				foreach ( $select as $key => $value ) {
					$query .= "$key $value, ";
				}
				$query = substr( $query, 0, -2 );
			}
			return $this->wpdb->get_results( $query );
		}
	}
}