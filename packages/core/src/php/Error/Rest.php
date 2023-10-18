<?php
/**
 * Rest class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Error;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Rest Error Class
 */
class Rest extends Base {
	/**
	 * Set prefix.
	 *
	 * @return string
	 */
	public function set_prefix() {
		return 'rest_';
	}

	/**
	 * Set possible errors.
	 *
	 * @return array
	 */
	public function set_possible_errors() {
		return array(
			// 401/403.
			'post_forbidden'                  => __( 'Sorry, you are not allowed to create this kind of entity.', 'lcdr' ),
			'get_forbidden'                   => __( 'Sorry, you are not allowed to see this kind of entity.', 'lcdr' ),
			'batch_edit_get_forbidden'        => __( 'Sorry, you are not allowed to batch edit with GET method.', 'lcdr' ),
			'put_forbidden'                   => __( 'Sorry, you are not allowed to edit this kind of entity.', 'lcdr' ),
			'forbidden_context'               => __( 'Sorry, you are not allowed to edit this kind of entity.', 'lcdr' ),
			'delete_forbidden'                => __( 'Sorry, you are not allowed to delete this kind of entity.', 'lcdr' ),
			'incorrect_password'              => __( 'Sorry, the password to see this entity is incorrect.', 'lcdr' ),
			'private_publish'                 => __( 'Sorry, you are not allowed to publish this kind of entity privately.', 'lcdr' ),
			'publish'                         => __( 'Sorry, you are not allowed to publish this kind of entity.', 'lcdr' ),
			'switch_status'                   => __( 'Sorry, you are not allowed to switch the status of this kind of entity.', 'lcdr' ),
			'cannot_edit_others'              => __( 'Sorry, you cannot edit entities created by other users.', 'lcdr' ),
			'user_cannot_delete_post'         => __( 'Sorry, you are not allowed to delete this post.', 'lcdr' ),
			// 404.
			'not_found'                       => __( 'Sorry, this entity does not exist.', 'lcdr' ),
			// 400.
			'invalid_content_type'            => __( 'Sorry, the content type is invalid.', 'lcdr' ),
			'create_invalid_content_type'     => __( 'Sorry, the only type allowed for creation is WordPress, you don\'t need to pass accept header for POST/PUT/PATCH methods.', 'lcdr' ),
			'update_invalid_content_type'     => __( 'Sorry, the only type allowed for update is WordPress, you don\'t need to pass accept header for POST/PUT/PATCH methods.', 'lcdr' ),
			'invalid_author'                  => __( 'Sorry, the author is invalid.', 'lcdr' ),
			'invalid_id'                      => __( 'Sorry, this ID is invalid.', 'lcdr' ),
			'missing_required_properties'     => __( 'Sorry, some required properties are missing.', 'lcdr' ),
			'already_exists'                  => __( 'Sorry, this entity already exists.', 'lcdr' ),
			'empty_id'                        => __( 'Sorry, this ID is empty.', 'lcdr' ),
			'no_search_term_defined'          => __( 'You need to define a search term to order by relevance.', 'lcdr' ),
			'orderby_include_missing_include' => __( 'You need to define an include parameter to order by include.', 'lcdr' ),
			// 410.
			'already_trashed'                 => __( 'Sorry, this entity is already trashed.', 'lcdr' ),
			// 500.
			'cannot_delete'                   => __( 'Sorry, this entity cannot be deleted.', 'lcdr' ),
			// 501.
			'trash_not_supported'             => __( 'Sorry, this entity does not support trash.', 'lcdr' ),
			'not_implemented'                 => __( 'Sorry, this method is not implemented.', 'lcdr' ),
		);
	}
}
