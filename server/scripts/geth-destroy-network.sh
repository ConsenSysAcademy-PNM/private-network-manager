NETWORK_ID=$1

rm -rf ./server/networks/${NETWORK_ID}

bash ./server/scripts/geth-stop-network.sh
