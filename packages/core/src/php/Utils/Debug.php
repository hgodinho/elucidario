<?php
/**
 * Debug class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Utils;

use DateTimeZone;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}

/**
 * Debug class.
 */
trait debug {
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
	public static function dump( $type, $var, $class, $method, $line, $die = true ) {
		if ( true === $die ) {
			$wp = 'dead.';
		} else {
			$wp = 'breathing.';
		}
		switch ( $type ) {
			case 'browser':
				self::browser_dump( $var, $class, $method, $line, $wp );
				break;
			case 'cli':
			default:
				self::cli_dump( $var, $class, $method, $line, $wp );
				break;
		}
	}

	public static function browser_dump( $var, $class, $method, $line, $wp ) {
		$var = highlight_string( '<?php ' . var_export( $var, true ) . '; ?>', true );
		echo '<p><strong>Class: ' . $class . ' | ';
		echo 'Method: ' . $method . ' | ';
		echo 'Line: ' . $line . ' | ';
		echo 'WordPress: ' . $wp;
		echo '</strong></p>';

		echo '<p><strong>--- start</strong></p>';
		echo '<pre>';
		var_dump( $var );
		echo '</pre>';
		echo '<p><strong>--- end</strong></p>';

		if ( 'dead.' === $wp ) {
			wp_die();
		}
	}

	public static function cli_dump( $var, $class, $method, $line, $wp = true ) {
		echo "\nClass: " . $class . " | ";
		echo "Method: " . $method . " | ";
		echo "Line: " . $line . " | ";
		echo "WordPress: " . $wp . "\n\n";

		echo "--- start\n";
		var_dump( $var );
		echo "--- end\n\n";

		if ( "dead." === $wp ) {
			wp_die();
		}
	}

	/**
	 * Log
	 *
	 * @param $msg | Mensagem a ser logada.
	 * @param string $title | Título do log.
	 * @param string $method | __METHOD__.
	 * @param string $line | __LINE__.
	 * @return void
	 */
	public static function log( $msg, $title, $method, $line ) {
		$date = new \DateTime( 'now', new DateTimeZone( 'America/Sao_Paulo' ) );
		$date = $date->format( 'Y-m-d H:i:s' );
		if ( is_bool( $msg ) ) {
			$msg = print( $msg );
		} else {
			$msg = print_r( $msg, true );
		}
		$log = '[' . $date . ']' . "\n<br>" .
			'@method: **' . $method . "**\n<br>" .
			'@linha: **' . $line . "**\n<br>**" .
			$title . "**\n\n```php\n" . $msg . "\n```\n\n---\n\n";
		self::file_force_contents( LCDR_PATH . 'log', $log );
	}

	/**
	 * File force contents
	 *
	 * cria a pasta se não houver.
	 *
	 * @param string $dir | Diretório.
	 * @param mixed  $contents | Conteúdo.
	 * @return void
	 */
	public static function file_force_contents( $dir, $contents ) {
		$file = 'debug.md';
		if ( ! is_dir( $dir ) ) {
			mkdir( $dir, 0777, true );
		}
		file_put_contents( "$dir/$file", $contents, FILE_APPEND );
	}

	/**
	 * Apaga o log
	 *
	 * @return boolean
	 */
	public static function erase_special_log() {
		$log = file_put_contents( dirname( plugin_dir_path( __FILE__ ) ) . '/log/debug.log', '' );
		if ( false === $log ) {
			return false;
		} else {
			return true;
		}
	}
}