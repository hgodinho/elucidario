<?php
/**
 * Entities class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Rest\Routes\Abstracts;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

abstract class Entities extends Base {
	/**
	 * Set permission group.
	 *
	 * @return string
	 */
	public function set_permission_group() {
		return 'entities';
	}

	/**
	 * Set primary property.
	 *
	 * @return string
	 */
	public function set_primary_property() {
		return 'entity_id';
	}

	/**
	 * Set required properties.
	 *
	 * @return array
	 */
	public function set_required_properties() {
		return array(
			'type',
			'_label',
			'identified_by',
		);
	}

	/**
	 * Prepare item.
	 *
	 * @param array            $args
	 * @param \WP_REST_Request $request
	 * @return object|\LCDR\Error\Error
	 */
	public function prepare_for_db( $args, $request ) {
		$prepared       = new \stdClass();
		$current_status = '';

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
					if ( get_current_user_id() !== $author ) {
						$user_obj = get_userdata( $author );
						if ( ! $user_obj ) {
							return new \LCDR\Error\Rest(
								'invalid_author',
								array( 'status' => 400 )
							);
						}
					}
					$prepared->author = $author;
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
	 *                        __
	 *   ____________  ______/ /
	 *  / ___/ ___/ / / / __  /
	 * / /__/ /  / /_/ / /_/ /
	 * \___/_/   \__,_/\__,_/
	 */
	/**
	 * Retrieves a single entity.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or Error object on failure.
	 */
	public function get_item( $request ) {
		$id = $this->get_id_from_request( $request );
		if ( is_lcdr_error( $id ) ) {
			return $id;
		}
		$entity = $this->get_entity( $id );
		if ( is_lcdr_error( $entity ) ) {
			return $entity;
		}

		$data     = $this->prepare_item_for_response( $entity, $request );
		$response = rest_ensure_response( $data );

		return $response;
	}

	/**
	 * Retrieves a collection of entities.
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

		$query_result = lcdr_get_entities( $query_args );

		// Allow access to all password protected posts if the context is edit.
		if ( 'edit' === $request['context'] ) {
			add_filter( 'post_password_required', array( $this, 'check_password_required' ), 10, 2 );
		}

		$entities = array();

		foreach ( $query_result as $post ) {
			if ( ! $this->check_read_permission( $post ) ) {
				continue;
			}

			$data       = $this->prepare_item_for_response( $post, $request );
			$entities[] = $this->prepare_response_for_collection( $data );
		}

		// Reset filter.
		if ( 'edit' === $request['context'] ) {
			remove_filter( 'post_password_required', array( $this, 'check_password_required' ) );
		}

		$total_entities = (int) lcdr_get_entities( $query_args, true );

		// @todo dev the part of pagination.
		// $page = (int) $query_args['paged'];
		// // $total_posts = $query->found_posts;

		// if ( $total_entities < 1 && $page > 1 ) {
		// Out-of-bounds, run the query again without LIMIT for total count.
		// unset( $query_args['number'] ); // numero da página
		// $total_entities = count( lcdr_get_entities( $query_args, true ) );
		// }

		$max_pages = ceil( $total_entities / (int) $query_args['per_page'] );

		// @todo continue pagination.
		// if ( $page > $max_pages && $total_posts > 0 ) {
		// return new WP_Error(
		// 'rest_post_invalid_page_number',
		// __( 'The page number requested is larger than the number of pages available.' ),
		// array( 'status' => 400 )
		// );
		// }

		$response = rest_ensure_response( $entities );

		$response->header( 'X-WP-Total', (int) $total_entities );
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
		// content-type is wp —> continue.

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

		$prepared_entity = $this->prepare_item_for_database( $request );

		if ( is_lcdr_error( $prepared_entity ) ) {
			return $prepared_entity;
		}

		$entity_id = lcdr_insert_entity( (array) $prepared_entity );
		if ( is_lcdr_error( $entity_id ) ) {

			if ( 'db__insert' === $entity_id->get_error_code() ) {
				$entity_id->add_data( array( 'status' => 500 ) );
			} else {
				$entity_id->add_data( array( 'status' => 400 ) );
			}

			return $entity_id;
		}

		$entity = $this->get_entity( $entity_id );

		/**
		 * Fires before a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $entity   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 */
		$this->rest_insert_hook( $entity, $request, true );

		$entity = $this->get_entity( $entity_id );
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
		$response->header( 'Location', rest_url( implode( '/', array( $this->namespace, $this->rest_base, $entity_id ) ) ) );

		return $response;
	}

	/**
	 * Updates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or Error object on failure.
	 */
	public function update_item( $request ) {
		$content_type = $this->content_negotiation_request( $request );
		if ( is_lcdr_error( $content_type ) ) {
			return $content_type;
		}
		if ( 'la' === $content_type ) {
			return new \LCDR\Error\Rest(
				'update_invalid_content_type',
				array( 'status' => 400 )
			);
		}

		$id = $this->get_id_from_request( $request );

		// Return error if missing required properties.
		$validate_required_properties = $this->validate_required_properties( $request );
		if ( is_lcdr_error( $validate_required_properties ) ) {
			return $validate_required_properties;
		}

		$prepared_entity = $this->prepare_item_for_database( $request );

		$entity = lcdr_update_entity( $id, (array) $prepared_entity );
		if ( is_lcdr_error( $entity ) ) {
			return $entity;
		}

		/**
		 * Fires before a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $entity   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 */
		$this->rest_insert_hook( $entity, $request, false );

		$request->set_param( 'context', 'edit' );

		/**
		 * Fires after a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity $entity   Inserted or updated post object.
		 * @param \WP_REST_Request           $request  Request object.
		 * @param bool                       $creating True when creating a post, false when updating.
		 * @param bool                       $after    True when after creating a post, false when before, default false.
		 */
		$this->rest_insert_hook( $entity, $request, false, true );

		$response = $entity ? $this->prepare_item_for_response( $entity, $request ) : new \WP_REST_Response(
			array(
				'updated' => false,
			)
		);
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( implode( '/', array( $this->namespace, $this->rest_base, $entity ? $entity->{$this->primary_property} : $entity ) ) ) );

		return $response;
	}

	/**
	 * Deletes a single post.
	 *
	 * @since 4.7.0
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$id     = $this->get_id_from_request( $request );
		$entity = $this->get_entity( $id );
		if ( is_lcdr_error( $entity ) ) {
			return $entity;
		}

		$id = $entity->{$this->primary_property};

		// $force = (bool) $request['force'];
		$supports_trash = ( EMPTY_TRASH_DAYS > 0 );

		/**
		 * Filters whether a entity is trashable.
		 *
		 * The dynamic portion of the hook name, `$this->rest_base`, refers to the rest base.
		 *
		 * Pass false to disable Trash support for the entity.
		 *
		 * @param bool                       $supports_trash Whether the post type support trashing.
		 * @param \LCDR\DB\Interfaces\Entity $entity         The Entity object being considered for trashing support.
		 */
		$supports_trash = apply_filters( lcdr_hook( array( 'rest', $this->rest_base, 'trashable' ) ), $supports_trash, $entity );

		if ( ! $this->check_delete_permission( $entity ) ) {
			return new \LCDR\Error\Rest(
				'user_cannot_delete_post',
				array( 'status' => rest_authorization_required_code() )
			);
		}

		$request->set_param( 'context', 'edit' );

		// @todo dev the part of trash
		// If we're forcing, then delete permanently.
		// if ( $force ) {
		// $previous = $this->prepare_item_for_response( $entity, $request );
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
		// if ( 'trash' === $entity->status ) {
		// return new \LCDR\Error\Rest(
		// 'already_trashed',
		// array( 'status' => 410 )
		// );
		// }

		$result = lcdr_delete_entity( $id );
		if ( ! $result ) {
			return new \LCDR\Error\Rest(
				'cannot_delete',
				array( 'status' => 500 )
			);
		}

		$response = new \WP_REST_Response();
		$previous = $this->prepare_item_for_response( $entity, $request );
		$response->set_data(
			array(
				'deleted'  => true,
				'previous' => $previous->get_data(),
			)
		);

		/**
		 * Fires immediately after a single entity is deleted or trashed via the REST API.
		 *
		 * They dynamic portion of the hook name, `$this->rest_base`, refers to the rest base for the entity.
		 *
		 * @param \LCDR\DB\Interfaces\Entity          $entity     The deleted or trashed entity.
		 * @param \WP_REST_Response $response The response data.
		 * @param \WP_REST_Request  $request  The request sent to the API.
		 */
		do_action( lcdr_hook( array( 'rest', 'delete', $this->rest_base ) ), $entity, $response, $request );

		return $response;
	}

	/**
	 * Get entity.
	 *
	 * @param mixed $id Entity ID.
	 * @return \LCDR\Error\Rest|\LCDR\DB\Row\Entity
	 *
	 * @todo transform to abstract method in Base class
	 */
	protected function get_entity( $id ) {
		$error = new \LCDR\Error\Rest(
			'invalid_id',
			array( 'status' => 404 )
		);

		if ( is_lcdr_error( $id ) ) {
			return $id;
		}

		if ( (int) $id <= 0 ) {
			return $error;
		}

		$entity = lcdr_get_entity( (int) $id );

		if ( empty( $entity ) || empty( $entity->{$this->primary_property} ) ) {
			return $error;
		}
		return $entity;
	}
}
