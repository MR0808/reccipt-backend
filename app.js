const path = require('path');
const { readFileSync } = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const expressPlayground =
    require('graphql-playground-middleware-express').default;

const auth = require('./middleware/auth');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vuiwnxj.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const typeDefs = readFileSync('./graphql/schema.graphql', 'utf8');
const { Query } = require('./graphql/resolvers/Query');
const { Mutation } = require('./graphql/resolvers/Mutation');
const { dateScalar } = require('./graphql/scalars');

const resolvers = {
    Query,
    Mutation,
    Date: dateScalar
};

const app = express();

app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(auth);

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req, connection, res }) => {
            return { req: req };
        }
    });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
};

startServer();

app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(process.env.PORT || 8080);
    })
    .catch((err) => console.log('error: ' + err));
