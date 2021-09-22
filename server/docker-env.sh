if [ ${ENV}="PROD" ]; then
    ASPNETCORE_ENVIRONMENT=Production
else
    ASPNETCORE_ENVIRONMENT=LocalDocker
fi
