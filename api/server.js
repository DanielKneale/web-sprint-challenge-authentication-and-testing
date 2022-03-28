const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require("connect-session-knex")(session);

const {restricted} = require('./middleware/middleware'); //when built add to serveruse api/jokes

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

const config = {
    name:'sessionId',
    secret:'keep it secret',
    cookie:{
        maxAge: 1000 * 60 * 60,
        secure:false,
        httpOnly:true
    },
    resave:false,
    saveUninitialized:false,

    store: new KnexSessionStore({
        knex:require("../data/dbConfig"),
        tablename:"sessions",
        sidfieldname:"sid", 
        createTable:true,
        clearInterval:100 * 60 * 60
    })
}

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(config))

server.use('/api/auth', authRouter);
server.use('/api/jokes',restricted, jokesRouter); // only logged-in users should have access!

module.exports = server;
