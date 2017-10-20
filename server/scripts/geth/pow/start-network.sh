#!/bin/bash

NETWORK_NAME=$1
NETWORK_ID=$2
NUM_NODES=$3

BASE_ADDRESS=0x690f254f3efdea0263d65b6a73561bc22a144c87

counter=0
while [ $counter -lt $NUM_NODES ]
do
  echo "Starting Node $counter"
  port=$((30303+$counter))
  echo "Port: $port"
  rm -rf ./server/networks/${NETWORK_ID}/node-$counter
  geth --datadir ./server/networks/${NETWORK_ID}/node-$counter init ./server/scripts/${NETWORK_NAME}_pow.json
  cp ./server/scripts/geth/base-account ./server/networks/${NETWORK_ID}/node-$counter/keystore/base-account
  
  if [ "$counter" -eq "0" ]; then
    # UNLOCK="--unlock $BASE_ADDRESS"
    MINE="--unlock $BASE_ADDRESS --password ./server/scripts/geth/password.txt" # --mine"
    # MINE="--mine"
  else
    MINE=''
  fi
  echo geth --datadir ./server/networks/$NETWORK_ID/node-$counter --networkid $NETWORK_ID --port $port --bootnodes enode://$(cat ./server/networks/$NETWORK_ID/enode)@127.0.0.1:30301 $MINE --rpc --rpcapi eth,net,web3
  screen -dmS "Node-$counter" geth --datadir ./server/networks/$NETWORK_ID/node-$counter --networkid $NETWORK_ID --port $port --bootnodes enode://$(cat ./server/networks/$NETWORK_ID/enode)@127.0.0.1:30301 $MINE --rpc --rpcapi eth,net,web3
  echo "Started Node $counter"
  ((counter++))
done
