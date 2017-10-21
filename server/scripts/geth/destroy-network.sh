NETWORK_ID=$1
GENESIS_NAME=$2

echo $GENESIS_NAME

rm -rf ./server/networks/${NETWORK_ID}
rm -f ./server/scripts/${GENESIS_NAME}.json