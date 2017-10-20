#!/bin/bash

NETWORK_NAME=$1
NUM_NODES=$2
TYPE=$3

BASE_ADDRESS="0x690f254f3efdea0263d65b6a73561bc22a144c87"

# if ! [ -x "$(command -v bootnode)" ]; then
  # echo "no bootnode"
  # TODO: Fix for Chris because bootnode not working
  # alias bootnode=/Users/chrissmith/go-ethereum/build/bin/bootnode
# fi

# Packages Needed:
## screen
## jq

NETWORK_ID=$(jq -r '.config | .chainId' ./server/scripts/${NETWORK_NAME}_${TYPE}.json)

mkdir -p ./server/networks/${NETWORK_ID}/

bootnode -genkey ./server/networks/${NETWORK_ID}/${NETWORK_NAME}.key -writeaddress
bootnode -nodekey ./server/networks/${NETWORK_ID}/${NETWORK_NAME}.key -writeaddress > ./server/networks/${NETWORK_ID}/enode

echo "Starting bootnode"
screen -dmS 'Bootnode' bootnode -nodekey ./server/networks/${NETWORK_ID}/${NETWORK_NAME}.key -verbosity 6
echo "Started bootnode"

bash ./server/scripts/geth/start-network.sh $NETWORK_NAME $NETWORK_ID $NUM_NODES $TYPE
