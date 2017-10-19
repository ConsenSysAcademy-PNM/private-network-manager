#! /bin/bash
FILE="/home/ibrahim/DAPP/ethereum/$1/node-0/geth.ipc"
if [ -e $FILE ]; then
echo "true"
else
echo "false"
fi
