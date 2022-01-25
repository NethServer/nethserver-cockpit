#!/bin/bash

#
# push the string automaticaly to transifex once the PR has been merged
# https://docs.transifex.com/transifex-github-integrations/github-tx-client#integrating-the-client-with-travis-ci

if [[ "$TRAVIS_BRANCH" != "master" ]]; then
  echo "We are not on the master branch. We push translation only on master"
  # analyze current branch and react accordingly
  exit 0
fi

if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "We are on a pull request. We push translation only after the PR merge"
  # analyze current state PR merged or PR and react accordingly
  exit 0
fi


pip install virtualenv
virtualenv ~/env
source ~/env/bin/activate
pip install transifex-client
echo $'[https://www.transifex.com]\nhostname = https://www.transifex.com\nusername = '"api"$'\npassword = '"$TRANSIFEX_API_TOKEN"$'\n' > ~/.transifexrc
tx push -s
