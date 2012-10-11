#!/bin/sh
watch -n 15 "node statsWorker.js  && cp stats.json statsDone.json"