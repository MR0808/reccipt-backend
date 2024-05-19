const path = require('path');
const { readFileSync } = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const expressPlayground =
    require('graphql-playground-middleware-express').default;
