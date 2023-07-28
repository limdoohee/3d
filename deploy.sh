#!/bin/zsh

echo 'deploy mango'
ssh -i ~/.ssh/aws-front.pem ubuntu@3.35.228.254 ". ~/.nvm/nvm.sh && cd /srv/dropkitchen-front-mango && bash ./run-deploy.sh"
