#! /bin/bash
FILE="./server/networks/$1/node-0/geth.ipc"
if [ -e $FILE ]; then
echo "running"
else
echo "stopped"
fi
