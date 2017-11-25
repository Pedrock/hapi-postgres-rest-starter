# hapi-postgres-rest-starter 

### Technologies

* Docker
* Hapi.js
* PostgreSQL
* Redis
* TypeORM
* Typescript

### Running

To start the server in production without nginx:
```
docker-compose up -d --build
```

To start the server in production with nginx and SSL:
```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

To shutdown:
```
docker-compose down
```

To run in development, install Node.js 8 and run:

```
npm run docker:dev
```

and then:
```
npm run dev
```

### Let's Encrypt

In order to setup the Let's Encrypt SSL certificates edit docker-compose.prod.yml, replacing *EXAMPLE.COM* with your website domain and *EMAIL@EXAMPLE.COM* with your email address.

### TypeORM

In order to run typeorm commands, use the *npm run orm* script.
For example:

```npm run orm -- --help```

```npm run orm -- schema:drop```

```npm run orm -- migrations:generate --name test```
