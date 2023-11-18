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
	 * @param int $id Entity ID.
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
	 * Retrieves a single mapping.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or Error object on failure.
	 */
	public function get_item( $request ) {
		$id = $this->get_id_from_request( $request );
		if ( is_lcdr_error( $id ) ) {
			return $id;
		}
		$mapping = $this->get_entity( $id );
		if ( is_lcdr_error( $mapping ) ) {
			return $mapping;
		}

		$data     = $this->prepare_item_for_response( $mapping, $request );
		$response = rest_ensure_response( $data );

		return $response;
	}

	/**
	 * Retrieves a collection of mappings.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {

		$validate_required_properties = $this->validate_required_properties( $request );
		if ( is_lcdr_error( $validate_required_properties ) ) {
			return $validate_required_properties;
		}

		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();
		$args       = array();

		/**
		 * Filters Query arguments when querying entities via the REST API.
		 *
		 * The dynamic portion of the hook name, `$this->rest_base`, refers to the rest base.
		 *
		 * @link https://developer.wordpress.org/reference/classes/wp_query/
		 *
		 * @param array            $args    Array of arguments for WP_Query.
		 * @param \WP_REST_Request $request The REST API request.
		 */
		$args       = apply_filters( lcdr_hook( array( 'rest', $this->rest_base, 'query' ) ), $args, $request );
		$query_args = $this->prepare_items_query( $args, $request );

		$query_result = lcdr_get_mappings( $query_args );

		// Allow access to all password protected posts if the context is edit.
		if ( 'edit' === $request['context'] ) {
			add_filter( 'post_password_required', array( $this, 'check_password_required' ), 10, 2 );
		}

		$mappings = array();

		foreach ( $query_result as $post ) {
			if ( ! $this->check_read_permission( $post ) ) {
				continue;
			}

			$data       = $this->prepare_item_for_response( $post, $request );
			$mappings[] = $this->prepare_response_for_collection( $data );
		}

		// Reset filter.
		if ( 'edit' === $request['context'] ) {
			remove_filter( 'post_password_required', array( $this, 'check_password_required' ) );
		}

		$total_mappings = (int) lcdr_get_mappings( $query_args, true );

		// @todo dev the part of pagination.
		// $page = (int) $query_args['paged'];
		// // $total_posts = $query->found_posts;

		// if ( $total_mappings < 1 && $page > 1 ) {
		// Out-of-bounds, run the query again without LIMIT for total count.
		// unset( $query_args['number'] ); // numero da página
		// $total_mappings = count( lcdr_get_mappings( $query_args, true ) );
		// }

		$max_pages = ceil( $total_mappings / (int) $query_args['per_page'] );

		// @todo continue pagination.
		// if ( $page > $max_pages && $total_posts > 0 ) {
		// return new WP_Error(
		// 'rest_post_invalid_page_number',
		// __( 'The page number requested is larger than the number of pages available.' ),
		// array( 'status' => 400 )
		// );
		// }

		$response = rest_ensure_response( $mappings );

		$response->header( 'X-WP-Total', (int) $total_mappings );
		$response->header( 'X-WP-TotalPages', (int) $max_pages );

		// @todo continue pagination.
		// $request_params = $request->get_query_params();
		// $collection_url = rest_url( rest_get_route_for_post_type_items( $this->post_type ) );
		// $base = add_query_arg( urlencode_deep( $request_params ), $collection_url );

		// if ( $page > 1 ) {
		// $prev_page = $page - 1;

		// if ( $prev_page > $max_pages ) {
		// $prev_page = $max_pages;
		// }

		// $prev_link = add_query_arg( 'page', $prev_page, $base );
		// $response->link_header( 'prev', $prev_link );
		// }
		// if ( $max_pages > $page ) {
		// $next_page = $page + 1;
		// $next_link = add_query_arg( 'page', $next_page, $base );

		// $response->link_header( 'next', $next_link );
		// }

		return $response;
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
	 * Updates a single mapping.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or \LCDR\Error\Rest object on failure.
	 */
	public function update_item( $request ) {
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

		$id = $this->get_id_from_request( $request );

		// Return error if missing required properties.
		$validate_required_properties = $this->validate_required_properties( $request );
		if ( is_lcdr_error( $validate_required_properties ) ) {
			return $validate_required_properties;
		}

		$prepared = $this->prepare_item_for_database( $request );

		$mapping = lcdr_update_mapping( $id, (array) $prepared );
		if ( is_lcdr_error( $mapping ) ) {
			return $mapping;
		}

		/**
		 * Fires before a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $mapping   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 */
		$this->rest_insert_hook( $mapping, $request, false );

		$request->set_param( 'context', 'edit' );

		/**
		 * Fires after a single mapping is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $mapping   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 * @param bool                       $after    True when after creating a post, false when before, default false.
		 */
		$this->rest_insert_hook( $mapping, $request, false, true );

		$response = $mapping ?
			$this->prepare_item_for_response( $mapping, $request ) :
			new \WP_REST_Response(
				array(
					'updated' => false,
				)
			);
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( implode( '/', array( $this->namespace, $this->rest_base, $mapping ? $mapping->{$this->primary_property} : $mapping ) ) ) );

		return $response;
	}


	/**
	 * Deletes a single entity.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$id      = $this->get_id_from_request( $request );
		$mapping = $this->get_entity( $id );
		if ( is_lcdr_error( $mapping ) ) {
			return $mapping;
		}

		// $force = (bool) $request['force'];
		$supports_trash = ( EMPTY_TRASH_DAYS > 0 );

		/**
		 * Filters whether a mapping is trashable.
		 *
		 * The dynamic portion of the hook name, `$this->rest_base`, refers to the rest base.
		 *
		 * Pass false to disable Trash support for the mapping.
		 *
		 * @param bool                       $supports_trash Whether the post type support trashing.
		 * @param \LCDR\DB\Interfaces\Entity $mapping         The Entity object being considered for trashing support.
		 */
		$supports_trash = apply_filters( lcdr_hook( array( 'rest', $this->rest_base, 'trashable' ) ), $supports_trash, $mapping );

		if ( ! $this->check_delete_permission( $mapping ) ) {
			return new \LCDR\Error\Rest(
				'user_cannot_delete_post',
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$request->set_param( 'context', 'edit' );

		// @todo dev the part of trash
		// If we're forcing, then delete permanently.
		// if ( $force ) {
		// $previous = $this->prepare_item_for_response( $mapping, $request );
		// $result = wp_delete_post( $id, true );
		// $response = new \WP_REST_Response();
		// $response->set_data(
		// array(
		// 'deleted' => true,
		// 'previous' => $previous->get_data(),
		// )
		// );
		// } else {

		// If we don't support trashing for this type, error out.
		// if ( ! $supports_trash ) {
		// return new \LCDR\Error\Rest(
		// 'trash_not_supported',
		// array( 'status' => 501 )
		// );
		// }

		// // Otherwise, only trash if we haven't already.
		// if ( 'trash' === $mapping->status ) {
		// return new \LCDR\Error\Rest(
		// 'already_trashed',
		// array( 'status' => 410 )
		// );
		// }

		$result = lcdr_delete_mapping( $id );
		if ( ! $result ) {
			return new \LCDR\Error\Rest(
				'cannot_delete',
				array( 'status' => 500 )
			);
		}

		$response = new \WP_REST_Response();
		$previous = $this->prepare_item_for_response( $mapping, $request );
		$response->set_data(
			array(
				'deleted'  => true,
				'previous' => $previous->get_data(),
			)
		);

		/**
		 * Fires immediately after a single mapping is deleted or trashed via the REST API.
		 *
		 * They dynamic portion of the hook name, `$this->rest_base`, refers to the rest base for the mapping.
		 *
		 * @param \LCDR\DB\Interfaces\Entity          $mapping     The deleted or trashed mapping.
		 * @param \WP_REST_Response $response The response data.
		 * @param \WP_REST_Request  $request  The request sent to the API.
		 */
		do_action( lcdr_hook( array( 'rest', 'delete', $this->rest_base ) ), $mapping, $response, $request );

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
