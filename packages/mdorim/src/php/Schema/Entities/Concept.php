<?php

namespace Mdorim\Schema\Entities;

class Concept extends \Mdorim\Schema\Generator {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \Mdorim\Traits\Singleton;

	public function set_schema() {
		$metadata = \Mdorim\Schema\Metadata::get_instance();

		return array(
			'title' => 'Concept',
			'description' => 'A concept is an idea or notion; a unit of thought.',
			'type' => 'object',
			'properties' => array(
				'entity_id' => $metadata->get( 'entity_id' ),
			)
		);
	}
}