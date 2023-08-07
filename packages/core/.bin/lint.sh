#!/bin/bash

# This script is used to run lint in CI.

run_node_lint() {
    echo "Running node lint..."
    pnpm run lint
}

run_php_lint() {
    echo "Running php lint..."
    composer run-script phpcbf
}

# run_node_lint
run_php_lint

# Verify exit status of lint
if [ $? -eq 0 ]; then
    echo "Lint passed"
    exit 0
else
    echo "Lint failed"
    exit 1
fi
