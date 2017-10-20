#!/bin/bash

# Script to create a genesis file PoA
# jq is required : npm install jq-cli-wrapper -g
# Example of use :
# server/scripts/generate_genesis_poa.sh network_name 44 55

echo "========= POA Arguments supplied=============="
echo "Network name (name of file): $1"
echo "Network Id: $2"
echo "Block time in seconds (default is 15s) : $3"
echo "Account to seal: 0x690f254f3efdea0263d65b6a73561bc22a144c87"
echo "========================================="
# Account to prefund are hardcoded (0000000000000000000000000000000000000000 to 0000000000000000000000000000000000000010)
# Account to seal is hardcoded (should be possible to add severals)

#Check name is not empty
if [ -z "$1" ]; 
then
  echo "ERROR: Please enter a network name. Exiting..."
  exit 1
fi

# Check that name doesn't exist already
if [ -f ./server/scripts/$1_poa.json ]
then
  echo "ERROR: File with this network name already exist. Exiting..."
  exit 1
fi

# Check network id is an int
re='^[0-9]+$'
if ! [[ "$2" =~ $re ]] ; then
  echo "ERROR: Network id is not a number. Exiting..."
  exit 1
fi

# Check block time is an int
if ! [[ "$3" =~ $re ]] ; then
  echo "ERROR: Block time is not a number. Exiting..."
  exit 1
fi

# Copy sample file to our file
cp ./server/scripts/sample_genesis_POA.json ./server/scripts/$1_poa.json

# TIMESTAMP
HEX_TSTAMP=$(printf '0x%x' $(date +%s))
jq --arg TIMESTAMP $HEX_TSTAMP '.timestamp = $TIMESTAMP' ./server/scripts/$1_poa.json > ./server/scripts/$1_poa.$$.json && mv ./server/scripts/$1_poa.$$.json ./server/scripts/$1_poa.json

# NETWORK ID
jq --arg NETWORKID $2 '.config.chainId = ($NETWORKID|tonumber)' ./server/scripts/$1_poa.json > ./server/scripts/$1_poa.$$.json  && mv ./server/scripts/$1_poa.$$.json ./server/scripts/$1_poa.json

# BLOCK TIME
jq --arg BLOCKTIME $3 '.config.clique.period = ($BLOCKTIME|tonumber)' ./server/scripts/$1_poa.json > ./server/scripts/$1_poa.$$.json  && mv ./server/scripts/$1_poa.$$.json ./server/scripts/$1_poa.json

echo "POA Genesis file $1_poa.json sucessfully created."
