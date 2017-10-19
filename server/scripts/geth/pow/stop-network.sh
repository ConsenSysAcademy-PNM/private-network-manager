#!/bin/bash

echo "Stopping all networks"
screen -ls | grep Detached | cut -d. -f1 | awk '{print $1}' | xargs kill
ps aux | grep -ie geth | grep -v grep | grep -v login | awk '{print $2}' #| xargs kill