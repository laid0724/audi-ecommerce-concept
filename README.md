### Description

A conceptual eCommerce site built for my favorite car brand: Audi.

Stack: .NET Core 5, Angular 12, Tailwind CSS, Clarity, Audi UI packages.

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

---
##### Features to be implemented / Bugs to be fixed, in no particular order:

#### API

- Statistics table and repo / controller
- Order table and repo / controller
** these need language property zh/en **
- add photo property to product category
- Photo table and repo / controller
- Article table and repo / controller
- Carousel table and repo / controller
**
- SignalR for live chat
- users management
  - change pw, confirm email, disable acct, lockout, reset password, forget username etc.
- email functionality

#### Sys
- homepage banner module
- news / event / announcement module
- ngx charts for statistics
- user management module
- ng select control value accessor
- live chat module with signalr
- q & a management module
- user complaints / forms module, bind this to email
- user like product 1-to-M
- add photo to product category

#### Public

- RWD
- Angular universal
- Tailwind css
- fullpage angular
- Install audi ui / fonts / icons
- Swiper - 3 styles
  1. homepage banner
  2. product recommendation
  3. product photos
- en/zh switch using transloco
- not found
- server error
- live chat
- product list
- articles, e.g., news, events, promotions
- single product page using fullpage - first page has product info and carousel, second page custom wysiwyg content and product recommendations in same category
- cart
- like product
- checkout / order
- login / register / update user info
- cancel / track order
- member's area
- nav
- footer
- carve out audi ui as angular components
- form control validation states
- cards
- breadcrumbs
- notifications / badge
- modal

#### Data

- carve out individual audi components, with control value accessor and all that. export as module