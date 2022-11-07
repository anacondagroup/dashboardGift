#!/bin/bash
set -euo pipefail

set -o allexport
source /vault/secrets/env || true
set +o allexport

# Setup variables
for VAR in $(compgen -v | grep REACT_APP_);do
  echo "[ $(date +"%Y-%m-%d %H:%M:%S.%N %:z") ] Entrypoint Setup: ${VAR} => ${!VAR}"
  sed -i "s|%${VAR}%|${!VAR}|g" /usr/share/nginx/html/index.html
done

exec "$@"
