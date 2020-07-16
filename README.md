# person-component-test

## Project setup
```
npm install json-server -g
npm install
```

### Run a local server and compile project
```
json-server db.json --routes routes.json
npm run serve
```
***By default, fake api runs on http://localhost:3000 and frontend app on http://localhost:8080.
Consider the fact. BASE_URL set up to http://localhost:3000/api/v1/. Change it if want to
change fake api port (.env file in root dir).***

### Lints and fixes files
```
npm run lint
```

