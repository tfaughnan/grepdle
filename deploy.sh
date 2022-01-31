#!/bin/sh

. ./config

rsync \
    -rtvzP \
    --delete \
    ~/src/grepdle/www/ \
    "root@$SERVER:/var/www/grepdle"
