<?php

/**
 * Notices class.
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Utils;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

class Notices {
	/**
	 * Tipo de notice
	 *
	 * @var 'error' | 'warning' | 'success' | 'info'
	 */
	public $type = 'info';

	/**
	 * Mensagem
	 *
	 * @var string
	 */
	public $message = '';

	/**
	 * Notificação
	 *
	 * @param string $message Mensagem.
	 * @return void
	 */
	public function add_notice( $message ) {
		$this->message = $message;
		add_action( 'admin_notices', array( $this, 'notice_html' ) );
	}

	/**
	 * Erro
	 *
	 * @param string $message Mensagem de erro.
	 * @return void
	 */
	public function add_error( $message ) {
		$this->type = 'error';
		$this->add_notice( $message );
	}

	/**
	 * Sucesso
	 *
	 * @param string $message Mensagem de success.
	 * @return void
	 */
	public function add_success( $message ) {
		$this->type = 'success';
		$this->add_notice( $message );
	}

	/**
	 * Aviso
	 *
	 * @param string $message Mensagem de aviso.
	 * @return void
	 */
	public function add_warning( $message ) {
		$this->type = 'warning';
		$this->add_notice( $message );
	}

	/**
	 * Informação
	 *
	 * @param string $message Mensagem de informação.
	 * @return void
	 */
	public function add_info( $message ) {
		$this->type = 'info';
		$this->add_notice( $message );
	}

	/**
	 * HTML da notificação
	 *
	 * @return void
	 */
	public function notice_html() {
		$classes = array(
			'notice',
		);
		if ( in_array( $this->type, array( 'error', 'warning', 'success', 'info' ), true ) ) {
			$type = 'notice-' . $this->type;
			array_push( $classes, $type );

			// if notice type is different than error or warning than notice is dismissible.
			if ( ! in_array( $this->type, array( 'error', 'warning' ) ) ) {
				array_push( $classes, 'is-dismissible' );
			}
		}
		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( implode( ' ', $classes ) ), $this->message );
	}
}