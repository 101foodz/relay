#!/bin/bash

clear

# --------------------
# GET SOURCES
# --------------------
# NOTE: Repo must be passed via akash deployment file
# REPO=https://github.com/101foodz/relay.git
# git clone $REPO

# --------------------
# GET SOURCES
# --------------------
# NOTE: Uri must be passed via akash deployment file
# SETTINGS_URI=https://gist.githubusercontent.com/unameit10000000/b4ad213a56fbc04a5d5a70825fd20964/raw/settings.json

SETTINGS_DATA=$(curl -s $SETTINGS_URI)
API_URI=$(echo $SETTINGS_DATA | jq -r '.api')       && echo "API_URI=$API_URI" > .env
GUN_PUB=$(echo $SETTINGS_DATA | jq -r '.pub')       && echo "GUN_PUB=$GUN_PUB" >> .env
GUN_ROOT=$(echo $SETTINGS_DATA | jq -r '.root')     && echo "GUN_ROOT=$GUN_ROOT" >> .env
GUN_PEERS=$(echo $SETTINGS_DATA | jq -r '.peers')   && echo "GUN_PEERS=$GUN_PEERS" >> .env

# echo "API_URI=$API_URI" > .env
# echo "GUN_PUB=$GUN_PUB" >> .env
# echo "GUN_ROOT=$GUN_ROOT" >> .env
# echo "GUN_PEERS=$GUN_PEERS" >> .env

# --------------------
# RUN
# --------------------
node relay.js