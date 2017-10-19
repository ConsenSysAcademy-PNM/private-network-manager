#!/bin/bash

NETWORK_NAME=$1
NUM_NODES=$2

BASE_ADDRESS="0x690f254f3efdea0263d65b6a73561bc22a144c87"

# if ! [ -x "$(command -v bootnode)" ]; then
  # echo "no bootnode"
  # TODO: Fix for Chris because bootnode not working
  # alias bootnode=/Users/chrissmith/go-ethereum/build/bin/bootnode
# fi

# Packages Needed:
## screen
## jq

NETWORK_ID=$(jq -r '.config | .chainId' ./server/scripts/${NETWORK_NAME}.json)

mkdir -p ./server/${NETWORK_ID}/

bootnode -genkey ./server/${NETWORK_ID}/${NETWORK_NAME}.key -writeaddress
bootnode -nodekey ./server/${NETWORK_ID}/${NETWORK_NAME}.key -writeaddress > ./server/${NETWORK_ID}/enode

echo "Starting bootnode"
screen -dmS 'Bootnode' bootnode -nodekey ./server/${NETWORK_ID}/${NETWORK_NAME}.key -verbosity 6
echo "Started bootnode"

bash ./server/scripts/geth-start-network.sh $NETWORK_NAME $NETWORK_ID $NUM_NODES

# counter=0
# while [ $counter -lt $NUM_NODES ]
# do
#   echo "Starting Node $counter"
#   port=$((30303+$counter))
#   echo "Port: $port"
#   rm -rf ./server/${NETWORK_ID}/node-$counter
#   geth --datadir ./server/${NETWORK_ID}/node-$counter init ./server/scripts/${NETWORK_NAME}.json
#   cp ./server/scripts/base-account ./server/${NETWORK_ID}/keystore/base-account
#   screen -dmS "Node-$counter" geth --datadir ./server/${NETWORK_ID}/node-${counter} --unlock $BASE_ADDRESS --password 'testacc1' --networkid $NETWORK_ID --port $port --bootnodes enode://$(cat ./server/${NETWORK_ID}/enode)@127.0.0.1:30301 --mine --rpc --rpcapi "eth,net,web3"
#   echo "Started Node $counter"
#   ((counter++))
# done
