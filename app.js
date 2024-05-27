import { readFileSync } from 'fs';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import expressPlayground from 'graphql-playground-middleware-express';

import auth from './middleware/auth.js';

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vuiwnxj.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const typeDefs = readFileSync('./graphql/schema.graphql', 'utf8');
import Mutation from './graphql/resolvers/Mutation.js';
import Query from './graphql/resolvers/Query.js';
import dateScalar from './graphql/scalars.js';

const resolvers = {
    Mutation,
    Query,
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

app.get('/playground', expressPlayground.default({ endpoint: '/graphql' }));

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
