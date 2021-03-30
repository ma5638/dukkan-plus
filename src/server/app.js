// const express = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize');
const morgan = require('morgan');
const path = require('path');

const db = require('../database/models');
const routes = require('../routes');
const ShoppingCartUtility = require('../middleware/ShoppingCartUtility');
const logger = require('../helpers/logger');

dotenv.config();

const app = express();
const port = process.env.PORT || 6600;
// --------------- Must Fix  --------------
// Commented out as a temporary solution

const secret = process.env.SECRET || "8hy1jkr23iq1";
const SessionStore = sequelizeStore(session.Store);

const myStore = new SessionStore({
  db: db.sequelize,
});

app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// --------------- Must Fix  --------------
// Commented out as a temporary solution
console.log(secret);
app.use(session({
  secret: secret,
  store: myStore,
  resave: false,
  proxy: true,
  saveUninitialized: false
}));

// myStore.sync();

app.use(ShoppingCartUtility.generateCartId);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../views')));

app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce platform');
});

app.get('/checkout', (req, res) => {
  res.render('index');
});

routes(app);

app.use((err, req, res, next) => {
  const {
    statusCode, data, message, stack
  } = err;
  const code = statusCode || 500;
  const errorMessage = message;

  if (data) {
    return res.status(code).send({ errors: data });
  }

  logger.error(stack);
  return res.status(code).send({ message: errorMessage });
});

app.all('*', (req, res) => res.status(404).send({ message: 'Route not found' }));

const server = app.listen(port, () => logger.info(`Server Listening on port ${port}`));

module.exports = server;
