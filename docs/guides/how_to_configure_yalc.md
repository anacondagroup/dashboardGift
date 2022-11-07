### Yalc configuration for SPA guide

1. Add following lines to the `.gitignore`
   ```typescript
   .yalc/
   yalc.lock
   ```
2. You should use `yalc add` to install local builds of packages.\
you need to add `yalc:link` shorthand to `package.json` which will install all required packages.\
   **Example:**
   ```
     "yalc:link": "yalc add @alycecom/modules @alycecom/services @alycecom/ui @alycecom/hooks @alycecom/utils"
   ```
3. `yalc add` changes the versions of installed packages in package.json on the links to your file system.\
Before commit anything you should run `yalc retreat --all` to rollback yalc changes for `package.json`, to do it 
automatically on commit - you need to update husky `pre-commit.sh`:
   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   [ -x "$(command -v yalc)" ] && yalc retreat --all && git add package.json
   yarn install --check-files
   yarn run precommit
   ```