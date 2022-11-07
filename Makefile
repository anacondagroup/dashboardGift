# See:
# http://www.gnu.org/software/make/manual/make.html
# http://linuxlib.ru/prog/make_379_manual.html

EXEC_NODE      = docker-compose exec node
EXEC_NODE_ROOT = docker-compose exec --user=root node

.PHONY : rebuild

ifndef VERBOSE
.SILENT:
endif

# This allows us to accept extra arguments
%:
	@:
args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

rebuild: env
	docker-compose down --remove-orphans \
	&& docker-compose build --parallel \
	&& docker-compose up -d \
	&& docker-compose logs -f

env:
	test -e .env || cp .env.example .env

clean:
	rm -rf node_modules

shell:
	$(EXEC_NODE) bash

shell-root:
	$(EXEC_NODE_ROOT) bash

qa:
	$(EXEC_NODE) yarn qa