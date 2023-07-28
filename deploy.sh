#!/bin/zsh

echo 'deploy www'
ssh -i ~/.ssh/aws-front.pem ubuntu@3.35.228.254 ". ~/.nvm/nvm.sh && cd /srv/dropkitchen-front-www && bash ./run-deploy.sh"
