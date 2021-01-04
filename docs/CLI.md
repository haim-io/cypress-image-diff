# CLI

## Update baseline client option

In order to reduce manual work a cli option is available to copy over the comparison images into the baseline folder when there is a test failure.

### Update all baseline images for failing tests

Notice that you should run this command after the test suite runs. The below command will only update baseline images that have a diff image, which basically means a test failure.

`$ cypress-image-diff -u`

It's important that you ensure the comparison image is the correct representation of the page under test as it will be copied over to the baseline.

### Update a list of baseline images

This functionality is yet to be developed.
