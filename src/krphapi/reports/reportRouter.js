import express from 'express'
import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";

import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";
import stream from 'stream';
import multer from 'multer';
import { griveninceReports} from './reportControllers.js'

export const reportRouter = express.Router()

reportRouter.post('/ReportHistory', griveninceReports)

