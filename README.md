### Description

A conceptual eCommerce site with a full-fledged CMS built for my favorite car brand: Audi.

Stack: .NET Core 5, Postgresql, Angular 12, Tailwind CSS, Clarity, Audi UI.

---

### Setup

Database is being hosted on a dockerized pg sql instance. If you do not have docker, install docker and setup docker container (see, e.g., https://hub.docker.com/_/postgres):

`docker run --name {dockerContainerName} -e POSTGRES_USER={userName} -e POSTGRES_PASSWORD={password} -p {portToBindToPostgres}:5432 -d postgres:latest`

1. get a cloudinary account, and update the fields in `CloudinarySettings` of your `appsettings.json` with your credentials.
2. create a `appsettings.Development.json` file under `API`, copy the properties from `appsettings.json` and fill them out. Make sure you are pointing your database connection to a pgsql db.
3. `cd` to `API`, run `dotnet restore`, and set your aspnetcore environment to `Development`
4. run `dotnet watch run` to setup db, seed data, and spin up APIs
5. `cd` to `client` and run `npm i`
6. run `npm run start:public` or `npm run start:sys` to spin up angular project accordingly
7. have fun!

---

### Dotnet API

`cd` to `server/Audi`

Generate Initial Migrations:

`dotnet ef migrations add InitialCreate -o Data/Migrations`

Generate Migrations:

`dotnet ef migrations add ${MigrationName}`

Remove Migrations:

`dotnet ef migrations remove`

Apply Migrations/Create Database:

`dotnet ef database update`

Drop Db:

`dotnet ef database drop`

Run Project:

`dotnet watch run`

Note: seed data can be generated via: https://www.json-generator.com/

To quickly convert the models to typescript interfaces, use the JSON to TS extension in VSCode and paste the returned values from the API there.

---

### Angular

`cd` to `client`

`npm i`

Run ecommerce site project:

`npm run start:public`

Run backend CMS project:

`npm run start:sys`

---

### Docker

To run this project via docker, run the following commands in your terminal:

1. In the root folder, run `docker-compose build` to build the docker image
2. Then, after the image is built, run `docker-compose up -d` to launch the image in the background process

Notes:

- the pgsql db is run internally on 5432 port of the docker VM, exposed by docker on 5439 port
- the dotnet api is run internally on 8800 port of the docker VM, exposed by docker on 6578 port
  - API endpoint: localhost:6578/api
  - Swagger endpoint: localhost:6578/swagger
- the angular project is run internally on 80 port of the docker VM, exposed by docker on 8080 port
  - public project: localhost:8080
  - sys project: localhost:8080/sys/

For documentation on how this is setup, see:

- https://medium.com/geekculture/docker-net-core-5-0-angular-11-nginx-and-postgres-on-the-google-cloud-platform-pt-1-363160e34439

---

### Deployment

GCP

For documentation on how this works, see:

- - https://medium.com/geekculture/docker-net-core-5-0-angular-11-nginx-and-postgres-on-the-google-cloud-platform-pt-2-a8b32167e183

---

##### Features to be implemented / Bugs to be fixed, in no particular order:

#### API

- Email Template UI for all system emails (order placed, order status update, sign up, forget pw, etc.)
- SignalR for live chat
- site-wide search
- email / messaging / inbox functionality
  - inbox system for users, admin can send promo messages to them
  - notification system for pushing notification to users
- Statistics table and repo / controller

#### Angular Sys Project

- live chat module with signalr
- sys inbox thread with users
- notification push system
- ngx charts for statistics

#### Angular Public Project

- convert to Angular universal
- live chat
- site-wide search
- inbox thread between user and moderator
- notification system