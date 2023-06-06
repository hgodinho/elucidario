<?php

beforeEach(function () {
    include dirname(__DIR__, 3) . '/src/php/utils.php';
});

test('lcdr_hook', function () {
    expect(lcdr_hook(['test']))->toBe('lcdr_test');
});
