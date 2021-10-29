var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const logger = require('./helpers/logger')
const sanateError = require('./exception/sanateError')
const cors = require('cors')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('combined', { stream: logger.stream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  throw sanateError('NOT_FOUND', 404, 'NOT_FOUND')
});

app.use((err, req, res, next) => {
    (process.env.NODE_ENV !== 'test') && logger.debug(err)
  if (err.response) {
    const {
      status,
      statusText,
      data = {}
    } = err.response
    const code = (data.error && data.error.code) || statusText || 'SERVICE_FAIL'
    const message = data.error && data.error.message
    logger.error(`Error with status ${err.status} - ${err.message} from ${err.request.url} with payload and response`, err)
    res.status(err.status || status).json({ error: {
      code,
      message: {errorMessage: message || err.message || 'Something went wrong'}
    } })
  } else if (err.request) {
    logger.error(`Error with status 500 - ${err.message} from ${err.request.url} with error`, err)
    res.status(500).json({ error: {
      code: 'SERVICE_TIMEOUT',
      message: 'Timeout'
    } })
  } else {
    const code = err.code || 'UNHANDLED_ERROR'
    logger.error(`Error with status ${err.status} - ${err.message} from ${req.originalUrl} with error`, err)
    res.status(err.status || 500).json({ error: {
      code,
      message: { errorMessage: err.message }
    } })
  }

})

module.exports = app;
