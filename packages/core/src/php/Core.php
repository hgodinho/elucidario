<?php

/**
 * Core class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR;

if (!defined('ABSPATH')) exit;

if (!defined('LCDR_PATH')) exit;

if (!class_exists('Core')) {
    class Core {
        public $options;
        public $schema;

        public function __construct() {
            $this->schema = new \LCDR\DB\Schema();
            $this->options = new \LCDR\Options\Core();

            add_action('init', array($this, 'textdomain'));
        }

        public function textdomain() {
            $domain = 'lcdr';
            $locale = apply_filters('plugin_locale', get_locale(), $domain);
            \load_textdomain($domain, LCDR_PATH . "languages/php-{$domain}-{$locale}.mo");
        }
    }
}
