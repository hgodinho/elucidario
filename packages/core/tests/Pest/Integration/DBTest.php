<?php

namespace LCDR\Tests\Pest\Integration;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if (isUnitTest()) {
    return;
}
uses(TestCase::class);

beforeEach(function () {
    parent::setUp();
    global $wpdb;

    $this->charset = $wpdb->get_charset_collate();
});

afterEach(function () {
    parent::tearDown();
});

test('Schema class', function () {
    $schema = new \LCDR\DB\Schema();
    expect($schema)->toBeInstanceOf(\LCDR\DB\Schema::class);
    expect($schema->wpdb)->toBeInstanceOf(\wpdb::class);
});

test('criação da db table wp_lcdr', function () {
    $schema = new \LCDR\DB\Schema();
    expect($schema->create_lcdr())->toBeTrue();
});
