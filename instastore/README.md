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

<br>

## ❓ Questions and Answers

1. What is the input that the endpoint receives to bring the nearest store?
2. How should we deal with the case that there are several stores with the same distance?
3. How is the nextDeliveryTime calculated?
4. Should we implement some kind of authentication for the customers consuming the service?
5. Should I use any API or specific information to obtain the coordinates of the stores?
6. What kind of data should be stored to track each call to the endpoint?

<br>

## 🚛 Delivery of the final product
Thursday, April 4, 2024

<br>

## 👩🏻‍💻 Implementation

### Architecture

<div align="center">
  <div class="image-container">
        <img src="/multimedia/architecture.png">
    </div>
</div>

<br>

1. Customer authentication: The customer logs into the InstaStore system using authentication credentials.
2. Obtaining store coordinates: When the customer makes a request to find the nearest store, the InstaStore service queries an external geolocation service to obtain the coordinates of all available stores. These coordinates are stored in the stores database for further use.
3. Finding the nearest store: Once the store coordinates have been stored in the stores database, the store service queries this database to find the store closest to the customer's location. This is done using distance calculation algorithms.
4. Delivery of information to the customer: Once the nearest store is found, the store service returns the store information (storeId, storeName, isOpen, coordinates, nextDeliveryTime) to the client in JSON format.
5. Storage in the tracking service: Simultaneously, the request and response of the customer's request are recorded in a tracking service, which stores this information for further analysis and tracking. This includes details such as the IP address of the customer, the timestamp of the request, the information of the selected store, among others.

### Data modeling

<div align="center">
  <div class="image-container">
        <img src="/multimedia/database.png">
    </div>
</div>

<br>

For this implementation, it was decided to use a non-relational database model, since the information we are interested in at this moment, such as the stores and the tracking of the calls, is not strictly related. Therefore, for simplicity reasons we decided to use the mongodb engine, for its easy coupling and support with Express.

### Observations
- For the endpoint that brings the nearest store, initially it was thought to use a GET method since it is about obtaining information, but since it is using the Swagger tool to document, it is not allowed to send a body to the GET, therefore it ended up being called a POST method

- In the tracking model I thought it would be interesting to add a field for the code_response, in case we want to filter by failed requests and easily identify an error in the system.

### Documentation
The api documentation can be found at
```
http://localhost:3000/
```

<br>

## 🤓 Improvements and trade offs
1. What would you improve from your code? why?
2. Which trade offs would you make to accomplish this on time? What'd you do next time to deliver more and sacrifice less?
3. Do you think your service is secure? why?

    Yes, although the exposed information is not sensitive data since it returns information from "public" addresses, authentication with JWT was implemented to protect user information and securely access our api, for this exercise we are simply generating the tokens to authenticate, but in a production application the idea would be to be able to use this functionality in a login, for a logged-in user to have access to our application
    
4. What would you do to measure the behavior of your product in a production environment?

<br>

## ⚙️ How To Run

- Clone the repository
```
git clone https://github.com/Valentina17varela/InstaStore.git
```

- Install dependencies
```
npm install
```

- Configure the environment variables, create an .env file with the variables from example.env

- Run the application
```
npm run start
```

- To start the server go to the following address  
```
http://localhost:3000/
```