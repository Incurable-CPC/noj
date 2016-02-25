/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-core/polyfill';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import engine from 'ejs-mate';
import assets from './assets';
import { port, mongoSetting } from './config';

const server = global.server = express();

// view engine setup
server.engine('ejs', engine);
server.set('views', __dirname);
server.set('view engine', 'ejs');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());

mongoose.connect(mongoSetting.url);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
import api from './api';
server.use('/api', api);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

server.use((req, res) => {
  const data = { entry: assets.main.js };
  res.render('index', data);
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
