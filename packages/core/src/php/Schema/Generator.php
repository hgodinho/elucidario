<?php

/**
 * Generator class
 * 
 * @author Henrique Godinho <henrique@hgod.in>
 * @package @elucidario/pkg-core
 * @since 0.1.0
 * 
 * @requires @elucidario/pkg-mdorim
 */

namespace LCDR\Schema;

/**
 * Generator class
 * 
 * Importa as definições em json do @elucidario/pkg-mdorim e converte em metadados para ser utilizado no WordPress
 * Os metadados podem ser utilizados no contexto de CPT, taxonomias, e API REST.
 */
class Generator {
    /**
     * JSON Schema
     *
     * @var \JsonSchema\Constraints\ObjectConstraint
     */
    public $json_schema;

    public function __construct($json_schema_file = null) {
        if (!is_null($json_schema_file)) {
            $json_schema_file = LCDR_PATH . 'src/json-schema.json';
            $this->set_json_schema($json_schema_file);
        } else {
            $this->json_schema = null;
        }
    }

    /**
     * Get JSON Schema
     *
     * @param string $json_schema_file
     * @return void
     */
    public function set_json_schema($json_schema_file) {
        $this->json_schema = json_decode(file_get_contents($json_schema_file));
    }
}
