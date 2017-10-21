#!/bin/bash

echo "Stopping all networks"
screen -ls | grep Detached | cut -d. -f1 | awk '{print $1}' | xargs kill
find server/networks/ -name 'geth.ipc' -print0 | xargs -0 rm -f
echo '' 2> ./screenlog.0
ps aux | grep -ie geth | grep -v grep | grep -v login | awk '{print $2}'
