#!/bin/zsh

echo 'deploy mango'
ssh -i ~/.ssh/aws-front.pem ubuntu@3.38.186.137 ". ~/.nvm/nvm.sh && cd /srv/dropkitchen-front-mango && bash ./run-deploy.sh"