NETWORK_ID=$1

rm -rf ../networks/${NETWORK_ID}

bash ./server/scripts/geth-stop-network.sh
