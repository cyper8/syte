#!/bin/bash

[ ${REQUEST_METHOD:-"GET"} == "POST" ] && { cat >> ./.wall && cat ./.wall && exit 0; };
[ ${QUERY_STRING:-""} == "users" ] && { cat ./.users && exit 0; }
cat ./.wall || echo -n "FAIL"
