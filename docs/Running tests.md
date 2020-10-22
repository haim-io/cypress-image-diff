# Tests

Before you run any of the test command below ensure to build the image:

`make build`

## Linting

`make lint-test`

## Unit tests

`make unit-test`

## E2E tests

`make e2e-test`

## Please notice

It's important that you run the tests in the container as it will have a single resolution setup for everyone.

If the tests are executed locally, depending on your screen resolution the results can differ.
