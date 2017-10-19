#!/bin/bash

# Script to create a genesis file PoW
# jq is required : npm install jq-cli-wrapper
# Example of use :
# ./generate_genesis_pow.sh network_name 22 0x6265000000000000000000000000000000000000000000000000000000000000

echo "=========Arguments supplied=============="
echo "Network name (name of file) to delete: $1"
echo "========================================="
# Account to prefund are hardcoded (0000000000000000000000000000000000000000 to 0000000000000000000000000000000000000010)

#Check network name is not empty
if [ -z "$1" ];
then
  echo "ERROR: Please enter a network name. Exiting..."
  exit 1
fi

#Check that genesis file exist
if ls ./server/scripts/$1* 1> /dev/null 2>&1; then
	rm ./server/scripts/$1_pow.json > /dev/null
	rm ./server/scripts/$1_poa.json > /dev/null
    echo "Genesis file $1 sucessfully deleted."
else
    echo "This genesis does not exist"
    exit 1
fi


