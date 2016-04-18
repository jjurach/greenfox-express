#!/bin/bash
npm install
tdir=tmp-$$-$RANDOM

mkdir $tdir
cp -a server.js lib node_modules $tdir/

grep -B10000 %env Dockerfile.in | egrep -v %env > $tdir/Dockerfile
(cat apiKey.properties | sed -ne 's/apiKey.id *= */ENV STORMPATH_CLIENT_APIKEY_ID /p'
 cat apiKey.properties | sed -ne 's/apiKey.secret *= */ENV STORMPATH_CLIENT_APIKEY_SECRET /p'
 cat apiKey.properties | sed -ne 's/api.href *= */ENV STORMPATH_APPLICATION_HREF /p'
 echo ENV PORT 8080
) >> $tdir/Dockerfile
grep -A10000 %env Dockerfile.in | egrep -v %env >> $tdir/Dockerfile

(cd $tdir; docker build -t jjurach/greenfox-express .)
rm -rf $tdir
