<?php
/**
 * Functions
 *
 * @since 0.1.0
 * @package @elucidario/pkg-core
 */

/**
 *     __  __                  __
 *    / / / /  ____   ____    / /__   _____
 *   / /_/ /  / __ \ / __ \  / //_/  / ___/
 *  / __  /  / /_/ // /_/ / / ,<    (__  )
 * /_/ /_/   \____/ \____/ /_/|_|  /____/
 */
/**
 * Retorna string para ser utilizada como handle dos hooks action ou filter
 *
 * @param array $names Nomes.
 * @return string
 */
function lcdr_hook( array $names ) {
	$hook = array_merge( array( 'lcdr' ), $names );
	return implode( '_', $hook );
}

/**
 * Função para executar o hook de ativação do plugin
 *
 * @since 0.1.0
 * @return void
 */
function lcdr_activate_plugin_hook() {
	do_action( 'lcdr_activate' );
	flush_rewrite_rules();
}
register_activation_hook( LCDR_FILE, 'lcdr_activate_plugin_hook' );

/**
 * Função para executar o hook de desativação do plugin
 *
 * @since 0.1.0
 * @return void
 */
function lcdr_deactivate_plugin_hook() {
	do_action( 'lcdr_deactivate' );
	flush_rewrite_rules();
}
register_deactivation_hook( LCDR_FILE, 'lcdr_deactivate_plugin_hook' );

/**
 * Função para executar o hook de desinstalação do plugin
 *
 * @since 0.1.0
 * @return void
 */
function lcdr_uninstall_plugin_hook() {
	do_action( 'lcdr_uninstall' );
	flush_rewrite_rules();
}
register_uninstall_hook( LCDR_FILE, 'lcdr_uninstall_plugin_hook' );

/**
 *    __  __   __     _     __
 *   / / / /  / /_   (_)   / /   _____
 *  / / / /  / __/  / /   / /   / ___/
 * / /_/ /  / /_   / /   / /   (__  )
 * \____/   \__/  /_/   /_/   /____/
 */
/**
 * Convert a string from camelCase to snake_case
 *
 * @param string $input Input string.
 * @return string Output string.
 */
function lcdr_camel_to_snake( $input ) {
	return strtolower( preg_replace( '/(?<!^)[A-Z]/', '_$0', $input ) );
}

/**
 * Convert a string from snake_case to camelCase
 *
 * @param string $input Input string.
 * @return string Output string.
 */
function lcdr_snake_to_camel( $input ) {
	return lcfirst( str_replace( ' ', '', ucwords( str_replace( '_', ' ', $input ) ) ) );
}

/**
 * Return a json file
 *
 * @param string $file
 * @return array
 * @since 0.2.0
 */
function lcdr_json_file( $file ) {
	$json = file_get_contents( $file );
	return json_decode( $json, true );
}

/**
 *    ______         __           ___             _____         __
 *   / ____/  ___   / /_         ( _ )           / ___/  ___   / /_
 *  / / __   / _ \ / __/        / __ \/|         \__ \  / _ \ / __/
 * / /_/ /  /  __// /_         / /_/  <         ___/ / /  __// /_
 * \____/   \___/ \__/         \____/\/        /____/  \___/ \__/
 */

/**
 * Return the plugin field names that are stored in json type in the database
 *
 * @return array
 * @since 0.2.0
 */
function lcdr_get_json_properties() {
	return array(
		'identified_by',
		'referred_to_by',
		'equivalent',
		'attributed_by',
		'dimension',
		'digitally_available_via',
		'created_by',
		'contact_point',
		'formed_by',
		'dissolved_by',
		'born',
		'died',
		'timespan',
		'part',
		'produced_by',
		'destroyed_by',
		'removed_by',
	);
}

/**
 * Set lcdr option
 *
 * @param string $option Option name.
 * @param mixed  $value  Option value.
 *
 * @return bool True if option was updated, false otherwise.
 * @since 0.2.0
 */
function lcdr_set_option( $option, $value ) {
	$query = new \LCDR\DB\Query\Options();
	return $query->update_option( $option, $value );
}

/**
 * Get lcdr option
 *
 * @param string $option  Option name.
 * @param mixed  $default Default value.
 *
 * @return mixed Option value.
 * @since 0.2.0
 */
function lcdr_get_option( $option, $default = '' ) {
	$query = new \LCDR\DB\Query\Options();
	return $query->get_option( $option, $default );
}
