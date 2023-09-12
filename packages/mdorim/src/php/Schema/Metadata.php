<?php
/**
 * Class Metadata
 *
 * @package elucidario/pkg-mdorim
 */

namespace Mdorim\Schema;

/**
 * Metadata
 */
class Metadata extends Generator {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \Mdorim\Traits\Singleton;

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();

		$this->init_properties();

		// Relationships
		$this->add_schemas(
			array(
				'classified_as' => $this->get( 'relationships' ),
				'representation' => $this->get( 'relationships' ),
				'member_of' => $this->get( 'relationships' ),
				'subject_of' => $this->get( 'relationships' ),
				'part_of' => $this->get( 'relationships' ),
				'conforms_to' => $this->get( 'relationships' ),
				'access_point' => $this->get( 'relationships' ),
				'digitally_carries' => $this->get( 'relationships' ),
				'digitally_shows' => $this->get( 'relationships' ),
				'used_for' => $this->get( 'relationships' ),
				'carried_out' => $this->get( 'relationships' ),
				'residence' => $this->get( 'relationships' ),
				'took_place_at' => $this->get( 'relationships' ),
				'caused_by' => $this->get( 'relationships' ),
				'carried_out_by' => $this->get( 'relationships' ),
				'used_specific_object' => $this->get( 'relationships' ),
				'influenced_by' => $this->get( 'relationships' ),
				'technique' => $this->get( 'relationships' ),
				'digitally_shown_by' => $this->get( 'relationships' ),
				'shown_by' => $this->get( 'relationships' ),
				'about' => $this->get( 'relationships' ),
				'represents' => $this->get( 'relationships' ),
				'represents_instance_of_type' => $this->get( 'relationships' ),
				'made_of' => $this->get( 'relationships' ),
				'current_owner' => $this->get( 'relationships' ),
				'current_custodian' => $this->get( 'relationships' ),
				'current_permanent_custodian' => $this->get( 'relationships' ),
				'current_location' => $this->get( 'relationships' ),
				'shows' => $this->get( 'relationships' ),
				'carries' => $this->get( 'relationships' ),
				'approximated_by' => $this->get( 'relationships' ),
				'language' => $this->get( 'relationships' ),
				'digitally_carried_by' => $this->get( 'relationships' ),
				'carried_by' => $this->get( 'relationships' ),
				'refers_to' => $this->get( 'relationships' ),
				'broader' => $this->get( 'relationships' ),
			),
		);
	}

	/**
	 * Initialize properties.
	 *
	 * @param string|null $caller set_shared_constructs, set_metadata, set_simple_properties
	 * @return void
	 */
	public function init_properties( $caller = null ) {
		$callbacks = array(
			'set_simple_properties',
			'set_shared_constructs',
			'set_metadata',
		);
		if ( ! empty( $caller ) ) {
			$callbacks = array_filter( $callbacks, function ($callback) use ($caller) {
				return $callback !== $caller;
			} );
		}
		foreach ( $callbacks as $callback ) {
			$this->{$callback}();
		}
	}

	/**
	 * Set simple properties.
	 *
	 * @return void
	 */
	public function set_simple_properties() {
		$properties = array(
			/**
			 *             __         _     
			 *   __ _  ___/ /__  ____(_)_ _ 
			 *  /  ' \/ _  / _ \/ __/ /  ' \
			 * /_/_/_/\_,_/\___/_/ /_/_/_/_/                          
			 */
			'entity_id' => $this->integer_schema( array(
				'title' => 'Entity ID',
			) ),

			'name' => $this->string_schema( array(
				'title' => 'Entity name',
				'description' => 'Slug form of the Entity title',
			) ),

			'guid' => $this->string_schema( array(
				'title' => 'GUID',
			) ),

			'author' => $this->integer_schema( array(
				'title' => 'Author ID',
			) ),

			'status' => $this->string_schema( array(
				'title' => 'Entity status',
				'enum' => array( 'publish', 'draft', 'pending', 'private' ),
			) ),

			'password' => $this->integer_schema( array(
				'title' => 'Entity password',
			) ),

			'created' => $this->date_schema( array(
				'title' => 'Created date',
			) ),

			'modified' => $this->date_schema( array(
				'title' => 'Modification date',
			) ),

			'relationships' => $this->array_schema(
				$this->integer_schema( array(
					'title' => 'Relationship',
				) ),
				array(
					'title' => 'Relationships',
				)
			),

			/**
			 *    ___      __          __           __ 
			 *   / (_)__  / /_____ ___/ / ___ _____/ /_
			 *  / / / _ \/  '_/ -_) _  / / _ `/ __/ __/
			 * /_/_/_//_/_/\_\\__/\_,_/  \_,_/_/  \__/ 
			 */
			'id_prop' => $this->uri_schema( array(
				'title' => 'Linked Art ID',
			) ),

			'label_prop' => $this->string_schema( array(
				'title' => 'Label',
			) ),

			'type_prop' => $this->string_schema( array(
				'title' => 'Type',
				'enum' => array( '' ), // listar tipos de entidades Linked Art
			) ),

			'content_prop' => $this->string_schema( array(
				'title' => 'Content',
			) ),

			'value_prop' => $this->number_schema( array(
				'title' => 'Value',
				'description' => 'The numeric value of a `Dimension` or `MonetaryAmount`',
			) ),

			'upper_value_prop' => $this->number_schema( array(
				'title' => 'Value',
				'description' => 'The highest possible value for the `Dimension` or `MonetaryAmount`'
			) ),

			'lower_value_prop' => $this->number_schema( array(
				'title' => 'Value',
				'description' => 'The lowest possible value for the `Dimension` or `MonetaryAmount`'
			) ),

			'format_prop' => $this->string_schema( array(
				'title' => 'Format',
				'description' => 'The media type of the content of the embedded text, e.g. text/plain'
			) ),
		);

		$this->add_schemas( $properties );
	}

	/**
	 * Set shared constructs.
	 *
	 * @return void
	 */
	public function set_shared_constructs() {
		$this->init_properties( 'set_shared_constructs' );

		$properties = array(
			'AttributeAssignment' => $this->object_schema( array(
				'type' => $this->get( 'type_prop', array(
					'const' => 'AttributeAssignment',
				) ),
				'_label' => $this->get( 'label_prop' ),
				'took_place_at' => $this->get( 'took_place_at' ),
				'identified_by' => $this->get( 'identified_by' ),
				'classified_by' => $this->get( 'classified_by' ),
			) ),

			// @todo need to add part (Name), classified_as, identified_by when used by Entities (AttributeAssignment)
			'Name' => $this->object_schema( array(
				'_label' => $this->get( 'label_prop' ),
				'type' => $this->get( 'type_prop', array(
					'const' => 'Name',
				) ),
				'content' => $this->get( 'content_prop' ),
				'language' => $this->get( 'language_prop' ),
				// 'part' => $this->array_schema( $this->Name )
			),
				array(
					'title' => 'Name'
				)
			),

			// @todo need to add part (Identifier), assigned_by (AttributeAssignment), classified_as, identified_by when used by Entities
			'Identifier' => $this->object_schema( array(
				'_label' => $this->get( 'label_prop' ),
				'type' => $this->get( 'type_prop', array(
					'const' => 'Identifier',
				) ),
				'content' => $this->get( 'content' ),
				// 'part' => $this->array_schema( $this->Identifier )
				// 'assigned_by' => $this->integer_schema( array(
				// 	'title' => 'Assigned by',
				// ) ),
			),
				array(
					'title' => 'Identifier'
				)
			),

			// @todo need to add classified_as & identified_by when used by Entities
			'Concept' => $this->object_schema( array(
				'id' => $this->get( 'id_prop' ),
				'_label' => $this->get( 'label_prop' ),
				'type' => $this->get( 'type_prop', array(
					'const' => 'Type',
				) ),
				// 'classified_as' => $this->get( 'la_classified_as' ),
			) ),
		);

		$this->add_schemas( $properties );
	}


	public function set_metadata() {
		$this->init_properties( 'set_metadata' );

		array(
			'referred_to_by',
			'equivalent',
			'attributed_by',
			'dimension',
			'digitally_available_via',
			'created_by',
			'contact_point',
			'begin_of_existence',
			'end_of_existence',
			'timespan',
			'part',
			'produced_by',
			'destroyed_by',
			'removed_by'
		);

		$this->identified_by = $this->any_of_schema( array(
			$this->Name,
			$this->Identifier,
		) );

		$this->la_classified_as = $this->array_schema( $this->Concept );
	}

	/**
	 * Set schema.
	 *
	 * @return array
	 */
	public function set_schema() {
		return array(
			'title' => 'Metadata',
			'type' => 'object',
			'properties' => array()
		);
	}
}