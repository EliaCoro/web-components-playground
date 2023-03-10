

const express = require('express');
import { Application } from "express";
const configs = require('./configs');
import { Request, Response } from 'express';
const port: number = configs.port || 9000;
const bodyParser = require('body-parser');
const app: Application = express();
const cors = require('cors');
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.get('*', (req: Request, res: Response) => {
  res.status(200).json(...require('./data.json'));
});

const httpServer: any = app.listen(port, () => {
  console.log("HTTP REST API Server running at http://localhost:" + httpServer.address().port);
});
