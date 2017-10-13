# hapi-postgres-rest-starter 

To start the server in production:
```
docker-compose up -d --build
```

To shutdown:
```
docker-compose down
```

To run in development, install Node.js 8 and run:
```
docker-compose run -d -p 5432:5432 postgres
docker-compose run -d -p 6379:6379 redis
npm run dev
```

In order to setup the Let's Encrypt SSL certificates edit docker-compose.yml, replacing *EXAMPLE.COM* with your website domain and *EMAIL@EXAMPLE.COM* with your email address.
