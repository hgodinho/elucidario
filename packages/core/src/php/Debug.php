<?php

/**
 * Debug class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR;

if (!defined('ABSPATH')) exit;

if (!defined('LCDR_PATH')) exit;

if (!class_exists('Debug')) {
    class Debug {
        /**
         * Var Dump especial que cita a classe, método, linha
         * e `die()` o WordPress por padrão
         *
         * @param mixed   $var | Valor a ser debugado.
         * @param string  $class | __CLASS__.
         * @param string  $method | __METHOD__.
         * @param string  $line | __LINE__.
         * @param boolean $die | Die WordPress on true - defaults to true.
         * @return void
         * 
         * **obs:** para esse método funcionar mais fluidamente é recomendável criar
         * snippet de código do chamado para o método no vscode passando as
         * constantes mágicas:
         *
         * - `__CLASS__`,
         * - `__METHOD__`,
         * - `__LINE__`.
         *
         * @see https://www.php.net/manual/pt_BR/language.constants.predefined.php
         *
         * @example
         * {
         *     "Var Dump Especial": {
         *    "scope": "php",
         *    "prefix": "dump",
         *    "body": [
         *        "LCDR\Debug::dump(${1:any}, __CLASS__, __METHOD__, __LINE__, ${3:true})"
         *    ],
         *    "description": "Var dump especial."
         *  },
         * }
         *
         * @echo mixed
         */
        public static function dump($var, $class, $method, $line, $die = true) {
            if (true === $die) {
                $wp = 'dead.';
            } else {
                $wp = 'breathing.';
            }

            $highlight_string =    highlight_string("<?php " . var_export($var, true) . "; ?>", true);

            echo '<p><strong>Class: ' . $class . ' | ';
            echo 'Method: ' . $method . ' | ';
            echo 'Line: ' . $line . ' | ';
            echo 'WordPress: ' . $wp;
            echo '</strong></p>';
            echo '<pre>';
            var_dump($highlight_string);
            echo '</pre>';
            echo '<p><strong>--- end</strong></p>';

            if (true === $die) {
                wp_die();
            }
        }
    }
}
