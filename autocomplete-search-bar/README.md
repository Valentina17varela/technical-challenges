# Autocomplete Search Bar

![](https://img.shields.io/badge/Code-typescript-informational?style=flat&logo=Typescript&logoColor=white&color=blue)

## 🛠️ Requirements

Imagine you have a website with a search bar. As the user types, your api should return autocomplete results for their query.

return a list of objects (id, name)
```json
{
    "id": 1,
    "name": "red small Apple phone"
}
```

## ⚙️ How To Run
1. installation
```
npm install
node_modules/.bin/ts-node src/data_generator.ts 1000000 # generate 1M products
```

2. run the project
```
npm run dev
curl 'localhost:3001?q=phone'
```