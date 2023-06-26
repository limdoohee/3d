#!/bin/zsh

echo 'deploy plum'
ssh -i ~/.ssh/aws-front.pem ubuntu@3.38.186.137 ". ~/.nvm/nvm.sh && cd /srv/dropkitchen-front-plum && bash ./run-deploy.sh"
