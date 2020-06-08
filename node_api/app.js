const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = express();
const server = http.createServer(app);

// Set security HTTP header
app.use(helmet());

// Limit requests from same API.(Used to prvent DOS attacks and Brute force attacks)
// const limiter = rateLimit({
//   max: 100, // 100 requests in 1 hour is allowed
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, Please try again in an hour'
// });
// app.use('/api', limiter);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());
app.use(cookieParser());
app.use(cors());
app.use('/uploads', express.static('uploads'));
// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS/Cross-site Scripting
app.use(xss());

const postRouter = require('./routes/postRoute');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');

// Routes
app.use('/api/post', postRouter);
app.use('/api', authRouter);
app.use('/api/users', userRouter);

//Error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      error: {
        message: error
      }
    });
});

// Connection to the database
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then( () => console.log('Database connection successful!!'));

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Listening to port ${port}.........`);
});
