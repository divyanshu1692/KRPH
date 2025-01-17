import {sla_reports_day_wise_cron,sla_report_month_wise_cron_control} from '../../krphapi/sla/slaController'
import cron from 'node-cron'

let cronJobScheduled = false;
let isProcessing = false;
let cronJobScheduledForMonth = false;
let isProcessingForMonth = false;



export const sla_cron_report = async () => {
    try {
        if (!cronJobScheduled) {
            cron.schedule('0 22 * * *', async () => {
                if (isProcessing) return;
                isProcessing = true; 
                try {
                    const result = await sla_reports_day_wise_cron();
                    if (result == 1) {
                        console.log("Added");
                    } else {
                        console.log("No Records for the day");
                    }
                } catch (err) {
                    console.error("Error in SLA report cron:", err);
                } finally {
                    isProcessing = false; 
                }
            });
            cronJobScheduled = true; 
        }
    } catch (err) {
        console.error("Error setting up SLA cron report:", err);
    }
};



export const sla_month_record_update_cron = async () => {
    try {
        if (!cronJobScheduledForMonth) {
            cron.schedule('0 23 * * *', async () => {
                if (isProcessingForMonth) return;
                isProcessingForMonth = true; 
                try {
                    sla_report_month_wise_cron_control().then((response)=>{
                        console.log(response)
                    }).catch((err)=>{
                        console.log(err)
                    })
                } catch (err) {
                    console.error("Error in SLA report cron:", err);
                } finally {
                    isProcessingForMonth = false; 
                }
            });
            cronJobScheduledForMonth = true; 
        }
    } catch (err) {
        console.error("Error setting up SLA cron report:", err);
    }
};



  