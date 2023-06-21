<?php

/**
 * Config class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Options;

if (!defined('ABSPATH')) exit;

if (!defined('LCDR_PATH')) exit;

if (!class_exists('\LCDR\Options\Config')) {
    class Config {
        public function __construct() {
            // \LCDR\Debug::dump('ola mundo', __CLASS__, __METHOD__, __LINE__, true);
        }
    }
}
