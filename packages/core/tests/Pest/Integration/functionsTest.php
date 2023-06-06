<?php

use Yoast\WPTestUtils\WPIntegration\TestCase;

if (isUnitTest()) {
    return;
}

uses(TestCase::class);

beforeEach(function () {
    parent::setUp();
});

afterEach(function () {
    parent::tearDown();
});

test('verifica se funções foram corretamente carregadas', function () {
    $this->assertNotFalse(function_exists('lcdr_activate_plugin_hook'));

    $this->assertNotFalse(function_exists('lcdr_deactivate_plugin_hook'));

    $this->assertNotFalse(function_exists('lcdr_uninstall_plugin_hook'));
});
