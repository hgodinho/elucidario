<?php
/**
 * Base Rest class.
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
 * Base Rest Class
 */
abstract class Base extends \WP_REST_Controller {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\debug;

	/**
	 * Namespace.
	 *
	 * @var string
	 */
	public $namespace = 'lcdr/v1';

	/**
	 * Routes.
	 *
	 * @var array
	 */
	public $routes = array();

	/**
	 * Rest base.
	 *
	 * @var string
	 */
	public $rest_base = '';

	/**
	 * Permission group.
	 *
	 * @var string
	 */
	public $permission_group = '';

	/**
	 * Schema name.
	 *
	 * @var string
	 */
	public $schema_name = '';

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
		$this->schema_name      = $this->set_schema();
		$this->permission_group = $this->set_permission_group();
		$this->routes           = $this->set_routes();
		$this->rest_base        = $this->set_base();
		$this->register_routes();
	}

	/**
	 * Register routes.
	 *
	 * @return boolean[]
	 */
	public function register_routes() {
		$registered = array();
		foreach ( $this->routes as $route => $endpoints ) {
			$registered[] = register_rest_route( $this->namespace, "/{$this->rest_base}{$route}", $endpoints );
		}
		return $registered;
	}

	/**
	 * Set routes.
	 *
	 * @return array
	 */
	public function set_routes() {
		return array(
			'/'              => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => array(),
				),
				// 'schema' => array( $this, 'get_public_item_schema' ), // @todo do we need this?
			),
			'/(?P<id>[\d]+)' => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
				),
				// 'schema' => array( $this, 'get_public_item_schema' ), // @todo do we need this?
			),
		);
	}

	/**
	 * Get route.
	 *
	 * @param int     $id Entity ID.
	 * @param boolean $collection If is collection.
	 * @return string
	 */
	public function get_route( $id, $collection = false ) {
		if ( $collection ) {
			return implode( '/', array( $this->namespace, $this->rest_base ) );
		} else {
			return implode( '/', array( $this->namespace, $this->rest_base, $id ) );
		}
	}

	/**
	 * Validate header.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return string|\LCDR\Error\Rest
	 */
	public function content_negotiation_request( $request ) {
		$type = $request->get_header( 'accept' );

		if ( ! $type ) {
			return 'wp';
		}

		$type = $this->parse_linked_art_content_type( $type );

		if ( is_lcdr_error( $type ) ) {
			return $type;
		}

		if ( 'la' === $type ) {
			return $type;
		}

		return 'wp';
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
		$id     = $this->get_id_from_route( $request );
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

		// content-type is wp — continue.
		if ( ! empty( $request['entity_id'] ) ) {
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

		$id = $this->get_id_from_route( $request );

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
		$response->header( 'Location', rest_url( implode( '/', array( $this->namespace, $this->rest_base, $entity ? $entity->entity_id : $entity ) ) ) );

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
		$id     = $this->get_id_from_route( $request );
		$entity = $this->get_entity( $id );
		if ( is_lcdr_error( $entity ) ) {
			return $entity;
		}

		$id = $entity->entity_id;

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
	 *                                             __  _
	 *     ____  ________  ____  ____ __________ _/ /_(_)___  ____  _____
	 *    / __ \/ ___/ _ \/ __ \/ __ `/ ___/ __ `/ __/ / __ \/ __ \/ ___/
	 *   / /_/ / /  /  __/ /_/ / /_/ / /  / /_/ / /_/ / /_/ / / / (__  )
	 *  / .___/_/   \___/ .___/\__,_/_/   \__,_/\__/_/\____/_/ /_/____/
	 * /_/             /_/
	 */
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

		$fields = $this->get_lcdr_fields_for_response( $item, $request );

		// Base fields for every entity.
		$data = array();

		foreach ( $fields as $field ) {
			if ( rest_is_field_included( $field, $fields ) ) {
				switch ( $field ) {
					// guid.
					case 'guid':
						$data[ $field ] = apply_filters( 'get_the_guid', $entity->guid, $entity->entity_id );
						break;

					// default.
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

	/**
	 * Prepares links for the request.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $entity Entity object.
	 * @return array Links for the given entity.
	 */
	protected function prepare_links( $entity ) {
		// Entity meta.
		$links = array(
			'self'       => array(
				'href' => rest_url( $this->get_route( $entity->entity_id ) ),
			),
			'collection' => array(
				'href' => rest_url( $this->get_route( $entity->entity_id, true ) ),
			),
			'author'     => array(
				'href'       => rest_url( 'wp/v2/users/' . $entity->author ),
				'embeddable' => true,
			),
			// @todo do we need a about link?
			// 'about' => array(
			// 'href' => rest_url( 'wp/v2/types/' . $this->post_type ),
			// ),
		);

		// @todo add links to related entities

		return $links;
	}


	/**
	 * Prepares one item for create or update operation.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return object|\LCDR\Error\Rest The prepared item, or Error object on failure.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared       = new \stdClass();
		$current_status = '';

		// Validate data against schema.
		$valid       = null;
		$schema_name = $this->get_schema_name( $request );
		$params      = $request->get_body_params();
		try {
			$valid = lcdr_validate_value_from_schema(
				(object) $params,
				$schema_name['schema'],
				isset( $schema_name['options'] ) ? $schema_name['options'] : array()
			);
		} catch ( \Exception $e ) {
			$valid = new \LCDR\Error\Schema(
				$e->getMessage(),
				array(
					'status'   => 400,
					'received' => $params,
				)
			);
		}
		if ( is_lcdr_error( $valid ) ) {
			return $valid;
		}

		// Mount prepared object.
		foreach ( $params as $key => $value ) {
			switch ( $key ) {
				// Entity ID.
				case 'entity_id':
					$existing = $this->get_entity( (int) $value );
					if ( is_lcdr_error( $existing ) ) {
						return $existing;
					}

					$prepared->entity_id = $existing->entity_id;
					$current_status      = $existing->status;
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

		/**
		 * Filters a entity before it is inserted via the REST API.
		 *
		 * The dynamic portion of the hook name is `$this->rest_base`.
		 *
		 * @param \stdClass        $prepared An object representing a single post prepared
		 *                                       for inserting or updating the database.
		 * @param \WP_REST_Request $request  Request object.
		 */
		return apply_filters( lcdr_hook( array( 'rest', 'pre', 'insert', $this->rest_base ) ), $prepared, $request );
	}

	/**
	 * Prepare items query.
	 *
	 * @param array            $args    Array of arguments for Query.
	 * @param \WP_REST_Request $request Request object.
	 * @return array
	 */
	protected function prepare_items_query( $args, $request ) {
		$defaults = array(
			'number'         => 100,
			'per_page'       => 25,
			'offset'         => 0,
			'orderby'        => 'entity_id',
			'order'          => 'DESC',
			'search'         => '',
			'search_columns' => array(),

			// Queries
			// 'meta_query' => null, // See Queries\Meta
			// 'date_query' => null, // See Queries\Date
			// 'compare_query' => null, // See Queries\Compare
		);

		foreach ( $args as $key => $value ) {
			if ( ! isset( $defaults[ $key ] ) ) {
				unset( $args[ $key ] );
			}
		}

		$args = wp_parse_args( $args, $defaults );

		return $args;
	}

	/**                                _           _
	 *      ____  ___  _________ ___  (_)_________(_)___  ____  _____
	 *     / __ \/ _ \/ ___/ __ `__ \/ / ___/ ___/ / __ \/ __ \/ ___/
	 *    / /_/ /  __/ /  / / / / / / (__  |__  ) / /_/ / / / (__  )
	 *   / .___/\___/_/  /_/ /_/ /_/_/____/____/_/\____/_/ /_/____/
	 *  /_/
	 */
	/**
	 * Get items permissions check.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \LCDR\Error\Rest|boolean
	 */
	public function get_items_permissions_check( $request ) {
		if ( 'edit' === $request['context'] ) {
			return new \LCDR\Error\Rest(
				'batch_edit_get_forbidden',
				array( 'status' => rest_authorization_required_code() )
			);
		}
		return true;
	}

	/**
	 * Get item permissions check.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \LCDR\Error\Rest|boolean
	 */
	public function get_item_permissions_check( $request ) {
		$entity = $this->get_entity( $request['id'] );
		if ( is_lcdr_error( $entity ) ) {
			return $entity;
		}

		if ( 'edit' === $request['context'] && $entity && ! $this->check_update_permission( $entity ) ) {
			return new \LCDR\Error\Rest(
				'forbidden_context',
				array(
					'status' => rest_authorization_required_code(),
				)
			);
		}

		if ( $entity && ! empty( $request['password'] ) ) {
			// Check entity password, and return error if invalid.
			if ( ! hash_equals( $entity->password, $request['password'] ) ) {
				return new \LCDR\Error\Rest(
					'incorrect_password',
					array( 'status' => 403 )
				);
			}
		}

		return $this->check_read_permission( $entity );
	}

	/**
	 * Create item permissions check.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \LCDR\Error\Rest|boolean
	 */
	public function create_item_permissions_check( $request ) {
		if ( ! empty( $request['id'] ) ) {
			return new \LCDR\Error\Rest(
				'already_exists',
				array( 'status' => 400 )
			);
		}

		if ( ! empty( $request['author'] ) && get_current_user_id() !== $request['author'] && ! current_user_can( lcdr_hook( array( 'edit', 'others', $this->permission_group ) ) ) ) {
			return new \LCDR\Error\Rest(
				'rest_cannot_edit_others',
				array( 'status' => rest_authorization_required_code() )
			);
		}

		if ( ! current_user_can( lcdr_hook( array( 'edit', 'others', $this->permission_group ) ) ) ) {
			return new \LCDR\Error\Rest(
				'post_forbidden',
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	/**
	 * Checks if a entity can be read.
	 *
	 * @param \LCDR\DB\Row\Entity $entity Post object.
	 * @return true|\LCDR\Error\Rest True if the entity can be read, error object otherwise.
	 */
	protected function check_read_permission( $entity ) {
		// Is the entity readable?
		if ( 'publish' === $entity->status || current_user_can( lcdr_hook( array( 'see', $this->permission_group ) ), $entity->ID ) ) {
			return true;
		}
		return new \LCDR\Error\Rest(
			'get_forbidden',
			array( 'status' => rest_authorization_required_code() )
		);
	}

	/**
	 * Checks if an entity can be edited.
	 *
	 * @param \LCDR\DB\Row\Entity $entity Entity object.
	 * @return bool Whether the entity can be edited.
	 */
	protected function check_update_permission( $entity ) {
		return current_user_can( lcdr_hook( array( 'edit', $this->permission_group ) ), $entity->entity_id );
	}

	/**
	 * Checks if an entity can be deleted.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $entity Entity object.
	 * @return bool Whether the entity can be deleted.
	 */
	protected function check_delete_permission( $entity ) {
		$current_user_id = \get_current_user_id();
		if ( $entity->author !== $current_user_id ) {
			return current_user_can( lcdr_hook( array( 'delete', 'others', $this->permission_group ) ), $entity->entity_id );
		} else {
			return current_user_can( lcdr_hook( array( 'delete', 'own', $this->permission_group ) ), $entity->entity_id );
		}
	}

	/**
	 * Checks if the user can access password-protected content.
	 *
	 * This method determines whether we need to override the regular password
	 * check in core with a filter.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $entity    Post to check against.
	 * @param \WP_REST_Request           $request Request data to check.
	 * @return bool True if the user can access password-protected content, otherwise false.
	 */
	public function can_access_password_content( $entity, $request ) {
		if ( empty( $entity->password ) ) {
			// No filter required.
			return false;
		}

		/*
		 * Users always gets access to password protected content in the edit
		 * context if they have the `edit_post` meta capability.
		 */
		if (
			'edit' === $request['context'] &&
			current_user_can( lcdr_hook( array( 'edit', $this->permission_group ) ), $entity->entity_id )
		) {
			return true;
		}

		// No password, no auth.
		if ( empty( $request['password'] ) ) {
			return false;
		}

		// Double-check the request password.
		return hash_equals( $entity->password, $request['password'] );
	}

	/**
	 *                       __            __           __
	 *     ____  _________  / /____  _____/ /____  ____/ /
	 *    / __ \/ ___/ __ \/ __/ _ \/ ___/ __/ _ \/ __  /
	 *   / /_/ / /  / /_/ / /_/  __/ /__/ /_/  __/ /_/ /
	 *  / .___/_/   \____/\__/\___/\___/\__/\___/\__,_/
	 * /_/
	 */
	/**
	 * Validate required properties.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \LCDR\Error\Rest|boolean
	 */
	protected function validate_required_properties( $request ) {
		$method = $request->get_method();

		if ( str_contains( \WP_REST_Server::CREATABLE, $method ) ) {
			$required = array(
				'type',
				'_label',
				'identified_by',
			);
			$missing  = array();
			foreach ( $required as $key ) {
				if ( empty( $request[ $key ] ) ) {
					$missing[] = $key;
				}
			}
			if ( ! empty( $missing ) ) {
				return new \LCDR\Error\Rest(
					'missing_required_properties',
					array(
						'status'  => 400,
						'missing' => $missing,
					)
				);
			}
		}
		if ( str_contains( \WP_REST_Server::READABLE, $method ) ) {
			// Ensure a search string is set in case the orderby is set to 'relevance'.
			if ( ! empty( $request['orderby'] ) && 'relevance' === $request['orderby'] && empty( $request['search'] ) ) {
				return new \LCDR\Error\Rest(
					'no_search_term_defined',
					array( 'status' => 400 )
				);
			}

			// Ensure an include parameter is set in case the orderby is set to 'include'.
			if ( ! empty( $request['orderby'] ) && 'include' === $request['orderby'] && empty( $request['include'] ) ) {
				return new \LCDR\Error\Rest(
					'rest_orderby_include_missing_include',
					array( 'status' => 400 )
				);
			}
		}
		return true;
	}

	/**
	 * Get id from route.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return int|\LCDR\Error\Error
	 */
	protected function get_id_from_route( $request ) {
		$id = $request->get_param( 'id' );
		if ( empty( $id ) ) {
			$route   = $request->get_route();
			$pattern = '/\/(?P<id>\d+)$/';
			preg_match( $pattern, $route, $matches );
			$id = $matches['id'];
		}
		if ( empty( $id ) ) {
			return new \LCDR\Error\Rest(
				'empty_id',
				array( 'status' => 400 )
			);
		}
		return (int) $id;
	}

	/**
	 * Get fields for response.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $item    Entity object.
	 * @param \WP_REST_Request           $request Request object.
	 *
	 * @return string[]
	 */
	protected function get_lcdr_fields_for_response( $item, $request ) {
		$wp_fields          = $this->get_fields_for_response( $request );
		$request_fields     = $request->get_param( '_fields' );
		$allowed_properties = $item->get_allowed_properties();
		$fields             = array();

		if ( $request_fields ) {
			$fields = array_intersect( $request_fields, $allowed_properties );
		} elseif ( empty( $request_fields ) && ! empty( $wp_fields ) ) {
			$fields = $allowed_properties;
		}

		return array_merge( $wp_fields, $fields );
	}

	/**
	 * Determines validity and normalizes the given status parameter.
	 *
	 * @param string $status Status.
	 * @return string|\LCDR\Error\Rest Status or \LCDR\Error\Rest if lacking the proper permission.
	 */
	protected function handle_status_param( $status = '' ) {
		switch ( $status ) {
			case 'draft':
			case 'pending':
				break;
			case 'private':
				if ( ! current_user_can( lcdr_hook( array( 'publish', $this->permission_group ) ) ) ) {
					$status = new \LCDR\Error\Rest(
						'private_publish',
						array( 'status' => rest_authorization_required_code() )
					);
				}
				break;
			case 'publish':
			case 'future':
				if ( ! current_user_can( lcdr_hook( array( 'publish', $this->permission_group ) ) ) ) {
					$status = new \LCDR\Error\Rest(
						'publish',
						array( 'status' => rest_authorization_required_code() )
					);
				}
				break;
			default:
				$status = 'draft';
				break;
		}

		return $status;
	}

	/**
	 * Insert hook.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $entity   Entity object.
	 * @param \WP_REST_Request           $request  Request object.
	 * @param boolean                    $creating True when creating a entity, false when updating.
	 * @param boolean                    $after    True when after creating a entity, false when before, default false.
	 * @return void
	 */
	protected function rest_insert_hook( $entity, $request, $creating, $after = false ) {
		/**
		 * Fires before or after a single entity is completely created or updated via the REST API.
		 *
		 * @wp-filter rest_insert_{$this->rest_base}
		 */
		do_action(
			lcdr_hook(
				array(
					'rest',
					$after ? 'after' : null,
					'insert',
					$this->rest_base,
				)
			),
			$entity,
			$request,
			$creating
		);
	}

	/**
	 * Get entity.
	 *
	 * @param int $id Entity ID.
	 * @return \LCDR\Error\Rest|\LCDR\DB\Row\Entity
	 */
	protected function get_entity( $id ) {
		$error = new \LCDR\Error\Rest(
			'invalid_id',
			array( 'status' => 404 )
		);

		if ( (int) $id <= 0 ) {
			return $error;
		}

		$entity = lcdr_get_entity( (int) $id );
		if ( empty( $entity ) || empty( $entity->entity_id ) ) {
			return $error;
		}
		return $entity;
	}

	/**
	 * Get schema name.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return array
	 */
	protected function get_schema_name( $request = null ) {
		$content_type   = $this->content_negotiation_request( $request );
		$request_method = $request->get_method();
		$method         = 'view';
		switch ( $request_method ) {
			case 'POST':
			case 'PUT':
			case 'PATCH':
			case 'DELETE':
				$method = 'edit';
				break;
			case 'GET':
			default:
				$method = 'view';
				break;
		}
		return $this->schema_name[ $content_type ][ $method ];
	}

	/**
	 * Parse linked art content type.
	 *
	 * @param string $type Content type.
	 * @return string|\LCDR\Error\Rest
	 */
	protected function parse_linked_art_content_type( $type ) {
		$error = new \LCDR\Error\Rest(
			'invalid_content_type',
			array( 'status' => 400 )
		);
		if ( ! str_starts_with( $type, 'application/ld+json' ) ) {
			return $error;
		}
		$ld      = explode( ';', $type );
		$ld      = array_map( 'trim', $ld );
		$ld      = array_filter( $ld );
		$ld      = array_values( $ld );
		$type    = $ld[0];
		$profile = explode( '=', $ld[1] );
		$profile = array_map( 'trim', $profile );
		$profile = array_filter( $profile );
		$profile = array_values( $profile );
		if ( 'profile' === $profile[0] && '"https://linked.art/ns/v1/linked-art.json"' === $profile[1] ) {
			return 'la';
		}
		return $error;
	}

	/**          __         __                  __
	 *    ____ _/ /_  _____/ /__________ ______/ /_
	 *   / __ `/ __ \/ ___/ __/ ___/ __ `/ ___/ __/
	 *  / /_/ / /_/ (__  ) /_/ /  / /_/ / /__/ /_
	 *  \__,_/_.___/____/\__/_/   \__,_/\___/\__/
	 */
	/**
	 * Set base.
	 *
	 * @return string
	 */
	abstract public function set_base();

	/**
	 * Set schema_names.
	 *
	 * @return array
	 *
	 * @example
	 * ```php
	 * array(
	 *      'wp' => array(
	 *          'GET' => array(
	 *              'schema'  => '',
	 *              'options' => array(),
	 *           ),
	 *          'POST' => array(
	 *               'schema'  => '',
	 *               'options' => array(),
	 *      ),
	 *      'la' => array(
	 *          'GET' => array(
	 *              'schema'  => '',
	 *              'options' => array(),
	 *          ),
	 *      ),
	 * );
	 * ```
	 */
	abstract public function set_schema();

	/**
	 * Set permission group.
	 *
	 * @return string
	 */
	abstract public function set_permission_group();
}
