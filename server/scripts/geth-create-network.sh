#!/bin/bash

NETWORK_NAME=$1
echo $NETWORK_NAME

# if ! [ -x "$(command -v bootnode)" ]; then
  # echo "no bootnode"
  # TODO: Fix for Chris because bootnode not working
  # alias bootnode=/Users/chrissmith/go-ethereum/build/bin/bootnode
# fi

bootnode -genkey ./server/nodes/${NETWORK_NAME}.key -writeaddress
bootnode -nodekey ./server/nodes/${NETWORK_NAME}.key -writeaddress > ./server/nodes/enode

echo "Starting bootnode"
screen -dmS 'Bootnode' bootnode -nodekey ./server/nodes/${NETWORK_NAME}.key -verbosity 6
echo "Started bootnode"

echo "Starting Node 1"
rm -rf ./server/nodes/node1
geth --datadir ./server/nodes/node1 init ./server/scripts/${NETWORK_NAME}.json
screen -dmS 'Node1' geth --datadir ./server/nodes/node1 --networkid 40851 --port 30303 --bootnodes enode://$(cat ./server/nodes/enode)@127.0.0.1:30301
echo "Started Node 1"

echo "Starting Node 2"
rm -rf ./server/nodes/node2
geth --datadir ./server/nodes/node2 init ./server/scripts/${NETWORK_NAME}.json
screen -dmS 'Node2' geth --datadir ./server/nodes/node2 --networkid 40851 --port 30304 --bootnodes enode://$(cat ./server/nodes/enode)@127.0.0.1:30301
echo "Started Node 2"

echo "Starting Node 3"
rm -rf ./server/nodes/node3
geth --datadir ./server/nodes/node3 init ./server/scripts/${NETWORK_NAME}.json
screen -dmS 'Node3' geth --datadir ./server/nodes/node3 --networkid 40851 --port 30305 --bootnodes enode://$(cat ./server/nodes/enode)@127.0.0.1:30301
echo "Started Node 3"

