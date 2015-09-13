#!/usr/bin/env bash

pg_ctl init -D $PG_DATA

pg_ctl start -D $PG_DATA

createdb -w $DB_NAME
