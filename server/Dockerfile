FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /app

COPY ./Audi.sln ./
COPY ./Audi/Audi.csproj  ./Audi/Audi.csproj
RUN dotnet restore Audi

COPY . ./
COPY docker-env.sh docker-env.sh
RUN chmod u+x docker-env.sh && ./docker-env.sh
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app

COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Audi.dll"]