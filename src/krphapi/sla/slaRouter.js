import express from 'express'
import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";

import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";
import stream from 'stream';
import multer from 'multer';
import { calculate_sla_report, sla_reports, sla_reports_day_wise, sla_reports_day_wise_cron_mytest,} from './slaController.js'
import { dbSyncCron} from '../cronJobs.js/dbSyncCronJob.js'


export const slaRouter = express.Router()

slaRouter.post('/slaReports', sla_reports)
slaRouter.post('/slaReports_day_wise', sla_reports_day_wise)
slaRouter.post('/calculate_sla_report', calculate_sla_report)
slaRouter.post('/mytest', sla_reports_day_wise_cron_mytest)
// slaRouter.post('/checkaudit', checkAuditReport)
slaRouter.post('/dbSync', dbSyncCron)
