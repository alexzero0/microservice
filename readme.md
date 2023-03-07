
## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
* [Authors](#authors)

## About The Project


This is a template that implements communication between services in different languages (JavaScript and Python) using rabbitmq

Why did I create this template:

* For me, the task of my service was where complex mathematics can be processed not on the JavaScript side, but on Python (NN/AI/scientific tasks)
* Also, since I mainly work on JavaScript, it will be convenient for people like me to transfer mathematics to a third-party micro-service, and leave the main work with users on the JavaScript side
* Pulled up my skills in docker/docker-compose :smile:

I'm going to use this template for my startup in the future...

## Built With

All dependencies can be viewed in the package.json and requirements.txt

Technologies used:
* express
* postgres (orm sequelize)
* fastapi
* aio_pika py (for rabbitMQ)
* amqplib js (for rabbitMQ)
* Next js (for fronted feature ...)

## Getting Started

the project can be run locally and in production, there are two docker-compose for this.

Notice: 
* node version 18
* python version 3.9

install all dependencies

in express
* npm

```sh
npm i
```

in fastapi (the command can be used in a virtual environment)
```sh
pip install -r requirements.txt
```

### pre-start project

.env is required to run, an example is in .env.example or docker-compose

### local start (for dev) (docker-compose.dev.yml)

```sh
docker-compose -f docker-compose.dev.yml up --build
```

### server start (for prod) (docker-compose.prod.yml)

```sh
docker-compose -f docker-compose.prod.yml up --build
```



## Authors

* **Alex zero** - *web developer* - [web page](https://alexzero0.github.io/web-card/) 

#### Warning
* Beta test project (not all functionality has been tested) 
* there are no tests
