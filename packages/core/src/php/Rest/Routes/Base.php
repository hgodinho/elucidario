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
			$registered[] = register_rest_route( $this->namespace, "{$this->rest_base}{$route}", $endpoints );
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
				'schema' => array( $this, 'get_public_item_schema' ),
			),
			'/(?P<id>[\d]+)' => array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_item' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
					'args'                => array(),
				),
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_item' ),
					'permission_callback' => array( $this, 'delete_item_permissions_check' ),
					'args'                => array(),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			),
		);
	}

	public function get_item_schema() {
		if ( ! empty( $this->schema ) ) {
			return $this->add_additional_fields_schema( $this->schema );
		}
		$this->schema = $this->set_schema();

		$this->dump( 'cli', $this->schema, __CLASS__, __METHOD__, __LINE__, false );
	}

	/**
	 *                        __
	 *   ____________  ______/ /
	 *  / ___/ ___/ / / / __  /
	 * / /__/ /  / /_/ / /_/ /
	 * \___/_/   \__,_/\__,_/
	 */
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
		// content-type is wp — continue
		$this->dump( 'cli', $content_type, __CLASS__, __METHOD__, __LINE__, false );

		if ( ! empty( $request['id'] ) ) {
			return new \LCDR\Error\Rest(
				'already_exists',
				array( 'status' => 400 )
			);
		}

		$prepared_entity = $this->prepare_item_for_database( $request );

		if ( is_lcdr_error( $prepared_entity ) ) {
			return $prepared_entity;
		}

		if ( ! empty( $prepared_entity->name )
			&& ! empty( $prepared_entity->status )
			&& in_array( $prepared_entity->status, array( 'draft', 'pending' ), true )
		) {
			/*
			 * `lcdr_unique_entity_slug()` returns the same slug for 'draft' or 'pending' posts.
			 *
			 * To ensure that a unique slug is generated, pass the entity data with the 'publish' status.
			 */
			$prepared_entity->name = lcdr_unique_entity_slug( $prepared_entity );
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
		 * @param \LCDR\DB\Interfaces\Entity         $entity     Inserted or updated post object.
		 * @param \WP_REST_Request $request  Request object.
		 * @param bool            $creating True when creating a post, false when updating.
		 */
		$this->rest_insert_hook( $entity, $request, true );

		$schema = $this->get_item_schema();

		$entity = $this->get_entity( $entity_id );

		$request->set_param( 'context', 'edit' );

		/**
		 * Fires after a single entity is completely created or updated via the REST API.
		 *
		 * @param \LCDR\DB\Interfaces\Entity         $entity     Inserted or updated post object.
		 * @param \WP_REST_Request $request  Request object.
		 * @param bool            $creating True when creating a post, false when updating.
		 * @param bool            $after    True when after creating a post, false when before, default false.
		 */
		$this->rest_insert_hook( $entity, $request, true, true );

		$response = $this->prepare_item_for_response( $entity, $request );
		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header( 'Location', rest_url( implode( '/', array( $this->namespace, $this->rest_base, $entity_id ) ) ) );

		$this->dump( 'cli', $response, __CLASS__, __METHOD__, __LINE__, false );

		return $response;
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
	public function check_read_permission( $entity ) {
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
	 *                       __            __           __
	 *     ____  _________  / /____  _____/ /____  ____/ /
	 *    / __ \/ ___/ __ \/ __/ _ \/ ___/ __/ _ \/ __  /
	 *   / /_/ / /  / /_/ / /_/  __/ /__/ /_/  __/ /_/ /
	 *  / .___/_/   \____/\__/\___/\___/\__/\___/\__,_/
	 * /_/
	 */
	/**
	 * Prepares one item for create or update operation.
	 *
	 * @since 4.7.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return object|\LCDR\Error\Rest The prepared item, or Error object on failure.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared       = new \stdClass();
		$current_status = '';

		// Entity ID.
		if ( isset( $request['id'] ) ) {
			$existing = $this->get_entity( $request['id'] );
			if ( is_lcdr_error( $existing ) ) {
				return $existing;
			}

			$prepared->entity_id = $existing->entity_id;
			$current_status      = $existing->status;
		}

		$schema = $this->get_item_schema();

		$this->dump( 'cli', $schema, __CLASS__, __METHOD__, __LINE__, false );

		// Post title.
		if ( ! empty( $schema['properties']['title'] ) && isset( $request['title'] ) ) {
			if ( is_string( $request['title'] ) ) {
				$prepared->post_title = $request['title'];
			} elseif ( ! empty( $request['title']['raw'] ) ) {
				$prepared->post_title = $request['title']['raw'];
			}
		}

		// Post content.
		if ( ! empty( $schema['properties']['content'] ) && isset( $request['content'] ) ) {
			if ( is_string( $request['content'] ) ) {
				$prepared->post_content = $request['content'];
			} elseif ( isset( $request['content']['raw'] ) ) {
				$prepared->post_content = $request['content']['raw'];
			}
		}

		// Post excerpt.
		if ( ! empty( $schema['properties']['excerpt'] ) && isset( $request['excerpt'] ) ) {
			if ( is_string( $request['excerpt'] ) ) {
				$prepared->post_excerpt = $request['excerpt'];
			} elseif ( isset( $request['excerpt']['raw'] ) ) {
				$prepared->post_excerpt = $request['excerpt']['raw'];
			}
		}

		// Post status.
		if (
			! empty( $schema['properties']['status'] ) &&
			isset( $request['status'] ) &&
			( ! $current_status || $current_status !== $request['status'] )
		) {
			$status = $this->handle_status_param( $request['status'], $post_type );

			if ( is_wp_error( $status ) ) {
				return $status;
			}

			$prepared->post_status = $status;
		}

		// Post date.
		if ( ! empty( $schema['properties']['date'] ) && ! empty( $request['date'] ) ) {
			$current_date = isset( $prepared->ID ) ? get_post( $prepared->ID )->post_date : false;
			$date_data    = rest_get_date_with_gmt( $request['date'] );

			if ( ! empty( $date_data ) && $current_date !== $date_data[0] ) {
				list( $prepared->post_date, $prepared->post_date_gmt ) = $date_data;
				$prepared->edit_date                                   = true;
			}
		} elseif ( ! empty( $schema['properties']['date_gmt'] ) && ! empty( $request['date_gmt'] ) ) {
			$current_date = isset( $prepared->ID ) ? get_post( $prepared->ID )->post_date_gmt : false;
			$date_data    = rest_get_date_with_gmt( $request['date_gmt'], true );

			if ( ! empty( $date_data ) && $current_date !== $date_data[1] ) {
				list( $prepared->post_date, $prepared->post_date_gmt ) = $date_data;
				$prepared->edit_date                                   = true;
			}
		}

		// Sending a null date or date_gmt value resets date and date_gmt to their
		// default values (`0000-00-00 00:00:00`).
		if (
			( ! empty( $schema['properties']['date_gmt'] ) && $request->has_param( 'date_gmt' ) && null === $request['date_gmt'] ) ||
			( ! empty( $schema['properties']['date'] ) && $request->has_param( 'date' ) && null === $request['date'] )
		) {
			$prepared->post_date_gmt = null;
			$prepared->post_date     = null;
		}

		// Post slug.
		if ( ! empty( $schema['properties']['slug'] ) && isset( $request['slug'] ) ) {
			$prepared->post_name = $request['slug'];
		}

		// Author.
		if ( ! empty( $schema['properties']['author'] ) && ! empty( $request['author'] ) ) {
			$post_author = (int) $request['author'];

			if ( get_current_user_id() !== $post_author ) {
				$user_obj = get_userdata( $post_author );

				if ( ! $user_obj ) {
					return new WP_Error(
						'rest_invalid_author',
						__( 'Invalid author ID.' ),
						array( 'status' => 400 )
					);
				}
			}

			$prepared->post_author = $post_author;
		}

		// Post password.
		if ( ! empty( $schema['properties']['password'] ) && isset( $request['password'] ) ) {
			$prepared->post_password = $request['password'];

			if ( '' !== $request['password'] ) {
				if ( ! empty( $schema['properties']['sticky'] ) && ! empty( $request['sticky'] ) ) {
					return new WP_Error(
						'rest_invalid_field',
						__( 'A post can not be sticky and have a password.' ),
						array( 'status' => 400 )
					);
				}

				if ( ! empty( $prepared->ID ) && is_sticky( $prepared->ID ) ) {
					return new WP_Error(
						'rest_invalid_field',
						__( 'A sticky post can not be password protected.' ),
						array( 'status' => 400 )
					);
				}
			}
		}

		// Comment status.
		if ( ! empty( $schema['properties']['comment_status'] ) && ! empty( $request['comment_status'] ) ) {
			$prepared->comment_status = $request['comment_status'];
		}

		// Ping status.
		if ( ! empty( $schema['properties']['ping_status'] ) && ! empty( $request['ping_status'] ) ) {
			$prepared->ping_status = $request['ping_status'];
		}

		/**
		 * Filters a post before it is inserted via the REST API.
		 *
		 * The dynamic portion of the hook name, `$this->post_type`, refers to the post type slug.
		 *
		 * Possible hook names include:
		 *
		 *  - `rest_pre_insert_post`
		 *  - `rest_pre_insert_page`
		 *  - `rest_pre_insert_attachment`
		 *
		 * @since 4.7.0
		 *
		 * @param stdClass        $prepared An object representing a single post prepared
		 *                                       for inserting or updating the database.
		 * @param WP_REST_Request $request       Request object.
		 */
		return apply_filters( "rest_pre_insert_{$this->post_type}", $prepared, $request );
	}

	/**
	 * Insert hook.
	 *
	 * @param \LCDR\DB\Interfaces\Entity $entity
	 * @param \WP_REST_Request           $request
	 * @param boolean                    $creating
	 * @param boolean                    $after
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
	 * Validate header.
	 *
	 * @param \WP_REST_Request $request
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
	 * Set schema.
	 *
	 * @return array
	 */
	abstract public function set_schema();

	/**
	 * Set permission group.
	 *
	 * @return string
	 */
	abstract public function set_permission_group();
}
