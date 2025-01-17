import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {MongoClient} from 'mongodb'
import fs from 'fs';
import util from "util";
import {UtilService} from "../../helper/utilService";
const uri = process.env.MONGODB;
const client = new MongoClient(uri);
const db = client.db('krph_db');
client.connect().then((res)=>{
    console.log("connectedMongo")
}).catch((err)=>{
    console.log(err)
})

// // export const sla_reports = async (req, res) => {
// //     try {
// //         let { startDate, endDate, statuses = ["Answered"] } = req.body;
// //         const [startDay, startMonth, startYear] = startDate.split('-');
// //         const [endDay, endMonth, endYear] = endDate.split('-');

// //         const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
// //         const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);
        
// //         const query = {
// //             Call_Start_Time: {
// //                 $gte: startTime,
// //                 $lt: endTime
// //             },
// //             Status: { $in: statuses }
// //         };

// //         const results = await db.collection('sla_records').aggregate([
// //             {
// //                 $facet: {
// //                     ASA: [
// //                         { $match: query },
// //                         {
// //                             $group: {
// //                                 _id: null,
// //                                 totalAnsweredCallASA: { $sum: 1 },
// //                                 totalQuedCallsASA: {
// //                                     $sum: {
// //                                         $cond: [
// //                                             { $gt: ["$Customer_Queue_Seconds", 0] },
// //                                             {
// //                                                 $cond: [
// //                                                     { $lte: ["$Customer_Queue_Seconds", 30] },
// //                                                     1,
// //                                                     0
// //                                                 ]
// //                                             },
// //                                             0
// //                                         ]
// //                                     }
// //                                 }
// //                             }
// //                         },
// //                         {
// //                             $project: {
// //                                 totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
// //                                 totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
// //                                 percentQuedCallsASA: {
// //                                     $cond: {
// //                                         if: { $gt: ["$totalAnsweredCallASA", 0] },
// //                                         then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
// //                                         else: 0
// //                                     }
// //                                 }
// //                             }
// //                         }
// //                     ],
// //                     AHT: [
// //                         { $match: query },
// //                         {
// //                             $group: {
// //                                 _id: null,
// //                                 totalAnsweredCallAHT: { $sum: 1 },
// //                                 callAHT_300_seconds: {
// //                                     $sum: {
// //                                         $cond: [
// //                                             { $gt: ["$Agent_TalkTime", 0] },
// //                                             {
// //                                                 $cond: [
// //                                                     { $lte: ["$Agent_TalkTime", 300] },
// //                                                     1,
// //                                                     0
// //                                                 ]
// //                                             },
// //                                             0
// //                                         ]
// //                                     }
// //                                 }
// //                             }
// //                         },
// //                         {
// //                             $project: {
// //                                 totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
// //                                 callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
// //                                 percentAHT_300_seconds: {
// //                                     $cond: {
// //                                         if: { $gt: ["$totalAnsweredCallAHT", 0] },
// //                                         then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
// //                                         else: 0
// //                                     }
// //                                 }
// //                             }
// //                         }
// //                     ],
// //                     SU: [
// //                         {
// //                             $match: {
// //                                 Call_Start_Time: {
// //                                     $gte: startTime,
// //                                     $lt: endTime
// //                                 },
// //                                 Status: { $ne: "System Missed" }
// //                             }
// //                         },
// //                         {
// //                             $group: {
// //                                 _id: null,
// //                                 totalCallsLanded: { $sum: 1 },
// //                                 activeAgents: {
// //                                     $addToSet: {
// //                                         $cond: [
// //                                             { $ne: ["$Agent_ID", ""] },
// //                                             "$Agent_ID",
// //                                             null
// //                                         ]
// //                                     }
// //                                 }
// //                             }
// //                         },
// //                         {
// //                             $project: {
// //                                 totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
// //                                 activeAgentCount: {
// //                                     $size: {
// //                                         $filter: {
// //                                             input: "$activeAgents",
// //                                             as: "agent",
// //                                             cond: { $ne: ["$$agent", null] }
// //                                         }
// //                                     }
// //                                 },
// //                                 callsPerActiveAgent: {
// //                                     $cond: {
// //                                         if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
// //                                         then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
// //                                         else: 0
// //                                     }
// //                                 }
// //                             }
// //                         }
// //                     ]
                    
                    
                    
// //                 }
// //             },
// //             {
// //                 $project: {
// //                     ASA: { $arrayElemAt: ["$ASA", 0] },
// //                     AHT: { $arrayElemAt: ["$AHT", 0] },
// //                     SU: { $arrayElemAt: ["$SU", 0] }
// //                 }
// //             }
// //         ]).toArray();
// //         const asaData = results[0].ASA;
// //         const ahtData = results[0].AHT;
// //         const suData = results[0].SU;

// //         let response = {
// //             ASA_REPORT: {
// //                 totalAnsweredCallASA: asaData.totalAnsweredCallASA,
// //                 totalQuedCallsASA: asaData.totalQuedCallsASA,
// //                 percentQuedCallsASA: asaData.percentQuedCallsASA
// //             },
// //             AHT_REPORT: {
// //                 totalAnsweredCallAHT: ahtData.totalAnsweredCallAHT,
// //                 callAHT_300_seconds: ahtData.callAHT_300_seconds,
// //                 percentAHT_300_seconds: ahtData.percentAHT_300_seconds
// //             },
// //             SEAT_UTILIZATION: {
// //                 totalCallsLanded: suData.totalCallsLanded,
// //                 totalActiveAgent: suData.activeAgentCount,
// //                 callsPerActiveAgent: suData.callsPerActiveAgent // Include this if needed
// //             }
// //         };
        
// //         if (response) {
// //             // response = await this.utilService.GZip(response);
// //             response = await new UtilService().GZip(response)
// //         }
// //         let message = {
// //             msg:"Fetched Successfully",
// //             code : 1,
            
// //         }
// //         return jsonResponseHandler(response, message, req, res, () => {})

       

// //     } catch (err) {
// //         console.log(err);
// //         res.status(500).json({ message: "An error occurred", error: err.message });
// //     }
// // };


// import NodeCache from 'node-cache';

// const cache = new NodeCache({ stdTTL: 2400 }); // 40 minutes in seconds

// export const sla_reports = async (req, res) => {
//     try {
//         // console.log("enter")
//         IndexsForSla(db)
//         let { startDate, endDate, statuses = ["Answered"] } = req.body;
//         let message = {
//             msg: "Fetched Successfully",
//             code: 1,
//         };
        
//         let cacheKey = `sla_reports_${startDate}_${endDate}`;

//         let cachedResult = cache.get(cacheKey);
//         if (cachedResult) {
          
//             cachedResult = await new UtilService().GZip(cachedResult);
          
//             return jsonResponseHandler(cachedResult, message, req, res, () => {});
//         }

//         const [startDay, startMonth, startYear] = startDate.split('-');
//         const [endDay, endMonth, endYear] = endDate.split('-');

//         const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
//         const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);

//         const query = {
//             Call_Start_Time: {
//                 $gte: startTime,
//                 $lt: endTime
//             },
//             Status: { $in: statuses }
//         };

//         const results = await db.collection('sla_records').aggregate([
//             {
//                 $facet: {
//                     ASA: [
//                         { $match: query },
//                         {
//                             $group: {
//                                 _id: null,
//                                 totalAnsweredCallASA: { $sum: 1 },
//                                 totalQuedCallsASA: {
//                                     $sum: {
//                                         $cond: [
//                                             { $gt: ["$Customer_Queue_Seconds", 0] },
//                                             {
//                                                 $cond: [
//                                                     { $lte: ["$Customer_Queue_Seconds", 30] },
//                                                     1,
//                                                     0
//                                                 ]
//                                             },
//                                             0
//                                         ]
//                                     }
//                                 }
//                             }
//                         },
//                         {
//                             $project: {
//                                 totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
//                                 totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
//                                 percentQuedCallsASA: {
//                                     $cond: {
//                                         if: { $gt: ["$totalAnsweredCallASA", 0] },
//                                         then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
//                                         else: 0
//                                     }
//                                 }
//                             }
//                         }
//                     ],
//                     AHT: [
//                         { $match: query },
//                         {
//                             $group: {
//                                 _id: null,
//                                 totalAnsweredCallAHT: { $sum: 1 },
//                                 callAHT_300_seconds: {
//                                     $sum: {
//                                         $cond: [
//                                             { $gt: ["$Agent_TalkTime", 0] },
//                                             {
//                                                 $cond: [
//                                                     { $lte: ["$Agent_TalkTime", 300] },
//                                                     1,
//                                                     0
//                                                 ]
//                                             },
//                                             0
//                                         ]
//                                     }
//                                 }
//                             }
//                         },
//                         {
//                             $project: {
//                                 totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
//                                 callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
//                                 percentAHT_300_seconds: {
//                                     $cond: {
//                                         if: { $gt: ["$totalAnsweredCallAHT", 0] },
//                                         then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
//                                         else: 0
//                                     }
//                                 }
//                             }
//                         }
//                     ],
//                     SU: [
//                         {
//                             $match: {
//                                 Call_Start_Time: {
//                                     $gte: startTime,
//                                     $lt: endTime
//                                 },
//                                 Status: { $ne: "System Missed" }
//                             }
//                         },
//                         {
//                             $group: {
//                                 _id: null,
//                                 totalCallsLanded: { $sum: 1 },
//                                 activeAgents: {
//                                     $addToSet: {
//                                         $cond: [
//                                             { $ne: ["$Agent_ID", ""] },
//                                             "$Agent_ID",
//                                             null
//                                         ]
//                                     }
//                                 }
//                             }
//                         },
//                         {
//                             $project: {
//                                 totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
//                                 activeAgentCount: {
//                                     $size: {
//                                         $filter: {
//                                             input: "$activeAgents",
//                                             as: "agent",
//                                             cond: { $ne: ["$$agent", null] }
//                                         }
//                                     }
//                                 },
//                                 callsPerActiveAgent: {
//                                     $cond: {
//                                         if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
//                                         then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
//                                         else: 0
//                                     }
//                                 }
//                             }
//                         }
//                     ]
//                 }
//             },
//             {
//                 $project: {
//                     ASA: { $arrayElemAt: ["$ASA", 0] },
//                     AHT: { $arrayElemAt: ["$AHT", 0] },
//                     SU: { $arrayElemAt: ["$SU", 0] }
//                 }
//             }
//         ]).toArray();

//         const asaData = results[0].ASA;
//         const ahtData = results[0].AHT;
//         const suData = results[0].SU;

//         let response = {
//             ASA_REPORT: {
//                 totalAnsweredCallASA: asaData.totalAnsweredCallASA,
//                 totalQuedCallsASA: asaData.totalQuedCallsASA,
//                 percentQuedCallsASA: asaData.percentQuedCallsASA
//             },
//             AHT_REPORT: {
//                 totalAnsweredCallAHT: ahtData.totalAnsweredCallAHT,
//                 callAHT_300_seconds: ahtData.callAHT_300_seconds,
//                 percentAHT_300_seconds: ahtData.percentAHT_300_seconds
//             },
//             SEAT_UTILIZATION: {
//                 totalCallsLanded: suData.totalCallsLanded,
//                 totalActiveAgent: suData.activeAgentCount,
//                 callsPerActiveAgent: suData.callsPerActiveAgent
//             }
//         };

//         cache.set(cacheKey, response);

//         if (response) {
//             response = await new UtilService().GZip(response);
//         }

//         return jsonResponseHandler(response, message, req, res, () => {});

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "An error occurred", error: err.message });
//     }
// };



// export const sla_reports_day_wise = async (req, res) => {
//     try {
//         const currentDate = new Date();
//         const startYear = currentDate.getFullYear();
//         const startMonth = currentDate.getMonth(); // 0-based month
//         const currentDay = currentDate.getDate();
//         const statuses = req.body.statuses || ["Answered"];
//         const reportData = [];

//         let message = {
//             msg: "Fetched Successfully",
//             code: 1,
//         };

//         const fetchReportForDay = async (day) => {
//             if (day > currentDay) {
//                 return; 
//             }
//             const startDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//             const endDate = startDate;
//             const startTime = new Date(`${startDate}T00:00:00.000Z`);
//             const endTime = new Date(`${endDate}T23:59:59.999Z`);
//             console.log(startTime, endTime);
            
//             const query = {
//                 Call_Start_Time: {
//                     $gte: startTime,
//                     $lt: endTime,
//                 },
//                 Status: { $in: statuses },
//             };

//             const results = await db.collection('sla_records').aggregate([
//                 {
//                     $facet: {
//                         ASA: [
//                             { $match: query },
//                             {
//                                 $group: {
//                                     _id: null,
//                                     totalAnsweredCallASA: { $sum: 1 },
//                                     totalQuedCallsASA: {
//                                         $sum: {
//                                             $cond: [
//                                                 { $gt: ["$Customer_Queue_Seconds", 0] },
//                                                 {
//                                                     $cond: [
//                                                         { $lte: ["$Customer_Queue_Seconds", 30] },
//                                                         1,
//                                                         0,
//                                                     ],
//                                                 },
//                                                 0,
//                                             ],
//                                         },
//                                     },
//                                 },
//                             },
//                             {
//                                 $project: {
//                                     totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
//                                     totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
//                                     percentQuedCallsASA: {
//                                         $cond: {
//                                             if: { $gt: ["$totalAnsweredCallASA", 0] },
//                                             then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
//                                             else: 0,
//                                         },
//                                     },
//                                 },
//                             },
//                         ],
//                         AHT: [
//                             { $match: query },
//                             {
//                                 $group: {
//                                     _id: null,
//                                     totalAnsweredCallAHT: { $sum: 1 },
//                                     callAHT_300_seconds: {
//                                         $sum: {
//                                             $cond: [
//                                                 { $gt: ["$Agent_TalkTime", 0] },
//                                                 {
//                                                     $cond: [
//                                                         { $lte: ["$Agent_TalkTime", 300] },
//                                                         1,
//                                                         0,
//                                                     ],
//                                                 },
//                                                 0,
//                                             ],
//                                         },
//                                     },
//                                 },
//                             },
//                             {
//                                 $project: {
//                                     totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
//                                     callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
//                                     percentAHT_300_seconds: {
//                                         $cond: {
//                                             if: { $gt: ["$totalAnsweredCallAHT", 0] },
//                                             then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
//                                             else: 0,
//                                         },
//                                     },
//                                 },
//                             },
//                         ],
//                         SU: [
//                             {
//                                 $match: {
//                                     Call_Start_Time: {
//                                         $gte: startTime,
//                                         $lt: endTime,
//                                     },
//                                     Status: { $ne: "System Missed" },
//                                 },
//                             },
//                             {
//                                 $group: {
//                                     _id: null,
//                                     totalCallsLanded: { $sum: 1 },
//                                     activeAgents: {
//                                         $addToSet: {
//                                             $cond: [
//                                                 { $ne: ["$Agent_ID", ""] },
//                                                 "$Agent_ID",
//                                                 null,
//                                             ],
//                                         },
//                                     },
//                                 },
//                             },
//                             {
//                                 $project: {
//                                     totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
//                                     activeAgentCount: {
//                                         $size: {
//                                             $filter: {
//                                                 input: "$activeAgents",
//                                                 as: "agent",
//                                                 cond: { $ne: ["$$agent", null] },
//                                             },
//                                         },
//                                     },
//                                     callsPerActiveAgent: {
//                                         $cond: {
//                                             if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
//                                             then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
//                                             else: 0,
//                                         },
//                                     },
//                                 },
//                             },
//                         ],
//                     },
//                 },
//                 {
//                     $project: {
//                         ASA: { $arrayElemAt: ["$ASA", 0] },
//                         AHT: { $arrayElemAt: ["$AHT", 0] },
//                         SU: { $arrayElemAt: ["$SU", 0] },
//                     },
//                 },
//             ]).toArray();

//             let response = {
//                 ASA_REPORT: {
//                     totalAnsweredCallASA: 0,
//                     totalQuedCallsASA: 0,
//                     percentQuedCallsASA: 0,
//                 },
//                 AHT_REPORT: {
//                     totalAnsweredCallAHT: 0,
//                     callAHT_300_seconds: 0,
//                     percentAHT_300_seconds: 0,
//                 },
//                 SEAT_UTILIZATION: {
//                     totalCallsLanded: 0,
//                     totalActiveAgent: 0,
//                     callsPerActiveAgent: 0,
//                 },
//                 insertedDate: startTime
//             };

//             if (results.length > 0) {
//                 const asaData = results[0].ASA || {};
//                 const ahtData = results[0].AHT || {};
//                 const suData = results[0].SU || {};

//                 response.ASA_REPORT.totalAnsweredCallASA = asaData.totalAnsweredCallASA || 0;
//                 response.ASA_REPORT.totalQuedCallsASA = asaData.totalQuedCallsASA || 0;
//                 response.ASA_REPORT.percentQuedCallsASA = asaData.percentQuedCallsASA || 0;

//                 response.AHT_REPORT.totalAnsweredCallAHT = ahtData.totalAnsweredCallAHT || 0;
//                 response.AHT_REPORT.callAHT_300_seconds = ahtData.callAHT_300_seconds || 0;
//                 response.AHT_REPORT.percentAHT_300_seconds = ahtData.percentAHT_300_seconds || 0;

//                 response.SEAT_UTILIZATION.totalCallsLanded = suData.totalCallsLanded || 0;
//                 response.SEAT_UTILIZATION.totalActiveAgent = suData.activeAgentCount || 0;
//                 response.SEAT_UTILIZATION.callsPerActiveAgent = suData.callsPerActiveAgent || 0;
//             }

//             reportData.push(response);
//             await db.collection('day_wise_sla_test').insertOne(response);

//             await fetchReportForDay(day + 1);
//         };

//         await fetchReportForDay(1);

//         return jsonResponseHandler(reportData, message, req, res, () => {});

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "An error occurred", error: err.message });
//     }
// };


// export const calculate_sla_report = async (req, res) => {
//     try {
//         let { startDate, endDate } = req.body;
//         const [startDay, startMonth, startYear] = startDate.split('-');
//         const [endDay, endMonth, endYear] = endDate.split('-');
//         const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
//         const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);
//         let message = {};
//         console.log(startTime, endTime);

//         const result = await db.collection('day_wise_sla_test').aggregate([
//             {
//                 $match: {
//                     insertedDate: {
//                         $gte: startTime,
//                         $lt: endTime,
//                     }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
//                     totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
//                     totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
//                     callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
//                     totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
//                     totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" },
//                     insertedDate: { $first: "$insertedDate" } 
//                 }
//             },
//             {
//                 $project: {
//                     _id: { $ifNull: ["$_id", null] },
//                     ASA_REPORT: {
//                         totalAnsweredCallASA: "$totalAnsweredCallASA",
//                         totalQuedCallsASA: "$totalQuedCallsASA",
//                         percentQuedCallsASA: {
//                             $cond: {
//                                 if: { $gt: ["$totalAnsweredCallASA", 0] },
//                                 then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
//                                 else: 0
//                             }
//                         }
//                     },
//                     AHT_REPORT: {
//                         totalAnsweredCallAHT: "$totalAnsweredCallAHT",
//                         callAHT_300_seconds: "$callAHT_300_seconds",
//                         percentAHT_300_seconds: {
//                             $cond: {
//                                 if: { $gt: ["$totalAnsweredCallAHT", 0] },
//                                 then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
//                                 else: 0
//                             }
//                         }
//                     },
//                     SEAT_UTILIZATION: {
//                         totalCallsLanded: "$totalCallsLanded",
//                         totalActiveAgent: "$totalActiveAgent",
//                         callsPerActiveAgent: {
//                             $cond: {
//                                 if: { $gt: ["$totalActiveAgent", 0] },
//                                 then: { $round: [{ $divide: ["$totalCallsLanded", "$totalActiveAgent"] }, 2] },
//                                 else: 0
//                             }
//                         }
//                     },
//                 }
//             }
//         ]).toArray();

//         const systemUpTime = await db.collection('sla_system_up_time').aggregate([
//             {
//                 $match: {
//                     $or: [
//                         {
//                             startDate: {
//                                 $gte: startTime,
//                                 $lt: endTime
//                             }
//                         },
//                         {
//                             endDate: {
//                                 $gte: startTime,
//                                 $lt: endTime
//                             }
//                         }
//                     ]
//                 }
//             },
//         ]).toArray();

//         const now = new Date();
//         const lastSixMonthsData = Array.from({ length: 6 }, (_, i) => {
//             const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//             return {
//                 month: date.toLocaleString('default', { month: 'short' }),
//                 value: { percentQuedCalls: "0", percentAHT300: "0", callsPerActiveAgent: "0" }
//             };
//         });

//         for (const monthData of lastSixMonthsData) {
//             const monthStart = new Date(now.getFullYear(), now.getMonth() - lastSixMonthsData.indexOf(monthData), 1);
//             const monthEnd = new Date(now.getFullYear(), now.getMonth() - lastSixMonthsData.indexOf(monthData) + 1, 0);

//             const monthlyResult = await db.collection('day_wise_sla_test').aggregate([
//                 {
//                     $match: {
//                         insertedDate: {
//                             $gte: monthStart,
//                             $lt: monthEnd,
//                         }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
//                         totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
//                         totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
//                         callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
//                         totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
//                         totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" }
//                     }
//                 }
//             ]).toArray();

//             if (monthlyResult.length > 0) {
//                 const monthlyData = monthlyResult[0];

//                 const percentQuedCalls = monthlyData.totalAnsweredCallASA > 0
//                     ? ((monthlyData.totalQuedCallsASA / monthlyData.totalAnsweredCallASA) * 100).toFixed(2)
//                     : "0";

//                 const percentAHT300 = monthlyData.totalAnsweredCallAHT > 0
//                     ? ((monthlyData.callAHT_300_seconds / monthlyData.totalAnsweredCallAHT) * 100).toFixed(2)
//                     : "0";

//                 const callsPerActiveAgent = monthlyData.totalActiveAgent > 0
//                     ? (monthlyData.totalCallsLanded / monthlyData.totalActiveAgent).toFixed(2)
//                     : "0";

//                 monthData.value = {
//                     percentQuedCalls,
//                     percentAHT300,
//                     callsPerActiveAgent
//                 };
//             }
//         }

//         const lastSixMonthsUptime = Array.from({ length: 6 }, (_, i) => {
//             const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//             return {
//                 month: date.toLocaleString('default', { month: 'short' }),
//                 year: date.getFullYear(),
//                 uptime: 0
//             };
//         });

//         for (const monthData of lastSixMonthsUptime) {
//             const monthIndex = new Date(Date.parse(monthData.month + " 1")).getMonth();
//             const monthStart = new Date(monthData.year, monthIndex, 1);
//             const monthEnd = new Date(monthData.year, monthIndex + 1, 0);

//             const monthlyUptimeResult = await db.collection('sla_system_up_time').aggregate([
//                 {
//                     $match: {
//                         startDate: { $gte: monthStart, $lte: monthEnd }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         totalUptime: { $sum: "$uptime" }
//                     }
//                 }
//             ]).toArray();

//             if (monthlyUptimeResult.length > 0) {
//                 monthData.uptime = monthlyUptimeResult[0].totalUptime;
//             }
//         }


//         let response = result;
//         message = {
//             msg: "Success",
//             code: 1
//         };

//         response[0].ASA_graph = lastSixMonthsData.map(monthData => ({
//             month: monthData.month,
//             value: monthData.value.percentQuedCalls
//         }));

//         response[0].AHT_graph = lastSixMonthsData.map(monthData => ({
//             month: monthData.month,
//             value: monthData.value.percentAHT300
//         }));

//         response[0].SEAT_UTILIZATION_graph = lastSixMonthsData.map(monthData => ({
//             month: monthData.month,
//             value: monthData.value.callsPerActiveAgent
//         }));

//         response[0].SYSTEM_UPTIME_REPORT = {
//             uptime: systemUpTime[0].uptime,
//             month: systemUpTime[0].month,
//             year: systemUpTime[0].year
//         };

//         response[0].SYSTEM_UPTIME_GRAPH = lastSixMonthsUptime.map(monthData => ({
//             uptime: monthData.uptime,
//             month: monthData.month,
//             year: monthData.year
//         }));

//         if (response) {
//             response = await new UtilService().GZip(response);
//         }

//         return jsonResponseHandler(response, message, req, res, () => { });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "An error occurred", error: err.message });
//     }
// };











// export const sla_reports_day_wise_cron = async () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const currentDate = new Date();
//             const startDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
//             const endDate = startDate;
//             const statuses = ["Answered"];
//             const reportData = [];
//             const startTime = new Date(`${startDate}T00:00:00.000Z`);
//             const endTime = new Date(`${endDate}T23:59:59.999Z`);
            
//             const query = {
//                 Call_Start_Time: {
//                     $gte: startTime,
//                     $lt: endTime,
//                 },
//                 Status: { $in: statuses },
//             };
//             const results = await db.collection('sla_records').aggregate([
//                 {
//                     $facet: {
//                         ASA: [
//                             { $match: query },
//                             {
//                                 $group: {
//                                     _id: null,
//                                     totalAnsweredCallASA: { $sum: 1 },
//                                     totalQuedCallsASA: {
//                                         $sum: {
//                                             $cond: [
//                                                 { $gt: ["$Customer_Queue_Seconds", 0] },
//                                                 {
//                                                     $cond: [
//                                                         { $lte: ["$Customer_Queue_Seconds", 30] },
//                                                         1,
//                                                         0,
//                                                     ],
//                                                 },
//                                                 0,
//                                             ],
//                                         },
//                                     },
//                                 },
//                             },
//                             {
//                                 $project: {
//                                     totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
//                                     totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
//                                     percentQuedCallsASA: {
//                                         $cond: {
//                                             if: { $gt: ["$totalAnsweredCallASA", 0] },
//                                             then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
//                                             else: 0,
//                                         },
//                                     },
//                                 },
//                             },
//                         ],
//                         AHT: [
//                             { $match: query },
//                             {
//                                 $group: {
//                                     _id: null,
//                                     totalAnsweredCallAHT: { $sum: 1 },
//                                     callAHT_300_seconds: {
//                                         $sum: {
//                                             $cond: [
//                                                 { $gt: ["$Agent_TalkTime", 0] },
//                                                 {
//                                                     $cond: [
//                                                         { $lte: ["$Agent_TalkTime", 300] },
//                                                         1,
//                                                         0,
//                                                     ],
//                                                 },
//                                                 0,
//                                             ],
//                                         },
//                                     },
//                                 },
//                             },
//                             {
//                                 $project: {
//                                     totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
//                                     callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
//                                     percentAHT_300_seconds: {
//                                         $cond: {
//                                             if: { $gt: ["$totalAnsweredCallAHT", 0] },
//                                             then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
//                                             else: 0,
//                                         },
//                                     },
//                                 },
//                             },
//                         ],
//                         SU: [
//                             {
//                                 $match: {
//                                     Call_Start_Time: {
//                                         $gte: startTime,
//                                         $lt: endTime,
//                                     },
//                                     Status: { $ne: "System Missed" },
//                                 },
//                             },
//                             {
//                                 $group: {
//                                     _id: null,
//                                     totalCallsLanded: { $sum: 1 },
//                                     activeAgents: {
//                                         $addToSet: {
//                                             $cond: [
//                                                 { $ne: ["$Agent_ID", ""] },
//                                                 "$Agent_ID",
//                                                 null,
//                                             ],
//                                         },
//                                     },
//                                 },
//                             },
//                             {
//                                 $project: {
//                                     totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
//                                     activeAgentCount: {
//                                         $size: {
//                                             $filter: {
//                                                 input: "$activeAgents",
//                                                 as: "agent",
//                                                 cond: { $ne: ["$$agent", null] },
//                                             },
//                                         },
//                                     },
//                                     callsPerActiveAgent: {
//                                         $cond: {
//                                             if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
//                                             then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
//                                             else: 0,
//                                         },
//                                     },
//                                 },
//                             },
//                         ],
//                     },
//                 },
//                 {
//                     $project: {
//                         ASA: { $arrayElemAt: ["$ASA", 0] },
//                         AHT: { $arrayElemAt: ["$AHT", 0] },
//                         SU: { $arrayElemAt: ["$SU", 0] },
//                     },
//                 },
//             ]).toArray();

//             let response = {
//                 ASA_REPORT: {
//                     totalAnsweredCallASA: 0,
//                     totalQuedCallsASA: 0,
//                     percentQuedCallsASA: 0,
//                 },
//                 AHT_REPORT: {
//                     totalAnsweredCallAHT: 0,
//                     callAHT_300_seconds: 0,
//                     percentAHT_300_seconds: 0,
//                 },
//                 SEAT_UTILIZATION: {
//                     totalCallsLanded: 0,
//                     totalActiveAgent: 0,
//                     callsPerActiveAgent: 0,
//                 },
//                 insertedDate: startTime
//             };

//             if (results.length > 0) {
//                 const asaData = results[0].ASA || {};
//                 const ahtData = results[0].AHT || {};
//                 const suData = results[0].SU || {};

//                 response.ASA_REPORT.totalAnsweredCallASA = asaData.totalAnsweredCallASA || 0;
//                 response.ASA_REPORT.totalQuedCallsASA = asaData.totalQuedCallsASA || 0;
//                 response.ASA_REPORT.percentQuedCallsASA = asaData.percentQuedCallsASA || 0;

//                 response.AHT_REPORT.totalAnsweredCallAHT = ahtData.totalAnsweredCallAHT || 0;
//                 response.AHT_REPORT.callAHT_300_seconds = ahtData.callAHT_300_seconds || 0;
//                 response.AHT_REPORT.percentAHT_300_seconds = ahtData.percentAHT_300_seconds || 0;

//                 response.SEAT_UTILIZATION.totalCallsLanded = suData.totalCallsLanded || 0;
//                 response.SEAT_UTILIZATION.totalActiveAgent = suData.activeAgentCount || 0;
//                 response.SEAT_UTILIZATION.callsPerActiveAgent = suData.callsPerActiveAgent || 0;
//             }

//             const checkAllValues = (obj) => {
//                 return Object.values(obj).every(value => value === 0);
//             };

//             const isAllZero = checkAllValues(response.ASA_REPORT)
//                 && checkAllValues(response.AHT_REPORT)
//                 && checkAllValues(response.SEAT_UTILIZATION);

//             if (!isAllZero) {
//                 const insertResponse = await db.collection('day_wise_sla_test').insertOne(response);
//                 resolve(1);
//             } else {
//                 resolve(0);
//             }
//         } catch (err) {
//             console.error("Error generating daily SLA report:", err);
//             reject(err);
//         }
//     });
// };


// export const sla_report_month_wise_cron_control = async () => {
//     return new Promise((resolve, reject) => {
//         const currentDate = new Date();

//         const isLastDayOfMonth = (date) => {
//             const nextDay = new Date(date);
//             nextDay.setDate(date.getDate() + 1);
//             return nextDay.getDate() === 1; 
//         };

//         if (!isLastDayOfMonth(currentDate)) {
//             resolve({ message: "Report generation skipped, not the last day of the month." });
//             return;
//         }
//         const startYear = currentDate.getFullYear();
//         const startMonth = currentDate.getMonth(); 
//         const startDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-01`;
//         const lastDay = new Date(startYear, startMonth + 1, 0).getDate();
//         const endDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
//         const startTime = new Date(`${startDate}T00:00:00.000Z`);
//         const endTime = new Date(`${endDate}T23:59:59.999Z`);

//         db.collection('day_wise_sla_test').aggregate([
//             {
//                 $match: {
//                     insertedDate: {
//                         $gte: startTime,
//                         $lt: endTime,
//                     },
//                 }
//             },
//             {
//                 $group: {
//                     _id: null, 
//                     totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
//                     totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
//                     totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
//                     callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
//                     totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
//                     totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: null,
//                     ASA_REPORT: {
//                         totalAnsweredCallASA: "$totalAnsweredCallASA",
//                         totalQuedCallsASA: "$totalQuedCallsASA",
//                         percentQuedCallsASA: {
//                             $cond: {
//                                 if: { $gt: ["$totalAnsweredCallASA", 0] },
//                                 then: { $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] },
//                                 else: 0
//                             }
//                         }
//                     },
//                     AHT_REPORT: {
//                         totalAnsweredCallAHT: "$totalAnsweredCallAHT",
//                         callAHT_300_seconds: "$callAHT_300_seconds",
//                         percentAHT_300_seconds: {
//                             $cond: {
//                                 if: { $gt: ["$totalAnsweredCallAHT", 0] },
//                                 then: { $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] },
//                                 else: 0
//                             }
//                         }
//                     },
//                     SEAT_UTILIZATION: {
//                         totalCallsLanded: "$totalCallsLanded",
//                         totalActiveAgent: "$totalActiveAgent",
//                         callsPerActiveAgent: {
//                             $cond: {
//                                 if: { $gt: ["$totalActiveAgent", 0] },
//                                 then: { $divide: ["$totalCallsLanded", "$totalActiveAgent"] },
//                                 else: 0
//                             }
//                         }
//                     },
//                     fromDate: { $literal: startTime },
//                     toDate: { $literal: endTime }
//                 }
//             }
//         ]).toArray()
//         .then((result) => {
//             db.collection('month_wise_sla').insertMany(result).then((response)=>{
//                 resolve(response);
//             }).catch((error)=>{
//                 reject(error)
//             })
//         })
//         .catch((error) => {
//             reject(error);
//         });
//     });
// }


// // completely working code with startDate input
//  export const sla_reports_day_wise_cron_mytest = async (req, res) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const currentDate = new Date();
//             const startDate = new Date(req.body.startDate); // Start from June 1, 2024
//             const endDate = new Date(); // Current date
//             const statuses = ["Answered"];

//             // Function to format date as YYYY-MM-DD
//             const formatDate = (date) => {
//                 return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
//             };

//             const reportData = [];

//             for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
//                 const currentFormattedDate = formatDate(date);
//                 const startTime = new Date(`${currentFormattedDate}T00:00:00.000Z`);
//                 const endTime = new Date(`${currentFormattedDate}T23:59:59.999Z`);
//                 console.log(startTime, endTime, "test");
//                 const query = {
//                     Call_Start_Time: {
//                         $gte: startTime,
//                         $lt: endTime,
//                     },
//                     Status: { $in: statuses },
//                 };

//                 const results = await db.collection('sla_records_sept').aggregate([
//                     {
//                         $facet: {
//                             ASA: [
//                                 { $match: query },
//                                 {
//                                     $group: {
//                                         _id: null,
//                                         totalAnsweredCallASA: { $sum: 1 },
//                                         totalQuedCallsASA: {
//                                             $sum: {
//                                                 $cond: [
//                                                     { $gt: ["$Customer_Queue_Seconds", 0] },
//                                                     {
//                                                         $cond: [
//                                                             { $lte: ["$Customer_Queue_Seconds", 30] },
//                                                             1,
//                                                             0,
//                                                         ],
//                                                     },
//                                                     0,
//                                                 ],
//                                             },
//                                         },
//                                     },
//                                 },
//                                 {
//                                     $project: {
//                                         totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
//                                         totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
//                                         percentQuedCallsASA: {
//                                             $cond: {
//                                                 if: { $gt: ["$totalAnsweredCallASA", 0] },
//                                                 then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
//                                                 else: 0,
//                                             },
//                                         },
//                                     },
//                                 },
//                             ],
//                             AHT: [
//                                 { $match: query },
//                                 {
//                                     $group: {
//                                         _id: null,
//                                         totalAnsweredCallAHT: { $sum: 1 },
//                                         callAHT_300_seconds: {
//                                             $sum: {
//                                                 $cond: [
//                                                     { $gt: ["$Agent_TalkTime", 0] },
//                                                     {
//                                                         $cond: [
//                                                             { $lte: ["$Agent_TalkTime", 300] },
//                                                             1,
//                                                             0,
//                                                         ],
//                                                     },
//                                                     0,
//                                                 ],
//                                             },
//                                         },
//                                     },
//                                 },
//                                 {
//                                     $project: {
//                                         totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
//                                         callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
//                                         percentAHT_300_seconds: {
//                                             $cond: {
//                                                 if: { $gt: ["$totalAnsweredCallAHT", 0] },
//                                                 then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
//                                                 else: 0,
//                                             },
//                                         },
//                                     },
//                                 },
//                             ],
//                             SU: [
//                                 {
//                                     $match: {
//                                         Call_Start_Time: {
//                                             $gte: startTime,
//                                             $lt: endTime,
//                                         },
//                                         Status: { $ne: "System Missed" },
//                                     },
//                                 },
//                                 {
//                                     $group: {
//                                         _id: null,
//                                         totalCallsLanded: { $sum: 1 },
//                                         activeAgents: {
//                                             $addToSet: {
//                                                 $cond: [
//                                                     { $ne: ["$Agent_ID", ""] },
//                                                     "$Agent_ID",
//                                                     null,
//                                                 ],
//                                             },
//                                         },
//                                     },
//                                 },
//                                 {
//                                     $project: {
//                                         totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
//                                         activeAgentCount: {
//                                             $size: {
//                                                 $filter: {
//                                                     input: "$activeAgents",
//                                                     as: "agent",
//                                                     cond: { $ne: ["$$agent", null] },
//                                                 },
//                                             },
//                                         },
//                                         callsPerActiveAgent: {
//                                             $cond: {
//                                                 if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
//                                                 then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
//                                                 else: 0,
//                                             },
//                                         },
//                                     },
//                                 },
//                             ],
//                         },
//                     },
//                     {
//                         $project: {
//                             ASA: { $arrayElemAt: ["$ASA", 0] },
//                             AHT: { $arrayElemAt: ["$AHT", 0] },
//                             SU: { $arrayElemAt: ["$SU", 0] },
//                         },
//                     },
//                 ]).toArray();

//                 let response = {
//                     ASA_REPORT: {
//                         totalAnsweredCallASA: 0,
//                         totalQuedCallsASA: 0,
//                         percentQuedCallsASA: 0,
//                     },
//                     AHT_REPORT: {
//                         totalAnsweredCallAHT: 0,
//                         callAHT_300_seconds: 0,
//                         percentAHT_300_seconds: 0,
//                     },
//                     SEAT_UTILIZATION: {
//                         totalCallsLanded: 0,
//                         totalActiveAgent: 0,
//                         callsPerActiveAgent: 0,
//                     },
//                     insertedDate: startTime,
//                 };

//                 if (results.length > 0) {
//                     const asaData = results[0].ASA || {};
//                     const ahtData = results[0].AHT || {};
//                     const suData = results[0].SU || {};

//                     response.ASA_REPORT.totalAnsweredCallASA = asaData.totalAnsweredCallASA || 0;
//                     response.ASA_REPORT.totalQuedCallsASA = asaData.totalQuedCallsASA || 0;
//                     response.ASA_REPORT.percentQuedCallsASA = asaData.percentQuedCallsASA || 0;

//                     response.AHT_REPORT.totalAnsweredCallAHT = ahtData.totalAnsweredCallAHT || 0;
//                     response.AHT_REPORT.callAHT_300_seconds = ahtData.callAHT_300_seconds || 0;
//                     response.AHT_REPORT.percentAHT_300_seconds = ahtData.percentAHT_300_seconds || 0;

//                     response.SEAT_UTILIZATION.totalCallsLanded = suData.totalCallsLanded || 0;
//                     response.SEAT_UTILIZATION.totalActiveAgent = suData.activeAgentCount || 0;
//                     response.SEAT_UTILIZATION.callsPerActiveAgent = suData.callsPerActiveAgent || 0;
//                 }

//                 const checkAllValues = (obj) => {
//                     return Object.values(obj).every(value => value === 0);
//                 };

//                 const isAllZero = checkAllValues(response.ASA_REPORT)
//                     && checkAllValues(response.AHT_REPORT)
//                     && checkAllValues(response.SEAT_UTILIZATION);

//                 if (!isAllZero) {
//                     await db.collection('day_wise_sla_test_sept').insertOne(response);
//                 }else{
//                     console.log("No records")
//                 }
//             }

//             resolve(1);
//         } catch (err) {
//             console.error("Error generating daily SLA reports:", err);
//             reject(err);
//         }
//     });
// };





 












// async function IndexsForSla(db){
//     db.collection('sla_records').createIndex({ Call_Start_Time: 1 });
//     db.collection('sla_records').createIndex({ Status: 1 });
//     db.collection('sla_records').createIndex({ Agent_ID: 1 });


// }




export const sla_reports = async (req, res) => {
    try {
        IndexsForSla(db)
        let { startDate, endDate, statuses = ["Answered"] } = req.body;
        let message = {
            msg: "Fetched Successfully",
            code: 1,
        };
        
        let cacheKey = `sla_reports_${startDate}_${endDate}`;

        let cachedResult = cache.get(cacheKey);
        if (cachedResult) {
          
            cachedResult = await new UtilService().GZip(cachedResult);
          
            return jsonResponseHandler(cachedResult, message, req, res, () => {});
        }

        const [startDay, startMonth, startYear] = startDate.split('-');
        const [endDay, endMonth, endYear] = endDate.split('-');

        const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
        const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);

        const query = {
            Call_Start_Time: {
                $gte: startTime,
                $lt: endTime
            },
            Status: { $in: statuses }
        };

        const results = await db.collection('sla_records').aggregate([
            {
                $facet: {
                    ASA: [
                        { $match: query },
                        {
                            $group: {
                                _id: null,
                                totalAnsweredCallASA: { $sum: 1 },
                                totalQuedCallsASA: {
                                    $sum: {
                                        $cond: [
                                            { $gt: ["$Customer_Queue_Seconds", 0] },
                                            {
                                                $cond: [
                                                    { $lte: ["$Customer_Queue_Seconds", 30] },
                                                    1,
                                                    0
                                                ]
                                            },
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
                                totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
                                percentQuedCallsASA: {
                                    $cond: {
                                        if: { $gt: ["$totalAnsweredCallASA", 0] },
                                        then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
                                        else: 0
                                    }
                                }
                            }
                        }
                    ],
                    AHT: [
                        { $match: query },
                        {
                            $group: {
                                _id: null,
                                totalAnsweredCallAHT: { $sum: 1 },
                                callAHT_300_seconds: {
                                    $sum: {
                                        $cond: [
                                            { $gt: ["$Agent_TalkTime", 0] },
                                            {
                                                $cond: [
                                                    { $lte: ["$Agent_TalkTime", 300] },
                                                    1,
                                                    0
                                                ]
                                            },
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
                                callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
                                percentAHT_300_seconds: {
                                    $cond: {
                                        if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                        then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
                                        else: 0
                                    }
                                }
                            }
                        }
                    ],
                    SU: [
                        {
                            $match: {
                                Call_Start_Time: {
                                    $gte: startTime,
                                    $lt: endTime
                                },
                                Status: { $ne: "System Missed" }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalCallsLanded: { $sum: 1 },
                                activeAgents: {
                                    $addToSet: {
                                        $cond: [
                                            { $ne: ["$Agent_ID", ""] },
                                            "$Agent_ID",
                                            null
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
                                activeAgentCount: {
                                    $size: {
                                        $filter: {
                                            input: "$activeAgents",
                                            as: "agent",
                                            cond: { $ne: ["$$agent", null] }
                                        }
                                    }
                                },
                                callsPerActiveAgent: {
                                    $cond: {
                                        if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
                                        then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
                                        else: 0
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    ASA: { $arrayElemAt: ["$ASA", 0] },
                    AHT: { $arrayElemAt: ["$AHT", 0] },
                    SU: { $arrayElemAt: ["$SU", 0] }
                }
            }
        ]).toArray();

        const asaData = results[0].ASA;
        const ahtData = results[0].AHT;
        const suData = results[0].SU;

        let response = {
            ASA_REPORT: {
                totalAnsweredCallASA: asaData.totalAnsweredCallASA,
                totalQuedCallsASA: asaData.totalQuedCallsASA,
                percentQuedCallsASA: asaData.percentQuedCallsASA
            },
            AHT_REPORT: {
                totalAnsweredCallAHT: ahtData.totalAnsweredCallAHT,
                callAHT_300_seconds: ahtData.callAHT_300_seconds,
                percentAHT_300_seconds: ahtData.percentAHT_300_seconds
            },
            SEAT_UTILIZATION: {
                totalCallsLanded: suData.totalCallsLanded,
                totalActiveAgent: suData.activeAgentCount,
                callsPerActiveAgent: suData.callsPerActiveAgent
            }
        };

        cache.set(cacheKey, response);

        if (response) {
            response = await new UtilService().GZip(response);
        }

        return jsonResponseHandler(response, message, req, res, () => {});

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};



export const sla_reports_day_wise = async (req, res) => {
    try {
        const currentDate = new Date();
        const startYear = currentDate.getFullYear();
        const startMonth = currentDate.getMonth(); // 0-based month
        const currentDay = currentDate.getDate();
        const statuses = req.body.statuses || ["Answered"];
        const reportData = [];

        let message = {
            msg: "Fetched Successfully",
            code: 1,
        };

        const fetchReportForDay = async (day) => {
            if (day > currentDay) {
                return; 
            }
            const startDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const endDate = startDate;
            const startTime = new Date(`${startDate}T00:00:00.000Z`);
            const endTime = new Date(`${endDate}T23:59:59.999Z`);
            console.log(startTime, endTime);
            
            const query = {
                Call_Start_Time: {
                    $gte: startTime,
                    $lt: endTime,
                },
                Status: { $in: statuses },
            };

            const results = await db.collection('sla_records').aggregate([
                {
                    $facet: {
                        ASA: [
                            { $match: query },
                            {
                                $group: {
                                    _id: null,
                                    totalAnsweredCallASA: { $sum: 1 },
                                    totalQuedCallsASA: {
                                        $sum: {
                                            $cond: [
                                                { $gt: ["$Customer_Queue_Seconds", 0] },
                                                {
                                                    $cond: [
                                                        { $lte: ["$Customer_Queue_Seconds", 30] },
                                                        1,
                                                        0,
                                                    ],
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
                                    totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
                                    percentQuedCallsASA: {
                                        $cond: {
                                            if: { $gt: ["$totalAnsweredCallASA", 0] },
                                            then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                        AHT: [
                            { $match: query },
                            {
                                $group: {
                                    _id: null,
                                    totalAnsweredCallAHT: { $sum: 1 },
                                    callAHT_300_seconds: {
                                        $sum: {
                                            $cond: [
                                                { $gt: ["$Agent_TalkTime", 0] },
                                                {
                                                    $cond: [
                                                        { $lte: ["$Agent_TalkTime", 300] },
                                                        1,
                                                        0,
                                                    ],
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
                                    callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
                                    percentAHT_300_seconds: {
                                        $cond: {
                                            if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                            then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                        SU: [
                            {
                                $match: {
                                    Call_Start_Time: {
                                        $gte: startTime,
                                        $lt: endTime,
                                    },
                                    Status: { $ne: "System Missed" },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalCallsLanded: { $sum: 1 },
                                    activeAgents: {
                                        $addToSet: {
                                            $cond: [
                                                { $ne: ["$Agent_ID", ""] },
                                                "$Agent_ID",
                                                null,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
                                    activeAgentCount: {
                                        $size: {
                                            $filter: {
                                                input: "$activeAgents",
                                                as: "agent",
                                                cond: { $ne: ["$$agent", null] },
                                            },
                                        },
                                    },
                                    callsPerActiveAgent: {
                                        $cond: {
                                            if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
                                            then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        ASA: { $arrayElemAt: ["$ASA", 0] },
                        AHT: { $arrayElemAt: ["$AHT", 0] },
                        SU: { $arrayElemAt: ["$SU", 0] },
                    },
                },
            ]).toArray();

            let response = {
                ASA_REPORT: {
                    totalAnsweredCallASA: 0,
                    totalQuedCallsASA: 0,
                    percentQuedCallsASA: 0,
                },
                AHT_REPORT: {
                    totalAnsweredCallAHT: 0,
                    callAHT_300_seconds: 0,
                    percentAHT_300_seconds: 0,
                },
                SEAT_UTILIZATION: {
                    totalCallsLanded: 0,
                    totalActiveAgent: 0,
                    callsPerActiveAgent: 0,
                },
                insertedDate: startTime
            };

            if (results.length > 0) {
                const asaData = results[0].ASA || {};
                const ahtData = results[0].AHT || {};
                const suData = results[0].SU || {};

                response.ASA_REPORT.totalAnsweredCallASA = asaData.totalAnsweredCallASA || 0;
                response.ASA_REPORT.totalQuedCallsASA = asaData.totalQuedCallsASA || 0;
                response.ASA_REPORT.percentQuedCallsASA = asaData.percentQuedCallsASA || 0;

                response.AHT_REPORT.totalAnsweredCallAHT = ahtData.totalAnsweredCallAHT || 0;
                response.AHT_REPORT.callAHT_300_seconds = ahtData.callAHT_300_seconds || 0;
                response.AHT_REPORT.percentAHT_300_seconds = ahtData.percentAHT_300_seconds || 0;

                response.SEAT_UTILIZATION.totalCallsLanded = suData.totalCallsLanded || 0;
                response.SEAT_UTILIZATION.totalActiveAgent = suData.activeAgentCount || 0;
                response.SEAT_UTILIZATION.callsPerActiveAgent = suData.callsPerActiveAgent || 0;
            }

            reportData.push(response);
            await db.collection('day_wise_sla_test').insertOne(response);

            await fetchReportForDay(day + 1);
        };

        await fetchReportForDay(1);

        return jsonResponseHandler(reportData, message, req, res, () => {});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};




export const calculate_sla_report = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

       
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required." });
        }
        const [startDay, startMonth, startYear] = startDate.split('-');
        const [endDay, endMonth, endYear] = endDate.split('-');
        const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
        const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);

        

        const result = await fetchSLAData(startTime, endTime);
        const systemUpTime = await fetchSystemUptime(startTime, endTime);
        const auditReportInfo = await fetchAuditReportInfo(startTime, endTime);
        const lastSixMonthsData = await fetchLastSixMonthsData(startTime, endTime);
        const lastSixMonthsUptime = await fetchLastSixMonthsUptime(startTime, endTime);
        const fetchTraining = await fetchTrainingData(startTime, endTime)
        const lastSixMonthAuditReport = await fetchLastSixMonthsDataAudit(startTime, endTime)
        const lastSixMonthTrainingReport = await fetchLastSixMonthsTraining(startTime, endTime)


        

        let response = formatResponse(result, systemUpTime, lastSixMonthsData, lastSixMonthsUptime, auditReportInfo,fetchTraining,lastSixMonthAuditReport, lastSixMonthTrainingReport);
        if (response) {
                        response = await new UtilService().GZip([response]);
                    }
        return jsonResponseHandler(response, { msg: "Success", code: 1 }, req, res, () => { });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

const parseDate = (dateStr, timeSuffix) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}T${timeSuffix}`);
};

const fetchSLAData = async (startTime, endTime) => {
    try {
     const result = await db.collection('day_wise_sla_test').aggregate([
            {
                $match: {
                    insertedDate: { $gte: startTime, $lt: endTime }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
                    totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
                    totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
                    callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
                    totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
                    totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" },
                    insertedDate: { $first: "$insertedDate" }
                }
            },
            {
                $project: {
                    _id: { $ifNull: ["$_id", null] },
                    ASA_REPORT: {
                        totalAnsweredCallASA: "$totalAnsweredCallASA",
                        totalQuedCallsASA: "$totalQuedCallsASA",
                        percentQuedCallsASA: {
                            $cond: {
                                if: { $gt: ["$totalAnsweredCallASA", 0] },
                                then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
                                else: 0
                            }
                        }
                    },
                    AHT_REPORT: {
                        totalAnsweredCallAHT: "$totalAnsweredCallAHT",
                        callAHT_300_seconds: "$callAHT_300_seconds",
                        percentAHT_300_seconds: {
                            $cond: {
                                if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
                                else: 0
                            }
                        }
                    },
                    SEAT_UTILIZATION: {
                        totalCallsLanded: "$totalCallsLanded",
                        totalActiveAgent: "$totalActiveAgent",
                        callsPerActiveAgent: {
                            $cond: {
                                if: { $gt: ["$totalActiveAgent", 0] },
                                then: { $round: [{ $divide: ["$totalCallsLanded", "$totalActiveAgent"] }, 2] },
                                else: 0
                            }
                        }
                    },
                }
            }
        ]).toArray();

        // console.log(result)

        return result
    } catch (error) {
        console.error("Error fetching SLA data:", error);
        return [];
    }
};

const fetchSystemUptime = async (startTime, endTime) => {
    try {
        return await db.collection('sla_system_up_time').aggregate([
            {
                $match: {
                    $or: [
                        { startDate: { $gte: startTime, $lt: endTime } },
                        { endDate: { $gte: startTime, $lt: endTime } }
                    ]
                }
            }
        ]).toArray();
    } catch (error) {
        console.error("Error fetching system uptime:", error);
        return [];
    }
};

const fetchAuditReportInfo = async (startTime, endTime) => {
    try {
        return await db.collection('sla_records_audit_sept').aggregate([
            {
                $match: {
                    call_date: { $gte: startTime, $lt: endTime }
                }
            },
            {
                $group: {
                    _id: {
                        agentId: "$agent_id_new",
                        uniqueId: "$uniqueid_new"
                    },
                    totalScore: { $sum: "$total_score_value" }
                }
            },
            {
                $group: {
                    _id: "$_id.agentId",
                    totalScore: { $sum: "$totalScore" },
                    uniqueIdCount: { $addToSet: "$_id.uniqueId" }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalScore: 1,
                    uniqueIdCount: { $size: "$uniqueIdCount" },
                    averageScore: { $divide: ["$totalScore", { $size: "$uniqueIdCount" }] }
                }
            },
            {
                $group: {
                    _id: null,
                    sumOfAverageScores: { $sum: "$averageScore" },
                    totalUniqueAgents: { $addToSet: "$_id" }
                }
            },
            {
                $project: {
                    totalAuditCalls: { $size: "$totalUniqueAgents" },
                    sumOfAverageScores: "$sumOfAverageScores",
                    totalUniqueAgents: { $size: "$totalUniqueAgents" }
                }
            },
            {
                $project: {
                    totalAuditCalls: 1,
                    sumOfAverageScores: 1,
                    totalAgents: "$totalUniqueAgents",
                    percentage: {
                        $round: [
                            {
                                $divide: [
                                    { $ifNull: ["$sumOfAverageScores", 0] },
                                    { $ifNull: ["$totalUniqueAgents", 1] }
                                ]
                            },
                            2
                        ]
                    }
                }
            }
        ]).toArray();
    } catch (error) {
        console.error("Error fetching audit report info:", error);
        return [];
    }
};

const fetchLastSixMonthsData = async (startTime, endTime) => {
    const now = new Date(endTime);
    const lastSixMonthsData = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            value: { percentQuedCalls: "0", percentAHT300: "0", callsPerActiveAgent: "0" }
        };
    });

    for (const monthData of lastSixMonthsData) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - lastSixMonthsData.indexOf(monthData), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - lastSixMonthsData.indexOf(monthData) + 1, 0);
        const monthlyResult = await fetchMonthlySLAData(monthStart, monthEnd);

        if (monthlyResult.length > 0) {
            const monthlyData = monthlyResult[0];
            monthData.value = calculateMonthlyMetrics(monthlyData);
        }
    }
    return lastSixMonthsData;
};

const fetchMonthlySLAData = async (monthStart, monthEnd) => {
    try {
        return await db.collection('day_wise_sla_test').aggregate([
            {
                $match: {
                    insertedDate: { $gte: monthStart, $lt: monthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
                    totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
                    totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
                    callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
                    totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
                    totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" }
                }
            }
        ]).toArray();
    } catch (error) {
        console.error("Error fetching monthly SLA data:", error);
        return [];
    }
};


const fetchLastSixMonthsDataAudit = async (startTime, endTime) => {
    const now = new Date(endTime);
    const lastSixMonthsUptime = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            totalAuditCalls:0,
            sumOfAverageScores:0,
            totalAgents:0,
            percentage:0,

        };
    });
    for (const monthData of lastSixMonthsUptime) {
        const monthStart = new Date(monthData.year, new Date(Date.parse(monthData.month + " 1")).getMonth(), 1);
        const monthEnd = new Date(monthData.year, monthStart.getMonth() + 1, 0);

        const monthlyAuditReportResult = await fetchAuditReportInfo(monthStart, monthEnd);
       
        if (monthlyAuditReportResult.length > 0) {
            monthData.totalAuditCalls = monthlyAuditReportResult[0].totalAuditCalls;
            monthData.sumOfAverageScores = monthlyAuditReportResult[0].sumOfAverageScores,
            monthData.totalAgents = monthlyAuditReportResult[0].sumOfAverageScores,
            monthData.percentage = monthlyAuditReportResult[0].percentage
        }
    }
    return lastSixMonthsUptime;
};

const fetchLastSixMonthsTraining = async (startTime, endTime)=>{
    const now = new Date(endTime);
    const lastSixMonthsUptime = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            
          

        };
    });
    for (const monthData of lastSixMonthsUptime) {
        const monthStart = new Date(monthData.year, new Date(Date.parse(monthData.month + " 1")).getMonth(), 1);
        const monthEnd = new Date(monthData.year, monthStart.getMonth() + 1, 0);

        const monthlyTrainingReportResult = await fetchTrainingData(monthStart, monthEnd);

        console.log(monthlyTrainingReportResult, "monthlyTrainingReportResult")
        if (monthlyTrainingReportResult.length > 0) {
            monthData.agentCompletedSixTwelveMonth = monthlyTrainingReportResult[0].agentCompletedSixTwelveMonth;
            monthData.totalHoursOfTraining = monthlyTrainingReportResult[0].totalHoursOfTraining;
            monthData.averageHours = monthlyTrainingReportResult[0].averageHours;
        }
    }
    return lastSixMonthsUptime
}


const calculateMonthlyMetrics = (monthlyData) => {
    const percentQuedCalls = monthlyData.totalAnsweredCallASA > 0
        ? ((monthlyData.totalQuedCallsASA / monthlyData.totalAnsweredCallASA) * 100).toFixed(2)
        : "0";

    const percentAHT300 = monthlyData.totalAnsweredCallAHT > 0
        ? ((monthlyData.callAHT_300_seconds / monthlyData.totalAnsweredCallAHT) * 100).toFixed(2)
        : "0";

    const callsPerActiveAgent = monthlyData.totalActiveAgent > 0
        ? (monthlyData.totalCallsLanded / monthlyData.totalActiveAgent).toFixed(2)
        : "0";

    return {
        percentQuedCalls,
        percentAHT300,
        callsPerActiveAgent
    };
};

const fetchLastSixMonthsUptime = async (startTime, endTime) => {
    const now = new Date(endTime);
    const lastSixMonthsUptime = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            month: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            uptime: 0
        };
    });

    for (const monthData of lastSixMonthsUptime) {
        const monthStart = new Date(monthData.year, new Date(Date.parse(monthData.month + " 1")).getMonth(), 1);
        const monthEnd = new Date(monthData.year, monthStart.getMonth() + 1, 0);

        const monthlyUptimeResult = await fetchMonthlyUptime(monthStart, monthEnd);
        if (monthlyUptimeResult.length > 0) {
            monthData.uptime = monthlyUptimeResult[0].totalUptime;
        }
    }
    return lastSixMonthsUptime;
};


const fetchMonthlyUptime = async (monthStart, monthEnd) => {
    try {
        return await db.collection('sla_system_up_time').aggregate([
            {
                $match: {
                    startDate: { $gte: monthStart, $lte: monthEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalUptime: { $sum: "$uptime" }
                }
            }
        ]).toArray();
    } catch (error) {
        console.error("Error fetching monthly uptime:", error);
        return [];
    }
};

const fetchTrainingData = async (startTime, endTime)=>{
    try {
        let data = await db.collection('sla_traning_records').aggregate([
            {
                $match: {
                    $or: [
                        { startDate: { $gte: startTime, $lt: endTime } },
                        { endDate: { $gte: startTime, $lt: endTime } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    agentCompletedSixTwelveMonth: 1,
                    totalHoursOfTraining: 1,
                    month: 1,
                    year: 1,
                    averageHours: {
                        $ceil: {
                            $divide: ['$totalHoursOfTraining', '$agentCompletedSixTwelveMonth']
                        }
                    }
                }
            }
        ]).toArray();

        console.log(data)
        
        return data
    } catch (err) {
        console.log(err);
    }
}

const formatResponse = (result, systemUpTime, lastSixMonthsData, lastSixMonthsUptime, auditReportInfo,fetchTraining,lastSixMonthAuditReport,lastSixMonthTrainingReport) => {
    const response = result.length > 0 ? result[0] : {
        ASA_REPORT:{},
        AHT_REPORT:{},
        SEAT_UTILIZATION:{}

    };

    response.ASA_graph = lastSixMonthsData.map(monthData => ({
        month: monthData.month,
        value: monthData.value.percentQuedCalls
    }));

    response.AHT_graph = lastSixMonthsData.map(monthData => ({
        month: monthData.month,
        value: monthData.value.percentAHT300
    }));

    response.SEAT_UTILIZATION_graph = lastSixMonthsData.map(monthData => ({
        month: monthData.month,
        value: monthData.value.callsPerActiveAgent
    }));

  if(fetchTraining.length > 0){
    response.TRAINING_REPORT = {
        agentCompletedSixTwelveMonth :fetchTraining[0].agentCompletedSixTwelveMonth,
        totalHoursOfTraining:fetchTraining[0].totalHoursOfTraining,
        averageHours:fetchTraining[0].averageHours,
        month: fetchTraining[0].month,
        year: fetchTraining[0].year
    }
  }else{
    response.TRAINING_REPORT = {
        agentCompletedSixTwelveMonth :0,
        totalHoursOfTraining:0,
        averageHours:0,
        month: 0,
        year: 0
    }
  }

    if (systemUpTime.length > 0) {
        response.SYSTEM_UPTIME_REPORT = {
            uptime: systemUpTime[0].uptime,
            month: systemUpTime[0].month,
            year: systemUpTime[0].year
        };
    } else {
        response.SYSTEM_UPTIME_REPORT = {
            uptime: 0,
            month: null,
            year: null
        };
    }

    response.SYSTEM_UPTIME_GRAPH = lastSixMonthsUptime.map(monthData => ({
        uptime: monthData.uptime,
        month: monthData.month,
        year: monthData.year
    }));

    if (auditReportInfo.length > 0) {
        response.CALL_QUALITY_SCORE = {
            totalAuditCalls: auditReportInfo[0].totalAuditCalls,
            totalAgents: auditReportInfo[0].totalAgents,
            totalScoreAllAgents: auditReportInfo[0].sumOfAverageScores,
            qualityPercentage: auditReportInfo[0].percentage,
        };
    } else {
        response.CALL_QUALITY_SCORE = {
            totalAuditCalls: 0,
            totalAgents: 0,
            totalScoreAllAgents: 0,
            qualityPercentage: 0,
        };
    }

    response.CALL_QUALITY_SCORE_GRAPH =  lastSixMonthAuditReport.map(monthData =>({
        month:monthData.month,
        year:monthData.year,
        totalAuditCalls: monthData.totalAuditCalls,
        totalAgents: monthData.totalAgents,
        sumOfAverageScores:monthData.sumOfAverageScores,
        percentage: monthData.percentage
    }))

    response.TRANING_REPORT_GRAPH = lastSixMonthTrainingReport.map(monthData =>({
        month:monthData.month,
        year:monthData.year,
        agentCompletedSixTwelveMonth:monthData.agentCompletedSixTwelveMonth,
        totalHoursOfTraining:monthData.totalHoursOfTraining,
        averageHours:monthData.averageHours

    }))

    return response;
};



 export const checkAuditReport = async (req, res)=>{
    try{

         // const auditReportInfo = await db.collection('sla_records_audit_sept').aggregate([
        //     {
        //         $match: {
        //             call_date: {
        //                 $gte: startTime,
        //                 $lt: endTime
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 agentId: "$agent_id_new",
        //                 uniqueId: "$uniqueid_new"
        //             },
        //             totalScore: { $sum:  "$total_score_value"  }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$_id.agentId",
        //             totalScore: { $sum: "$totalScore" },
        //             uniqueIdCount: { $addToSet: "$_id.uniqueId" } 
        //         }
        //     },
        //     {
                
        //         $project: {
        //             _id: 1,
        //             totalScore: 1,
        //             uniqueIdCount: { $size: "$uniqueIdCount" }, 
        //             averageScore: { $divide: ["$totalScore", { $size: "$uniqueIdCount" }] }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             sumOfAverageScores: { $sum: "$averageScore" },
        //             totalUniqueAgents: { $addToSet: "$_id" } 
        //         }
        //     },
        //     {
               
        //         $project: {
        //             totalAuditCalls: { $size: "$totalUniqueAgents" }, 
        //             sumOfAverageScores: "$sumOfAverageScores",
        //             totalUniqueAgents: { $size: "$totalUniqueAgents" }
        //         }
        //     },
        //     {
        //         $project: {
        //             totalAuditCalls: 1,
        //             sumOfAverageScores: 1,
        //             totalAgents: "$totalUniqueAgents",
        //             percentage: {
        //                 $round: [
        //                     { 
        //                         $divide: [
        //                             { $ifNull: ["$sumOfAverageScores", 0] },
        //                             { $ifNull: ["$totalUniqueAgents", 1] } 
        //                         ]
        //                     },
        //                     2 
        //                 ]
        //             }
        //         }
        //     }
        // ]).toArray();
        
        


        // res.send(auditReportInfo)
        let { startDate, endDate } = req.body;
        const [startDay, startMonth, startYear] = startDate.split('-');
        const [endDay, endMonth, endYear] = endDate.split('-');
        const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
        const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);
        let message = {};
        console.log(startTime, endTime);

       

       
        

    }catch(err){
        console.log(err)
    }
}





export const calculate_sla_reportssss = async (req, res) => {
    try {
        let { startDate, endDate } = req.body;
        const [startDay, startMonth, startYear] = startDate.split('-');
        const [endDay, endMonth, endYear] = endDate.split('-');
        const startTime = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00.000Z`);
        const endTime = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59.999Z`);
        let message = {};
        console.log(startTime, endTime);

        const result = await db.collection('day_wise_sla_test').aggregate([
            {
                $match: {
                    insertedDate: {
                        $gte: startTime,
                        $lt: endTime,
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
                    totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
                    totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
                    callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
                    totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
                    totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" },
                    insertedDate: { $first: "$insertedDate" }
                }
            },
            {
                $project: {
                    _id: { $ifNull: ["$_id", null] },
                    ASA_REPORT: {
                        totalAnsweredCallASA: "$totalAnsweredCallASA",
                        totalQuedCallsASA: "$totalQuedCallsASA",
                        percentQuedCallsASA: {
                            $cond: {
                                if: { $gt: ["$totalAnsweredCallASA", 0] },
                                then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
                                else: 0
                            }
                        }
                    },
                    AHT_REPORT: {
                        totalAnsweredCallAHT: "$totalAnsweredCallAHT",
                        callAHT_300_seconds: "$callAHT_300_seconds",
                        percentAHT_300_seconds: {
                            $cond: {
                                if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
                                else: 0
                            }
                        }
                    },
                    SEAT_UTILIZATION: {
                        totalCallsLanded: "$totalCallsLanded",
                        totalActiveAgent: "$totalActiveAgent",
                        callsPerActiveAgent: {
                            $cond: {
                                if: { $gt: ["$totalActiveAgent", 0] },
                                then: { $round: [{ $divide: ["$totalCallsLanded", "$totalActiveAgent"] }, 2] },
                                else: 0
                            }
                        }
                    },
                }
            }
        ]).toArray();

        // Check if the result is empty
        if (result.length === 0) {
            const defaultResponse = {
                ASA_REPORT: {
                    totalAnsweredCallASA: 0,
                    totalQuedCallsASA: 0,
                    percentQuedCallsASA: 0
                },
                AHT_REPORT: {
                    totalAnsweredCallAHT: 0,
                    callAHT_300_seconds: 0,
                    percentAHT_300_seconds: 0
                },
                SEAT_UTILIZATION: {
                    totalCallsLanded: 0,
                    totalActiveAgent: 0,
                    callsPerActiveAgent: 0
                },
                ASA_graph: Array(6).fill({ month: "", value: "0" }),
                AHT_graph: Array(6).fill({ month: "", value: "0" }),
                SEAT_UTILIZATION_graph: Array(6).fill({ month: "", value: "0" }),
                SYSTEM_UPTIME_REPORT: {
                    uptime: 0,
                    month: null,
                    year: null
                },
                SYSTEM_UPTIME_GRAPH: Array(6).fill({ month: "", year: null, uptime: 0 })
            };

            const now = new Date();
            for (let i = 0; i < 6; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthName = date.toLocaleString('default', { month: 'short' });
                
                defaultResponse.ASA_graph[i] = { month: monthName, value: "0" };
                defaultResponse.AHT_graph[i] = { month: monthName, value: "0" };
                defaultResponse.SEAT_UTILIZATION_graph[i] = { month: monthName, value: "0" };
                defaultResponse.SYSTEM_UPTIME_GRAPH[i] = { month: monthName, year: date.getFullYear(), uptime: 0 };
            }

            return jsonResponseHandler([{ ...defaultResponse }], { msg: "Success", code: 1 }, req, res, () => { });
        }

        // Continue processing if data is available
        response = result;

        const systemUpTime = await db.collection('sla_system_up_time').aggregate([
            {
                $match: {
                    $or: [
                        {
                            startDate: {
                                $gte: startTime,
                                $lt: endTime
                            }
                        },
                        {
                            endDate: {
                                $gte: startTime,
                                $lt: endTime
                            }
                        }
                    ]
                }
            },
        ]).toArray();

        const now = new Date();
        const lastSixMonthsData = Array.from({ length: 4 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                value: { percentQuedCalls: "0", percentAHT300: "0", callsPerActiveAgent: "0" }
            };
        });

        for (const monthData of lastSixMonthsData) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - lastSixMonthsData.indexOf(monthData), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - lastSixMonthsData.indexOf(monthData) + 1, 0);

            const monthlyResult = await db.collection('day_wise_sla_test').aggregate([
                {
                    $match: {
                        insertedDate: {
                            $gte: monthStart,
                            $lt: monthEnd,
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
                        totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
                        totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
                        callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
                        totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
                        totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" }
                    }
                }
            ]).toArray();

            if (monthlyResult.length > 0) {
                const monthlyData = monthlyResult[0];

                const percentQuedCalls = monthlyData.totalAnsweredCallASA > 0
                    ? ((monthlyData.totalQuedCallsASA / monthlyData.totalAnsweredCallASA) * 100).toFixed(2)
                    : "0";

                const percentAHT300 = monthlyData.totalAnsweredCallAHT > 0
                    ? ((monthlyData.callAHT_300_seconds / monthlyData.totalAnsweredCallAHT) * 100).toFixed(2)
                    : "0";

                const callsPerActiveAgent = monthlyData.totalActiveAgent > 0
                    ? (monthlyData.totalCallsLanded / monthlyData.totalActiveAgent).toFixed(2)
                    : "0";

                monthData.value = {
                    percentQuedCalls,
                    percentAHT300,
                    callsPerActiveAgent
                };
            }
        }

        const lastSixMonthsUptime = Array.from({ length: 4 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                uptime: 0
            };
        });

        for (const monthData of lastSixMonthsUptime) {
            const monthIndex = new Date(Date.parse(monthData.month + " 1")).getMonth();
            const monthStart = new Date(monthData.year, monthIndex, 1);
            const monthEnd = new Date(monthData.year, monthIndex + 1, 0);

            const monthlyUptimeResult = await db.collection('sla_system_up_time').aggregate([
                {
                    $match: {
                        startDate: { $gte: monthStart, $lte: monthEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalUptime: { $sum: "$uptime" }
                    }
                }
            ]).toArray();

            if (monthlyUptimeResult.length > 0) {
                monthData.uptime = monthlyUptimeResult[0].totalUptime;
            }
        }

        let response = result;

        message = {
            msg: "Success",
            code: 1
        };

        response[0].ASA_graph = lastSixMonthsData.map(monthData => ({
            month: monthData.month,
            value: monthData.value.percentQuedCalls
        }));

        response[0].AHT_graph = lastSixMonthsData.map(monthData => ({
            month: monthData.month,
            value: monthData.value.percentAHT300
        }));

        response[0].SEAT_UTILIZATION_graph = lastSixMonthsData.map(monthData => ({
            month: monthData.month,
            value: monthData.value.callsPerActiveAgent
        }));

        response[0].SYSTEM_UPTIME_REPORT = {
            uptime: systemUpTime[0]?.totalUptime || 0,
            month: systemUpTime[0]?.month || null,
            year: systemUpTime[0]?.year || null
        };

        response[0].SYSTEM_UPTIME_GRAPH = lastSixMonthsUptime.map(monthData => ({
            uptime: monthData.uptime,
            month: monthData.month,
            year: monthData.year
        }));

        return jsonResponseHandler(response, message, req, res, () => { });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};








export const sla_reports_day_wise_cron = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const startDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const endDate = startDate;
            const statuses = ["Answered"];
            const reportData = [];
            const startTime = new Date(`${startDate}T00:00:00.000Z`);
            const endTime = new Date(`${endDate}T23:59:59.999Z`);
            
            const query = {
                Call_Start_Time: {
                    $gte: startTime,
                    $lt: endTime,
                },
                Status: { $in: statuses },
            };
            const results = await db.collection('sla_records').aggregate([
                {
                    $facet: {
                        ASA: [
                            { $match: query },
                            {
                                $group: {
                                    _id: null,
                                    totalAnsweredCallASA: { $sum: 1 },
                                    totalQuedCallsASA: {
                                        $sum: {
                                            $cond: [
                                                { $gt: ["$Customer_Queue_Seconds", 0] },
                                                {
                                                    $cond: [
                                                        { $lte: ["$Customer_Queue_Seconds", 30] },
                                                        1,
                                                        0,
                                                    ],
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
                                    totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
                                    percentQuedCallsASA: {
                                        $cond: {
                                            if: { $gt: ["$totalAnsweredCallASA", 0] },
                                            then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                        AHT: [
                            { $match: query },
                            {
                                $group: {
                                    _id: null,
                                    totalAnsweredCallAHT: { $sum: 1 },
                                    callAHT_300_seconds: {
                                        $sum: {
                                            $cond: [
                                                { $gt: ["$Agent_TalkTime", 0] },
                                                {
                                                    $cond: [
                                                        { $lte: ["$Agent_TalkTime", 300] },
                                                        1,
                                                        0,
                                                    ],
                                                },
                                                0,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
                                    callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
                                    percentAHT_300_seconds: {
                                        $cond: {
                                            if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                            then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                        SU: [
                            {
                                $match: {
                                    Call_Start_Time: {
                                        $gte: startTime,
                                        $lt: endTime,
                                    },
                                    Status: { $ne: "System Missed" },
                                },
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalCallsLanded: { $sum: 1 },
                                    activeAgents: {
                                        $addToSet: {
                                            $cond: [
                                                { $ne: ["$Agent_ID", ""] },
                                                "$Agent_ID",
                                                null,
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
                                    activeAgentCount: {
                                        $size: {
                                            $filter: {
                                                input: "$activeAgents",
                                                as: "agent",
                                                cond: { $ne: ["$$agent", null] },
                                            },
                                        },
                                    },
                                    callsPerActiveAgent: {
                                        $cond: {
                                            if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
                                            then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        ASA: { $arrayElemAt: ["$ASA", 0] },
                        AHT: { $arrayElemAt: ["$AHT", 0] },
                        SU: { $arrayElemAt: ["$SU", 0] },
                    },
                },
            ]).toArray();

            let response = {
                ASA_REPORT: {
                    totalAnsweredCallASA: 0,
                    totalQuedCallsASA: 0,
                    percentQuedCallsASA: 0,
                },
                AHT_REPORT: {
                    totalAnsweredCallAHT: 0,
                    callAHT_300_seconds: 0,
                    percentAHT_300_seconds: 0,
                },
                SEAT_UTILIZATION: {
                    totalCallsLanded: 0,
                    totalActiveAgent: 0,
                    callsPerActiveAgent: 0,
                },
                insertedDate: startTime
            };

            if (results.length > 0) {
                const asaData = results[0].ASA || {};
                const ahtData = results[0].AHT || {};
                const suData = results[0].SU || {};

                response.ASA_REPORT.totalAnsweredCallASA = asaData.totalAnsweredCallASA || 0;
                response.ASA_REPORT.totalQuedCallsASA = asaData.totalQuedCallsASA || 0;
                response.ASA_REPORT.percentQuedCallsASA = asaData.percentQuedCallsASA || 0;

                response.AHT_REPORT.totalAnsweredCallAHT = ahtData.totalAnsweredCallAHT || 0;
                response.AHT_REPORT.callAHT_300_seconds = ahtData.callAHT_300_seconds || 0;
                response.AHT_REPORT.percentAHT_300_seconds = ahtData.percentAHT_300_seconds || 0;

                response.SEAT_UTILIZATION.totalCallsLanded = suData.totalCallsLanded || 0;
                response.SEAT_UTILIZATION.totalActiveAgent = suData.activeAgentCount || 0;
                response.SEAT_UTILIZATION.callsPerActiveAgent = suData.callsPerActiveAgent || 0;
            }

            const checkAllValues = (obj) => {
                return Object.values(obj).every(value => value === 0);
            };

            const isAllZero = checkAllValues(response.ASA_REPORT)
                && checkAllValues(response.AHT_REPORT)
                && checkAllValues(response.SEAT_UTILIZATION);

            if (!isAllZero) {
                const insertResponse = await db.collection('day_wise_sla_test').insertOne(response);
                resolve(1);
            } else {
                resolve(0);
            }
        } catch (err) {
            console.error("Error generating daily SLA report:", err);
            reject(err);
        }
    });
};


export const sla_report_month_wise_cron_control = async () => {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();

        const isLastDayOfMonth = (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            return nextDay.getDate() === 1; 
        };

        if (!isLastDayOfMonth(currentDate)) {
            resolve({ message: "Report generation skipped, not the last day of the month." });
            return;
        }
        const startYear = currentDate.getFullYear();
        const startMonth = currentDate.getMonth(); 
        const startDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(startYear, startMonth + 1, 0).getDate();
        const endDate = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        const startTime = new Date(`${startDate}T00:00:00.000Z`);
        const endTime = new Date(`${endDate}T23:59:59.999Z`);

        db.collection('day_wise_sla_test').aggregate([
            {
                $match: {
                    insertedDate: {
                        $gte: startTime,
                        $lt: endTime,
                    },
                }
            },
            {
                $group: {
                    _id: null, 
                    totalAnsweredCallASA: { $sum: "$ASA_REPORT.totalAnsweredCallASA" },
                    totalQuedCallsASA: { $sum: "$ASA_REPORT.totalQuedCallsASA" },
                    totalAnsweredCallAHT: { $sum: "$AHT_REPORT.totalAnsweredCallAHT" },
                    callAHT_300_seconds: { $sum: "$AHT_REPORT.callAHT_300_seconds" },
                    totalCallsLanded: { $sum: "$SEAT_UTILIZATION.totalCallsLanded" },
                    totalActiveAgent: { $sum: "$SEAT_UTILIZATION.totalActiveAgent" }
                }
            },
            {
                $project: {
                    _id: null,
                    ASA_REPORT: {
                        totalAnsweredCallASA: "$totalAnsweredCallASA",
                        totalQuedCallsASA: "$totalQuedCallsASA",
                        percentQuedCallsASA: {
                            $cond: {
                                if: { $gt: ["$totalAnsweredCallASA", 0] },
                                then: { $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] },
                                else: 0
                            }
                        }
                    },
                    AHT_REPORT: {
                        totalAnsweredCallAHT: "$totalAnsweredCallAHT",
                        callAHT_300_seconds: "$callAHT_300_seconds",
                        percentAHT_300_seconds: {
                            $cond: {
                                if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                then: { $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] },
                                else: 0
                            }
                        }
                    },
                    SEAT_UTILIZATION: {
                        totalCallsLanded: "$totalCallsLanded",
                        totalActiveAgent: "$totalActiveAgent",
                        callsPerActiveAgent: {
                            $cond: {
                                if: { $gt: ["$totalActiveAgent", 0] },
                                then: { $divide: ["$totalCallsLanded", "$totalActiveAgent"] },
                                else: 0
                            }
                        }
                    },
                    fromDate: { $literal: startTime },
                    toDate: { $literal: endTime }
                }
            }
        ]).toArray()
        .then((result) => {
            db.collection('month_wise_sla').insertMany(result).then((response)=>{
                resolve(response);
            }).catch((error)=>{
                reject(error)
            })
        })
        .catch((error) => {
            reject(error);
        });
    });
}


function isBeforeSeptember2024(dateToCheck) {
    const targetDate = new Date('2024-09-01T00:00:00.000Z');
    return dateToCheck < targetDate;
}

// completely working code with startDate input
 export const sla_reports_day_wise_cron_mytest = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDate = new Date();
            const startDate = new Date(req.body.startDate); // Start from June 1, 2024
            const endDate = new Date(); // Current date
            const statuses = ["Answered"];
            console.log(startDate)

            // Function to format date as YYYY-MM-DD
            const formatDate = (date) => {
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            };

            const reportData = [];
            let queedvalue = 30;


            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                const currentFormattedDate = formatDate(date);
                const startTime = new Date(`${currentFormattedDate}T00:00:00.000Z`);
                const endTime = new Date(`${currentFormattedDate}T23:59:59.999Z`);

               let checkDate = await  isBeforeSeptember2024(startTime)
               if(checkDate){
                queedvalue = 45
               }

                // return
                const query = {
                    Call_Start_Time: {
                        $gte: startTime,
                        $lt: endTime,
                    },
                    Status: { $in: statuses },
                };

                const results = await db.collection('sla_records').aggregate([
                    {
                        $facet: {
                            ASA: [
                                { $match: query },
                                {
                                    $group: {
                                        _id: null,
                                        totalAnsweredCallASA: { $sum: 1 },
                                        totalQuedCallsASA: {
                                            $sum: {
                                                $cond: [
                                                    { $gt: ["$Customer_Queue_Seconds", 0] },
                                                    {
                                                        $cond: [
                                                            { $lte: ["$Customer_Queue_Seconds", queedvalue] },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        totalAnsweredCallASA: { $ifNull: ["$totalAnsweredCallASA", 0] },
                                        totalQuedCallsASA: { $ifNull: ["$totalQuedCallsASA", 0] },
                                        percentQuedCallsASA: {
                                            $cond: {
                                                if: { $gt: ["$totalAnsweredCallASA", 0] },
                                                then: { $round: [{ $multiply: [{ $divide: ["$totalQuedCallsASA", "$totalAnsweredCallASA"] }, 100] }, 2] },
                                                else: 0,
                                            },
                                        },
                                    },
                                },
                            ],
                            AHT: [
                                { $match: query },
                                {
                                    $group: {
                                        _id: null,
                                        totalAnsweredCallAHT: { $sum: 1 },
                                        callAHT_300_seconds: {
                                            $sum: {
                                                $cond: [
                                                    { $gt: ["$Agent_TalkTime", 0] },
                                                    {
                                                        $cond: [
                                                            { $lte: ["$Agent_TalkTime", 300] },
                                                            1,
                                                            0,
                                                        ],
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        totalAnsweredCallAHT: { $ifNull: ["$totalAnsweredCallAHT", 0] },
                                        callAHT_300_seconds: { $ifNull: ["$callAHT_300_seconds", 0] },
                                        percentAHT_300_seconds: {
                                            $cond: {
                                                if: { $gt: ["$totalAnsweredCallAHT", 0] },
                                                then: { $round: [{ $multiply: [{ $divide: ["$callAHT_300_seconds", "$totalAnsweredCallAHT"] }, 100] }, 2] },
                                                else: 0,
                                            },
                                        },
                                    },
                                },
                            ],
                            SU: [
                                {
                                    $match: {
                                        Call_Start_Time: {
                                            $gte: startTime,
                                            $lt: endTime,
                                        },
                                        Status: { $ne: "System Missed" },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalCallsLanded: { $sum: 1 },
                                        activeAgents: {
                                            $addToSet: {
                                                $cond: [
                                                    { $ne: ["$Agent_ID", ""] },
                                                    "$Agent_ID",
                                                    null,
                                                ],
                                            },
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        totalCallsLanded: { $ifNull: ["$totalCallsLanded", 0] },
                                        activeAgentCount: {
                                            $size: {
                                                $filter: {
                                                    input: "$activeAgents",
                                                    as: "agent",
                                                    cond: { $ne: ["$$agent", null] },
                                                },
                                            },
                                        },
                                        callsPerActiveAgent: {
                                            $cond: {
                                                if: { $gt: [{ $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }, 0] },
                                                then: { $round: [{ $divide: ["$totalCallsLanded", { $size: { $filter: { input: "$activeAgents", as: "agent", cond: { $ne: ["$$agent", null] } } } }] }, 2] },
                                                else: 0,
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            ASA: { $arrayElemAt: ["$ASA", 0] },
                            AHT: { $arrayElemAt: ["$AHT", 0] },
                            SU: { $arrayElemAt: ["$SU", 0] },
                        },
                    },
                ]).toArray();

                let response = {
                    ASA_REPORT: {
                        totalAnsweredCallASA: 0,
                        totalQuedCallsASA: 0,
                        percentQuedCallsASA: 0,
                    },
                    AHT_REPORT: {
                        totalAnsweredCallAHT: 0,
                        callAHT_300_seconds: 0,
                        percentAHT_300_seconds: 0,
                    },
                    SEAT_UTILIZATION: {
                        totalCallsLanded: 0,
                        totalActiveAgent: 0,
                        callsPerActiveAgent: 0,
                    },
                    insertedDate: startTime,
                };

                if (results.length > 0) {
                    const asaData = results[0].ASA || {};
                    const ahtData = results[0].AHT || {};
                    const suData = results[0].SU || {};

                    response.ASA_REPORT.totalAnsweredCallASA = asaData.totalAnsweredCallASA || 0;
                    response.ASA_REPORT.totalQuedCallsASA = asaData.totalQuedCallsASA || 0;
                    response.ASA_REPORT.percentQuedCallsASA = asaData.percentQuedCallsASA || 0;

                    response.AHT_REPORT.totalAnsweredCallAHT = ahtData.totalAnsweredCallAHT || 0;
                    response.AHT_REPORT.callAHT_300_seconds = ahtData.callAHT_300_seconds || 0;
                    response.AHT_REPORT.percentAHT_300_seconds = ahtData.percentAHT_300_seconds || 0;

                    response.SEAT_UTILIZATION.totalCallsLanded = suData.totalCallsLanded || 0;
                    response.SEAT_UTILIZATION.totalActiveAgent = suData.activeAgentCount || 0;
                    response.SEAT_UTILIZATION.callsPerActiveAgent = suData.callsPerActiveAgent || 0;
                }

                const checkAllValues = (obj) => {
                    return Object.values(obj).every(value => value === 0);
                };

                const isAllZero = checkAllValues(response.ASA_REPORT)
                    && checkAllValues(response.AHT_REPORT)
                    && checkAllValues(response.SEAT_UTILIZATION);

                if (!isAllZero) {
                    await db.collection('day_wise_sla_test_sept_new').insertOne(response);
                }else{
                    console.log("No records")
                }
            }

            resolve(1);
        } catch (err) {
            console.error("Error generating daily SLA reports:", err);
            reject(err);
        }
    });
};











 












async function IndexsForSla(db){
    db.collection('sla_records').createIndex({ Call_Start_Time: 1 });
    db.collection('sla_records').createIndex({ Status: 1 });
    db.collection('sla_records').createIndex({ Agent_ID: 1 });


}






















