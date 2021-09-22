if [ ${ENV}="PROD" ]; then
    npm run build
else
    npm run build:docker
fi
