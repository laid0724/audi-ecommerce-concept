### Description

A conceptual eCommerce site built for my favorite car brand: Audi.

Stack: .NET Core 5, Angular 12, Tailwind CSS, Clarity, Audi UI.

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

### Deployment

Currently, I am hosting this on heroku (which uses pgsql as its db), with the angular app being served via .net. You will need the heroku cli installed in your system.

It is recommended that you generate your keys/password via https://passwordsgenerator.net/

1. Go to heroku and create a new app, and then under the resources tab, add the Heroku Postgres addon
2. Go to settings tab, and under Config Vars, enter the key:value pair settings of your `appsetting.json`
3. Login to heroku via its CLI and add heroku to your remote: `heroku git:remote -a {appName}`
4. Set dotnetcore buildpack for the app: `heroku buildpacks:set https://github.com/jincod/dotnetcore-buildpack`
5. Set your heroku environment to production: `heroku config:set ASPNETCORE_ENVIRONMENT=Production`
6. Build production output of angular project: `cd client` and `npm run build` and commit them the output to the codebase (do not gitignore these, heroku needs the file!)
7. Deploy dotnet project: `git push heroku master`

Once you've setup your heroku app, you can just repeat steps 6 & 7 for continuous deployment, unless you need to add further environment variables.

**heroku is fucking slow since the only hosting options are in US/Europe, i need a better free alternative that supports node.js / dotnet.
it also fucking shuts down when it hasn't been accessed in a while, and boots up only when someone visits the site, which takes forever too.**

---

##### Features to be implemented / Bugs to be fixed, in no particular order:

#### API

- add about us to dynamic document controller
- Order creation email and status update email template UI
- email / messaging / inbox functionality
  - inbox system for users, admin can send promo messages to them
  - notification system for pushing notification to users
- SignalR for live chat
- site-wide search
- Statistics table and repo / controller

#### Angular Sys Project

- add about us dynamic document module / update service
- sys inbox
- live chat module with signalr
- ngx charts for statistics

#### Angular Public Project

- convert to Angular universal
- update user info
- member's area
- checkout / order
- cancel / track order
- articles, e.g., news, events, promotions, faq, about us
- search
- live chat

#### Deployment

- figure out how to host multiple angular projects in the same domain via different urls. nginx maybe?
