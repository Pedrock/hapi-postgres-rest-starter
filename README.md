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