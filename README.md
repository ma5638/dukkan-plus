

# ECOMMERCE-SHOP

Dukkan-Plus

## MVP features

* [x] Users can see all items when entering the website.
* [x] Items are displayed properly based on the selected category.
* [x] Users can search items through search box.
* [x] Support paging if we have too many items.
* [x] Users can see item details by selecting a specific item.
* [x] Users can add items to their shopping carts.
* [x] Users can register/login using website custom forms
* [x] Users can checkout with 3rd party payment gateways: Stripe.

## Getting started

### Prerequisites

In order to install and run this project locally, you would need to have the following installed on you local machine.

* [**Node JS**](https://nodejs.org/en/)
* [**Express**](https://expressjs.com/)
* [**MySQL**](https://www.mysql.com/downloads/)

### Installation

* Navigatet to the project directory

```sh
cd path/to/turin-backend

```

* Run `npm install` or `yarn` to instal the projects dependencies
* create a `.env` file and copy the contents of the `.env.sample` file into it and supply the values for each variable

```sh
cp .evn.sample .env
```

* Create a MySQL database and run the `sql` file in the database directory to migrate the database

```sh
cat ./src/database/migrations/database.sql | mysql -u <dbuser> -D <databasename> -p
```

## Stripe Integration

Shopping orders are paid for using a Stripe integration. In order to use the stripe endpoint send a `POST` request to `/api/v1/stripe`