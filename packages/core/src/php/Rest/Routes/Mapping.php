<?php
/**
 * Mapping Rest class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Rest\Routes;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Mapping Rest Class
 */
class Mapping extends \LCDR\Rest\Routes\Abstracts\Base {
	/**
	 * Set base.
	 *
	 * @return string
	 */
	public function set_base() {
		return __( 'mapping', 'lcdr' );
	}

	/**
	 * Set schema.
	 *
	 * @return array
	 */
	public function set_schema() {
		return array(
			'mdorim' => array(
				'view' => array(
					'schema' => 'mdorim/mapping',
				),
				'edit' => array(
					'schema'  => 'mdorim/mapping',
					'options' => array(
						'definitions' => 'MappingPost',
					),
				),
			),
		);
	}

	/**
	 * Set permission group.
	 *
	 * @return string
	 */
	public function set_permission_group() {
		return 'mapping';
	}

	/**
	 * Set primary property.
	 *
	 * @return string
	 */
	public function set_primary_property() {
		return 'mapping_id';
	}

	/**
	 * Set required properties.
	 *
	 * @return array
	 */
	public function set_required_properties() {
		return array();
	}

	/**
	 * Item preparation for database.
	 *
	 * @param array            $args Arguments.
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return \LCDR\Error\Error|object
	 */
	public function prepare_for_db( $args, $request ) {
		$prepared       = new \stdClass();
		$current_status = 'active';

		// Mount prepared object.
		foreach ( $args as $key => $value ) {
			switch ( $key ) {
				// Primary property.
				case $this->primary_property:
					$existing = $this->get_entity( (int) $value );
					if ( is_lcdr_error( $existing ) ) {
						return $existing;
					}
					$prepared->{$this->primary_property} = $existing->{$this->primary_property};
					// @todo status é uma propriedade comum em todas as entidades do modelo?
					$current_status = $existing->status;
					break;

				// Author.
				case 'author':
					$author = (int) $value;
					if ( \get_current_user_id() !== $author ) {
						$user_obj = \get_userdata( $author );
						if ( ! $user_obj ) {
							return new \LCDR\Error\Rest(
								'invalid_author',
								array( 'status' => 400 )
							);
						}
					}
					$prepared->author = $author;
					break;

				case 'standard':
					$standard = (array) $value;
					if ( isset( $standard['name'] ) ) {
						$prepared->standard = $standard['name'];
					}
					if ( isset( $standard['uri'] ) ) {
						$prepared->uri = $standard['uri'];
					}
					break;

				case 'mapping':
					if ( $value && ! is_array( $value ) ) {
						return new \LCDR\Error\Rest(
							'invalid_mapping',
							array( 'status' => 400 )
						);
					}
					$index = 0;
					foreach ( $value as $mapping ) {
						$prepared->mapping[ $index ] = new \stdClass();
						$mapping                     = (array) $mapping;
						foreach ( $mapping as $key => $map_value ) {
							switch ( $key ) {
								case 'external':
									if ( isset( $map_value->name ) ) {
										$prepared->mapping[ $index ]->external_prop_name = $map_value->name;
									}
									if ( isset( $map_value->description ) ) {
										$prepared->mapping[ $index ]->external_prop_description = $map_value->description;
									}
									if ( isset( $map_value->uri ) ) {
										$prepared->mapping[ $index ]->external_prop_uri = $map_value->uri;
									}
									if ( isset( $map_value->type ) ) {
										$prepared->mapping[ $index ]->external_prop_type = $map_value->type;
									}
									break;
								default:
									$prepared->mapping[ $index ]->$key = $map_value;
									break;
							}
						}
						$index++;
					}
					break;

				// Status.
				case 'status':
					// @todo status é uma propriedade comum em todas as entidades do modelo?
					if ( ! $current_status || $current_status !== $value ) {
						$status = $this->handle_status_param( $value );
						if ( is_lcdr_error( $status ) ) {
							return $status;
						}
						$prepared->status = $status;
					}
					break;

				// Default.
				default:
					$prepared->$key = $value;
					break;
			}
		}

		return $prepared;
	}

	/**
	 * Get entity
	 *
	 * @param int $id
	 * @return \LCDR\Error\Error|\LCDR\DB\Interfaces\Entity
	 */
	public function get_entity( $id ) {
		$error = new \LCDR\Error\Rest(
			'invalid_id',
			array( 'status' => 404 )
		);

		if ( (int) $id <= 0 ) {
			return $error;
		}

		$mapping = lcdr_get_mapping( (int) $id );
		if ( empty( $mapping ) || empty( $mapping->{$this->primary_property} ) ) {
			return $error;
		}

		return $mapping;
	}

	/**
	 * Creates a single entity.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or \LCDR\Error\Rest object on failure.
	 */
	public function create_item( $request ) {
		$content_type = $this->content_negotiation_request( $request );
		if ( is_lcdr_error( $content_type ) ) {
			return $content_type;
		}
		if ( 'la' === $content_type ) {
			return new \LCDR\Error\Rest(
				'create_invalid_content_type',
				array( 'status' => 400 )
			);
		}

		// content-type is mdorim — continue.
		if ( ! empty( $request[ $this->primary_property ] ) ) {
			return new \LCDR\Error\Rest(
				'already_exists',
				array( 'status' => 400 )
			);
		}

		// Return error if missing required properties.
		$validate_required_properties = $this->validate_required_properties( $request );
		if ( is_lcdr_error( $validate_required_properties ) ) {
			return $validate_required_properties;
		}

		$prepared_mapping = $this->prepare_item_for_database( $request );

		if ( is_lcdr_error( $prepared_mapping ) ) {
			return $prepared_mapping;
		}

		$mapping_id = lcdr_insert_mapping( (array) $prepared_mapping );

		if ( is_lcdr_error( $mapping_id ) ) {

			if ( 'db__insert' === $mapping_id->get_error_code() ) {
				$mapping_id->add_data( array( 'status' => 500 ) );
			} else {
				$mapping_id->add_data( array( 'status' => 400 ) );
			}

			return $mapping_id;
		}

		$entity = $this->get_entity( $mapping_id );

		/**
		 * Fires before a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $entity   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 */
		$this->rest_insert_hook( $entity, $request, true );

		$entity = $this->get_entity( $mapping_id );
		if ( is_lcdr_error( $entity ) ) {
			return $entity;
		}

		$request->set_param( 'context', 'edit' );

		/**
		 * Fires after a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $entity   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 * @param bool                       $after    True when after creating a post, false when before, default false.
		 */
		$this->rest_insert_hook( $entity, $request, true, true );

		$response = $this->prepare_item_for_response( $entity, $request );
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( implode( '/', array( $this->namespace, $this->rest_base, $mapping_id ) ) ) );

		return $response;
	}

	/**
	 * Prepares a single entity output for response.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $item    Entity object.
	 * @param \WP_REST_Request           $request Request object.
	 * @return \WP_REST_Response         Response object.
	 */
	public function prepare_item_for_response( $item, $request ) {
		// Restores the more descriptive, specific name for use within this method.
		$entity = $item;

		$fields = $this->get_lcdr_fields_for_response( $entity, $request );

		// Base fields for every entity.
		$data = array();

		// $prepared = new \stdClass();
		// $allowed = $entity->get_allowed_properties();
		// // $entity = (array) $entity;

		// foreach ( $allowed as $property ) {
		// switch ( $property ) {
		// case 'standard':
		// $prepared->standard = new \stdClass();
		// $prepared->standard->name = $entity->standard;
		// $prepared->standard->uri = $entity->uri;
		// break;

		// default:
		// $prepared->$property = $entity->$property;
		// break;
		// }
		// }

		foreach ( $fields as $field ) {
			if ( rest_is_field_included( $field, $fields ) ) {
				switch ( $field ) {
					// Standard.
					case 'standard':
						$data['standard']       = new \stdClass();
						$data['standard']->name = $entity->standard;
						$data['standard']->uri  = $entity->uri;
						break;

					// UUID.
					case 'uuid':
						$data[ $field ] = apply_filters( 'get_the_uuid', $entity->uuid, $entity->{$this->primary_property} );
						break;

					// URI>
					case 'uri':
						break;

					// Default.
					default:
						$data[ $field ] = $entity->$field;
						break;
				}
			}
		}

		// @todo do we need a permalink?
		// if ( rest_is_field_included( 'link', $fields ) ) {
		// $data['link'] = get_permalink( $post->ID );
		// }

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';

		$data = $this->add_additional_fields_to_object( $data, $request );
		$data = $this->filter_response_by_context( $data, $context );

		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );

		if ( rest_is_field_included( '_links', $fields ) || rest_is_field_included( '_embedded', $fields ) ) {
			$links = $this->prepare_links( $entity );
			$response->add_links( $links );
		}

		/**
		 * Filters the post data for a REST API response.
		 *
		 * The dynamic portion of the hook name, `$this->rest_base`, refers to the rest_base.
		 *
		 * @param \WP_REST_Response           $response The response object.
		 * @param \LCDR\DB\Interfaces\Entity  $entity     Post object.
		 * @param \WP_REST_Request            $request  Request object.
		 */
		return apply_filters( "rest_prepare_{$this->rest_base}", $response, $entity, $request );
	}
}
