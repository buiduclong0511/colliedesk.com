#!/bin/sh
# Prints a version of the product docs the site renders: the git object ids of docs/user and
# ROADMAP.md in the product checkout given as $1. It changes exactly when their content changes,
# so the scheduled workflow can compare it with the copy published at /product-docs-version.txt.
set -eu
dir=${1:?usage: product-docs-version.sh PRODUCT_DIR}
ids=$(git -C "$dir" rev-parse HEAD:docs/user HEAD:ROADMAP.md)
echo "$ids" | paste -sd " " -
