<?php
/**
 * Base Rest class.
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
	 * Primary property.
	 *
	 * @var string
	 */
	public $primary_property = '';

	/**
	 * Required properties.
	 *
	 * @var array
	 */
	public $required_properties = array();

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
		$this->schema_name         = $this->set_schema();
		$this->permission_group    = $this->set_permission_group();
		$this->routes              = $this->set_routes();
		$this->rest_base           = $this->set_base();
		$this->primary_property    = $this->set_primary_property();
		$this->required_properties = $this->set_required_properties();
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
			return 'mdorim';
		}

		$type = $this->parse_linked_art_content_type( $type );

		if ( is_lcdr_error( $type ) ) {
			return $type;
		}

		if ( 'la' === $type ) {
			return $type;
		}

		return 'mdorim';
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

		$fields = $this->get_lcdr_fields_for_response( $entity, $request );

		// Base fields for every entity.
		$data = array();

		foreach ( $fields as $field ) {
			if ( rest_is_field_included( $field, $fields ) ) {
				switch ( $field ) {
					// uuid.
					case 'uuid':
						$data[ $field ] = apply_filters( 'get_the_uuid', $entity->uuid, $entity->{$this->primary_property} );
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
	 *
	 * @todo avaliar possibilidade de uso no Mapping tb
	 */
	protected function prepare_links( $entity ) {
		// Entity meta.
		$links = array(
			'self'       => array(
				'href' => rest_url( $this->get_route( $entity->{$this->primary_property} ) ),
			),
			'collection' => array(
				'href' => rest_url( $this->get_route( $entity->{$this->primary_property}, true ) ),
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

		// Validate data against schema.
		$valid       = null;
		$schema_name = $this->get_schema_name( $request );
		$params      = $request->get_body_params();

		// Schema validation.
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

		// Prepare data for database.
		$prepared = $this->prepare_for_db( $params, $request );

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
			'orderby'        => $this->primary_property,
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
		$id = $this->get_id_from_request( $request );
		if ( is_lcdr_error( $id ) ) {
			return $id;
		}
		$entity = $this->get_entity( $id );
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
		if ( ! empty( $request[ $this->primary_property ] ) ) {
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
		if ( 'publish' === $entity->status || current_user_can( lcdr_hook( array( 'see', $this->permission_group ) ), $entity->{$this->primary_property} ) ) {
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
		return current_user_can( lcdr_hook( array( 'edit', $this->permission_group ) ), $entity->{$this->primary_property} );
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
			return current_user_can( lcdr_hook( array( 'delete', 'others', $this->permission_group ) ), $entity->{$this->primary_property} );
		} else {
			return current_user_can( lcdr_hook( array( 'delete', 'own', $this->permission_group ) ), $entity->{$this->primary_property} );
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
			current_user_can( lcdr_hook( array( 'edit', $this->permission_group ) ), $entity->{$this->primary_property} )
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
			$missing = array();
			foreach ( $this->required_properties as $key ) {
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
	 * Get id from request.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return int|\LCDR\Error\Error
	 */
	protected function get_id_from_request( $request ) {
		$id = $request->get_param( $this->primary_property );
		if ( empty( $id ) ) {
			$route   = $request->get_route();
			$pattern = '/\/(?P<id>\d+)$/';
			preg_match( $pattern, $route, $matches );
			$id = isset( $matches['id'] ) ? $matches['id'] : 0;
		}

		if ( empty( $id ) ) {
			$id = new \LCDR\Error\Rest(
				'empty_id',
				array( 'status' => 400 )
			);
		}

		return $id;
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
			case 'inactive':
			case 'active':
				if ( ! current_user_can( lcdr_hook( array( 'edit', $this->permission_group ) ) ) ) {
					$status = new \LCDR\Error\Rest(
						'switch_status',
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

	/**
	 * Set primary property.
	 *
	 * @return string
	 */
	abstract public function set_primary_property();

	/**
	 * Set required properties.
	 *
	 * @return array
	 */
	abstract public function set_required_properties();

	/**
	 * Prepare item.
	 *
	 * @param array            $args
	 * @param \WP_REST_Request $request
	 * @return object|\LCDR\Error\Error
	 */
	abstract public function prepare_for_db( $args, $request );

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
		return new \LCDR\Error\Rest(
			'not_implemented',
			array( 'status' => 501 )
		);
	}

	/**
	 * Retrieves a collection of entities.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		return new \LCDR\Error\Rest(
			'not_implemented',
			array( 'status' => 501 )
		);
	}

	/**
	 * Creates a single entity.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or \LCDR\Error\Rest object on failure.
	 */
	public function create_item( $request ) {
		return new \LCDR\Error\Rest(
			'not_implemented',
			array( 'status' => 501 )
		);
	}

	/**
	 * Updates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\LCDR\Error\Error Response object on success, or Error object on failure.
	 */
	public function update_item( $request ) {
		return new \LCDR\Error\Rest(
			'not_implemented',
			array( 'status' => 501 )
		);
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
		return new \LCDR\Error\Rest(
			'not_implemented',
			array( 'status' => 501 )
		);
	}

	/**
	 * Get entity.
	 *
	 * @param int $id Entity ID.
	 * @return \LCDR\Error\Rest|\LCDR\DB\Row\Entity
	 */
	abstract protected function get_entity( $id );
}
