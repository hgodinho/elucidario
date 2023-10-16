<?php
/**
 * Core users class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Users;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Core Users Class
 */
class Core {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\singleton;
	use \LCDR\Utils\debug;

	/**
	 * User capabilities version.
	 *
	 * @var string
	 */
	protected $version = '1.0.0';

	/**
	 * Capabilities.
	 *
	 * @var array
	 */
	public static $capabilities = array(
		'see',
		'create',
		'edit_own',
		'edit_others',
		'edit_published',
		'delete_own',
		'delete_others',
		'publish',
	);

	/**
	 * Roles.
	 *
	 * @var array
	 */
	public $roles = array();

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Initialize the users roles.
	 *
	 * @return void
	 */
	public function init() {
		if ( lcdr_get_option( 'user_caps_version' ) !== $this->version ) {
			$this->set_roles();
			$this->add_roles();
			$this->populate_capabilities();
			lcdr_set_option( 'user_caps_version', $this->version );
		}
	}

	/**
	 * Get the capabilities by role.
	 *
	 * @param string $role Role name.
	 * @return array|\LCDR\Error\User
	 */
	public function get_capabilities_by_role( string $role ) {
		$this->set_roles();

		$admin = array(
			'create_users',
			'delete_users',
			'list_users',
		);

		$options = array(
			'see',
			'create',
			'delete',
		);

		$curator = self::$capabilities;

		$museologist = $curator;

		$assistant = $this->remove_items_from_capabilities( array( 'delete_others', 'publish' ) );

		$researcher = $this->remove_items_from_capabilities( array( 'edit_published', 'delete_own', 'delete_others', 'publish' ) );

		switch ( $role ) {
			case 'curator':
				return $this->mount_capabilities(
					array(
						$admin,
						$this->mount_capabilities_per_group( 'options', $options ),
						$this->mount_capabilities_per_group( 'entities', $curator ),
						$this->mount_capabilities_per_group( 'mapping', $curator ),
						$this->mount_capabilities_per_group( 'procedures', $curator ),
					)
				);
			case 'museologist':
				return $this->mount_capabilities(
					array(
						$admin,
						$this->mount_capabilities_per_group( 'options', $options ),
						$this->mount_capabilities_per_group( 'entities', $museologist ),
						$this->mount_capabilities_per_group( 'mapping', $museologist ),
						$this->mount_capabilities_per_group( 'procedures', $museologist ),
					)
				);
			case 'assistant':
				return $this->mount_capabilities(
					array(
						$this->mount_capabilities_per_group( 'options', $options, array( 'create', 'delete' ) ),
						$this->mount_capabilities_per_group( 'entities', $assistant ),
						$this->mount_capabilities_per_group( 'mapping', $assistant ),
						$this->mount_capabilities_per_group( 'procedures', $assistant ),
					)
				);
			case 'researcher':
				return $this->mount_capabilities(
					array(
						$this->mount_capabilities_per_group( 'entities', $researcher ),
						$this->mount_capabilities_per_group( 'mapping', $researcher ),
					)
				);
			case 'public':
				return $this->mount_capabilities(
					array(
						$this->mount_capabilities_per_group( 'entities', array( 'see' ) ),
						$this->mount_capabilities_per_group( 'mapping', array( 'see' ) ),
					)
				);
			default:
				return new \LCDR\Error\User( 'unknown_user_role', $role );
		}
	}

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */
	/**
	 * Constructor.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Add the roles.
	 *
	 * @return void
	 */
	private function add_roles() {
		foreach ( $this->roles as $role => $label ) {
			add_role( $role, $label, $this->get_capabilities_by_role( $role ) );
		}
	}

	/**
	 * Set user roles.
	 *
	 * @return void
	 */
	private function set_roles() {
		$this->roles = array(
			'curator'     => __( 'Curator', 'lcdr' ),
			'museologist' => __( 'Museologist', 'lcdr' ),
			'assistant'   => __( 'Assistant', 'lcdr' ),
			'researcher'  => __( 'Researcher', 'lcdr' ),
		);
	}

	/**
	 * Populate the capabilities.
	 *
	 * @return void
	 */
	private function populate_capabilities() {
		$administrator = get_role( 'administrator' );
		$capabilities  = $this->mount_capabilities(
			array(
				$this->mount_capabilities_per_group( 'options', array( 'see', 'create', 'delete' ) ),
				$this->mount_capabilities_per_group( 'entities', self::$capabilities ),
				$this->mount_capabilities_per_group( 'mapping', self::$capabilities ),
				$this->mount_capabilities_per_group( 'procedures', self::$capabilities ),
			)
		);
		foreach ( $capabilities as $capability => $value ) {
			$administrator->add_cap( $capability, true );
		}
	}

	/**
	 * Mount the capabilities.
	 *
	 * @param array[] $values Array of arrays.
	 * @return array
	 */
	private function mount_capabilities( $values ) {
		$result = array();
		foreach ( $values as $group ) {
			foreach ( $group as $element ) {
				$result[ $element ] = true;
			}
		}
		return $result;
	}

	/**
	 * Mount the capabilities per group.
	 *
	 * @param string $group        Group name.
	 * @param array  $capabilities Capabilities.
	 * @param array  $exclude      Capabilities to exclude.
	 * @return array
	 */
	private function mount_capabilities_per_group( $group, $capabilities, $exclude = array() ) {
		$result = array();
		foreach ( $capabilities as $capability ) {
			if ( in_array( $capability, $exclude, true ) ) {
				continue;
			}
			$result[] = lcdr_hook( array( $capability, $group ) );
		}
		return $result;
	}

	/**
	 * Remove items from capabilities.
	 *
	 * @param string[] $items Items to remove.
	 * @return array
	 */
	private function remove_items_from_capabilities( array $items ) {
		$result = array();
		foreach ( self::$capabilities as $item ) {
			if ( ! in_array( $item, $items, true ) ) {
				$result[] = $item;
			}
		}
		return $result;
	}
}
