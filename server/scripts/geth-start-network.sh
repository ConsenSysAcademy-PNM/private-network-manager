#!/bin/bash

NETWORK_NAME=$1
NETWORK_ID=$2
NUM_NODES=$3

counter=0
while [ $counter -lt $NUM_NODES ]
do
  echo "Starting Node $counter"
  port=$((30303+$counter))
  echo "Port: $port"
  rm -rf ./server/networks/${NETWORK_ID}/node-$counter
  geth --datadir ./server/networks/${NETWORK_ID}/node-$counter init ./server/scripts/${NETWORK_NAME}_pow.json
  cp ./server/scripts/base-account ./server/networks/${NETWORK_ID}/node-$counter/keystore/base-account
  if [ "$counter" -eq "0" ]; then
    MINE='--mine'
  else
    MINE=''
  fi
  screen -dmS "Node-$counter" geth --datadir ./server/networks/${NETWORK_ID}/node-${counter} --unlock "$BASE_ADDRESS" --password "./server/scripts/password.txt" --networkid $NETWORK_ID --port $port --bootnodes enode://$(cat ./server/networks/${NETWORK_ID}/enode)@127.0.0.1:30301 "$MINE" --rpc --rpcapi "eth,net,web3"
  echo "Started Node $counter"
  ((counter++))
done
