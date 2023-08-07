#!/bin/bash

# This script is used to run tests in CI.

run_node_tests() {
    echo "Running node tests..."
    pnpm run test
}

run_php_tests() {
    echo "Running php tests..."
    composer run-script test:integration
}

# run_node_tests
run_php_tests

# Verify exit status of tests
if [ $? -eq 0 ]; then
    echo "Tests passed"
    exit 0
else
    echo "Tests failed"
    exit 1
fi
