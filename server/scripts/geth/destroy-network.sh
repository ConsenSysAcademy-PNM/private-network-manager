NETWORK_ID=$1
GENESIS_NAME=$2

rm -rf ./server/networks/${NETWORK_ID}
rm -f ./server/scripts/${GENESIS_NAME}.json