#! /bin/bash
FILE="../../networks/$1/node-0/geth.ipc"
if [ -e $FILE ]; then
echo "running"
else
echo "stopped"
fi
