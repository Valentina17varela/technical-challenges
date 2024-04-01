# InstaStore

![](https://img.shields.io/badge/Code-NodeJS-informational?style=flat&logo=Node.js&logoColor=white&color=43853D)
![](https://img.shields.io/badge/Framework-ExpressJS-informational?style=flat&logo=express&logoColor=white&color=43853D)

Challenge Backend Engineer for Instaleap

## 🛠️ Requirements
InstaStore is a microservice in charge of selecting the closest "convenience" store to deliver a groceries order to our B2B clients.

    Non-functional:
    - We expect you to deliver idiomatic code in a way that is easy to read and follows the accepted guidelines in your area of expertise.
    - You should write it on Node.js with Express.js. Libraries, transpilers, etc are up to you.
    - Endpoints are fast (less than 300ms).
    - Endpoints respond to error codes that make sense to the case.
    - Please provide documentation for the endpoints you create

    Functional:
    Our B2B clients should be able to consume an endpoint that provides them the following information:
    - storeId
    - storeName
    - isOpen
    - coordinates
    - nextDeliveryTime
    The endpoint returns the closest store available
    We need to keep track of each call to the endpoint
