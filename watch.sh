#!/bin/bash

# Copyright 2019 Adobe
# All Rights Reserved.

# NOTICE: Adobe permits you to use, modify, and distribute this file in
# accordance with the terms of the Adobe license agreement accompanying
# it. If you have received this file from a source other than Adobe,
# then your use, modification, or distribution of it requires the prior
# written permission of Adobe. 

# this is the development watch script for those with access
# to the torq-native uxp runtime.
# it is assumed that it's installed to a peer directory.

source ~/.bashrc
nvm use 10

# ensure all child processes are killed when we exit this script.
trap "kill 0" SIGINT SIGTERM EXIT

(cd ../torq-native && node build inspector) &
(yarn watchSample) &
(sleep 15 && ../torq-native/build/out/bin/macos/v8/nativeui/Debug/demo.app/Contents/MacOS/demo --extension dist) &

wait

