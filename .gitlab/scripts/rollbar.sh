#!/usr/bin/env bash
set -euo pipefail

echo "Rollbar:" "Collect and upload sourcemap for revision: $CI_COMMIT_SHA. Branch: $CI_COMMIT_REF_NAME"

buildPath="/usr/share/nginx/html/static/js"
for path in $(find $buildPath -name "*.js"); do
  filename=$(basename -- "$path")
  url="https://dashboard.alyce.com/static/js/${filename}"

  # a path to a corresponding source map file
  source_map="@$path.map"
  echo "Rollbar:" "Uploading source map for $url"

  curl --silent --show-error --retry 3 --retry-delay 5 --retry-connrefused --fail https://api.rollbar.com/api/1/sourcemap \
    -F access_token=${ROLLBAR_TOKEN} \
    -F version=$CI_COMMIT_SHA \
    -F minified_url=$url \
    -F source_map=$source_map \
    >/dev/null
done
