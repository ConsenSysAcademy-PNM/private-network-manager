#!/bin/bash

# Script to create a genesis file PoW or PoA
# jq is required : npm install jq-cli-wrapper
# Example of use :
# ./generate_genesis.sh pow network_name 22 0x6265000000000000000000000000000000000000000000000000000000000000

echo "=========Arguments supplied=============="
echo "pow or poa: $1"
echo "Network name (name of file): $2"
echo "Network Id: $3"
echo "Data to put in genesis file as hex: $4"
echo "========================================="
# Account to prefund are hardcoded (0000000000000000000000000000000000000000 to 0000000000000000000000000000000000000010)

# Check $1 is pow or poa
if [ "$1" != "pow" -a "$1" != "poa" ]
then
  echo "ERROR: Please use pow or poa as first argument. Exiting..."
  exit 1
fi

# Check that name doesn't exist already
if [ -f ./$2_pow.json ]
then
  echo "ERROR: File with this network name already exist. Exiting..."
  exit 1
fi

# Check network id is an int
re='^[0-9]+$'
if ! [[ "$3" =~ $re ]] ; then
   echo "ERROR: Network id is not a number. Exiting..."
   exit 1
fi

# check data is an hex if not empty
if [ ! -z "$4" ]; 
then
	if [ "${#4}" != 66 ] ; then
	   echo "ERROR: Extra data is not 66 chars. Exiting..."
	   exit 1
	fi
	hex='0[xX][0-9a-fA-F]+'
	if ! [[ "$4" =~ $hex ]] ; then
	   echo "ERROR: Extra data is not hex. Exiting..."
	   exit 1
	fi
fi

## IF POW
if [ "$1" == "pow" ]
then

	# Copy sample file to our file
	cp sample_genesis_POW.json $2_pow.json
	# NETWORK ID
	jq --arg NETWORKID $3 '.config.chainId = ($NETWORKID|tonumber)' $2_pow.json > $2_pow.$$.json  && mv $2_pow.$$.json $2_pow.json

	# Data to put in genesis file
	if [ ! -z "$4" ]; 
	then
		jq --arg EXTRADATA $4 '.extraData = $EXTRADATA' $2_pow.json > $2_pow.$$.json && mv $2_pow.$$.json $2_pow.json
	fi

	echo "POW Genesis file $2_pow.json sucessfully created."

elif [ "$2" == "poa" ]
then
## IF POA

	# To remove
	cp sample_genesis_POW.json kk
fi
