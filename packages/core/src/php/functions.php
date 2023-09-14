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
 * @param string $file File path.
 * @return array
 * @since 0.2.0
 */
function lcdr_json_file( $file ) {
	$json = file_get_contents( $file ); // phpcs:ignore
	return json_decode( $json, true );
}

/**
 * Return parsed item id
 *
 * @param mixed $id Item id.
 * @return \LCDR\Error\Error|int|false
 */
function lcdr_parse_item_id( mixed $id ) {
	if ( is_lcdr_error( $id ) ) {
		return $id;
	}
	return is_numeric( $id ) ? absint( $id ) : false;
}

/**
 * Return slug for entity
 *
 * @param int                     $id     Entity id.
 * @param string                  $label  Label.
 * @param string                  $status Status.
 * @param \LCDR\DB\Query\Entities $entity_query Entities Query instance.
 * @return string
 */
function lcdr_unique_entity_slug( int $id, string $label, string $status, \LCDR\DB\Query\Entities $entity_query = null ): string {
	$slug = sanitize_title( $label );
	if ( in_array( $status, array( 'draft', 'pending', 'auto-draft' ), true ) ) {
		return $slug;
	}
	$query = $entity_query instanceof \LCDR\DB\Query\Entities ? $entity_query : new \LCDR\DB\Query\Entities();
	if ( empty( $id ) ) {
		return $slug;
	}
	$slug = $query->unique_slug( $slug, $id );
	return $slug;
}

/**
 * Return if $thing is an instance of \LCDR\Error
 *
 * @param mixed $thing Thing.
 * @return bool
 */
function is_lcdr_error( $thing ) {
	return is_wp_error( $thing ) && $thing instanceof \LCDR\Error\Base;
}

/**
 * Validate value from schema
 *
 * @param mixed  $value Value.
 * @param string $schema_name Schema name.
 * @param array  $options Options.
 * @return bool|\LCDR\Error\Error
 */
function lcdr_validate_value_from_schema( mixed $value, string $schema_name, ?array $options = array() ) {
	global $lcdr;
	return $lcdr->mdorim->schemas->validate( $schema_name, $value, $options );
}

/**
 *    ______               __
 *   / ____/______  ______/ /
 *  / /   / ___/ / / / __  /
 * / /___/ /  / /_/ / /_/ /
 * \____/_/   \__,_/\__,_/
 */
/**
 * Return entity by id
 *
 * @param int $entity_id Entity id.
 * @return \LCDR\DB\Interfaces\Entity
 */
function lcdr_get_entity( $entity_id ) {
	$query  = new \LCDR\DB\Query\Entities();
	$entity = $query->get_entity( $entity_id );
	return \LCDR\DB\Row\Factory::create( $entity );
}

/**
 * Insert new entity
 *
 * @param array $args Entity args.
 * @return int|\LCDR\Error\DB
 */
function lcdr_insert_entity( $args ) {
	$query     = new \LCDR\DB\Query\Entities();
	$entity_id = $query->add_entity( $args );
	return lcdr_parse_item_id( $entity_id );
}

/**
 * Update entity
 *
 * @param int   $entity_id Entity id.
 * @param array $args Entity args.
 * @return \LCDR\DB\Interfaces\Entity|int|\LCDR\Error\DB
 */
function lcdr_update_entity( $entity_id, $args ) {
	$query   = new \LCDR\DB\Query\Entities();
	$updated = $query->update_entity( $entity_id, $args );
	if ( is_lcdr_error( $updated ) ) {
		return $updated;
	}
	if ( $updated ) {
		return lcdr_get_entity( $entity_id );
	} else {
		return (int) $updated;
	}
}

/**
 * Delete entity
 *
 * @param int $entity_id Entity id.
 * @return bool
 */
function lcdr_delete_entity( $entity_id ) {
	$query   = new \LCDR\DB\Query\Entities();
	$deleted = $query->delete_entity( $entity_id );
	return (bool) $deleted;
}

/**
 * Return entities
 *
 * @param array   $args Query args.
 * @param boolean $count Count.
 * @return array
 */
function lcdr_get_entities( $args, $count = false ) {
	$query = new \LCDR\DB\Query\Entities();
	if ( $count && ! isset( $args['count'] ) ) {
		$args['count'] = true;
		$entities      = $query->get_entities( $args );
		return $entities;
	}
	$entities = $query->get_entities( $args );
	return array_map( '\LCDR\DB\Row\Factory::create', $entities );
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
 * Return the plugin field names that are stored in columns in the database
 *
 * @return array   Array of field names
 * @since 0.2.0
 */
function lcdr_get_internal_properties() {
	return array(
		'entity_id',
		'name',
		'guid',
		'author',
		'status',
		'password',
		'created',
	);
}

/**
 * Return the core plugin field names that are stored in columns in the database
 *
 * @return array  Array of field names
 * @since 0.2.0
 */
function lcdr_get_columns_names() {
	return array_merge(
		lcdr_get_internal_properties(),
		array(
			'type',
			'_label',
		),
		lcdr_get_json_properties(),
	);
}

/**
 * Return the plugin field names that use relationships tables in the database
 *
 * @return array
 * @since 0.2.0
 */
function lcdr_get_relationships_names() {
	return array(
		'classified_as',
		'representation',
		'member_of',
		'subject_of',
		'part_of',
		'conforms_to',
		'access_point',
		'digitally_carries',
		'digitally_shows',
		'used_for',
		'carried_out',
		'residence',
		'took_place_at',
		'caused_by',
		'carried_out_by',
		'used_specific_object',
		'influenced_by',
		'technique',
		'digitally_shown_by',
		'shown_by',
		'about',
		'represents',
		'represents_instance_of_type',
		'made_of',
		'current_owner',
		'current_custodian',
		'current_permanent_custodian',
		'current_location',
		'shows',
		'carries',
		'approximated_by',
		'language',
		'digitally_carried_by',
		'carried_by',
		'refers_to',
		'broader',
	);
}

/**
 * Return the plugin field names that use mixed tables in the database
 *
 * @return array
 */
function lcdr_get_mixed_names() {
	return array(
		'referred_to_by',
	);
}

/**
 * Return the valid plugin properties names
 *
 * @return array
 * @since 0.2.0
 */
function lcdr_get_valid_properties() {
	/* @wp-filter lcdr_valid_properties Filter the valid properties names. */
	return apply_filters(
		lcdr_hook(
			array( 'valid', 'properties' )
		),
		array_merge(
			lcdr_get_columns_names(),
			lcdr_get_relationships_names(),
			lcdr_get_mixed_names(),
		)
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
	return $query->update_option( $option, \wp_json_encode( $value ) );
}

/**
 * Get lcdr option
 *
 * @param string $option  Option name.
 *
 * @return mixed Option value.
 * @since 0.2.0
 */
function lcdr_get_option( $option ) {
	$query = new \LCDR\DB\Query\Options();
	return json_decode( $query->get_option( $option ) );
}
