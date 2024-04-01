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


## ❓ Questions and Answers

1. What is the input that the endpoint receives to bring the nearest store?
2. How should we deal with the case that there are several stores with the same distance?
3. How is the nextDeliveryTime calculated?
4. Should we implement some kind of authentication for the customers consuming the service?
5. Should I use any API or specific information to obtain the coordinates of the stores?
6. What kind of data should be stored to track each call to the endpoint?

## 🚛 Delivery of the final product
Thursday, April 4, 2024


## 👩🏻‍💻 Implementation


## 🤓 Improvements and trade offs
1. What would you improve from your code? why?
2. Which trade offs would you make to accomplish this on time? What'd you do next time to deliver more and sacrifice less?
3. Do you think your service is secure? why?
4. What would you do to measure the behavior of your product in a production environment?


## ⚙️ How To Run
