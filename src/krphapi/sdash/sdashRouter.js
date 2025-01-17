import express from 'express'
import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";

import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";
import stream from 'stream';
import multer from 'multer';
import {get_total_report,getPulsShareAndCost,getPulsShareAndCostOb,get_dashboard,get_dashboard_ob,get_sms_cost,agentWorkigDays_new} from "./sdashController.js"

export const sdashRouter = express.Router()

// sdashRouter.post('/summaryTotalReports', get_total_report);
// sdashRouter.post('/getNewNodeDashboard', get_dashboard);
// sdashRouter.post('/getPulsShareAndCost', getPulsShareAndCost);
// sdashRouter.post('/getPulsShareAndCostOb', getPulsShareAndCostOb);
// sdashRouter.post('/get_dashboard_ob', get_dashboard_ob);
// sdashRouter.post('/get_sms_cost_new', get_sms_cost);
// sdashRouter.post('/agentWorkigDays_new', agentWorkigDays_new);

sdashRouter.post('/summaryTotalReports1', get_total_report);
sdashRouter.post('/billingAgentDashboard', get_dashboard);
sdashRouter.post('/billingIbCompanyShareDetails', getPulsShareAndCost);
sdashRouter.post('/billingAgentWorkingDayDetails', agentWorkigDays_new);
sdashRouter.post('/billingobcompanyShareDetails', getPulsShareAndCostOb);
sdashRouter.post('/billingObCallDetails', get_dashboard_ob);
sdashRouter.post('/billingSmsCompanyDetails', get_sms_cost);

sdashRouter.get('/dbchange', async (req, res) => {
    const db = await req.db;
    await db.collection("sla_records").find({Customer_pulse: {$exists:true}}).forEach( async (x) => {
        db.collection("sla_records").updateOne({_id: x._id}, {$set: {Customer_pulse: parseInt(x.Customer_pulse)}}).then((dat) => {
            console.log(dat);
        });
    });

})