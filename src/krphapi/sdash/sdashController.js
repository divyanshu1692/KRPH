import {jsonErrorHandler, jsonResponseHandler,sendErrorResponse} from "../../helper/errorHandler";
import {MongoClient} from 'mongodb'
import fs from 'fs';
import util from "util";
import {UtilService} from "../../helper/utilService";


// const uri = process.env.MONGODB;
// console.log(uri)
// const client = new MongoClient(uri);
// const db = client.db('krph_db');
// client.connect().then((res)=>{
//     console.log("connectedMongo")
// }).catch((err)=>{
//     console.log(err)
// })


import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 2400 }); 


const dateValidator = (datestr) => {
  try {
    return new Date(datestr);
  } catch(err) {
    return "Invalid date format."
  }
}

export const get_total_report = async (req, res) => {
    console.log(req.body)
    const {from , to } = req.body;
    if (!from || !to ) {
      return sendErrorResponse(res,"Both 'from' and 'to'  dates are required.",1);
    }
        let fromdatecheck = dateValidator(from);
        if  ( !(fromdatecheck instanceof Date)) {
          return sendErrorResponse(res,"Invalid from date format",1);
        }
        let todatecheck = dateValidator(to);
        if  (!(todatecheck instanceof Date)) {
          return sendErrorResponse(res,"Invalid to date format.",1);
        }

        let message = {
            msg: "Fetched Successfully",
            code: 1,
        };
        const query = {           
            Status: "Answered",
        };
          //  const uri = process.env.MONGODB;
          //  addIndexes(uri);
          // const client = new MongoClient(uri);
        
          try {
            
            // await client.connect();
            
            // const database = client.db('krph_db');
            // const collectioninb = database.collection('sla_records');

            const database = await req.db;
            const collectioninb = database.collection('sla_records');
        
            const inb_results = await collectioninb.aggregate(
              [
                { $match: { 
                  Call_Start_Time: {
                  $gte: fromdatecheck,
                  $lte: todatecheck,
                },
              }
              },
                {
                  $lookup: {
                    from: 'krph_ticket_history_test',
                    localField: {
                      $toInt: 'Customer_Number'
                    },
                    foreignField: 'fullMobile',
                    as: 'result'
                  }
                },
                { $match: { result: { $ne: [] } } },
                {
                  $group: {
                    _id: null,
                    totalCallSeconds: {
                      $sum: '$Customer_pulse'
                    }
                  }
                }
              ],
              { maxTimeMS: 60000, allowDiskUse: true }
            ).toArray();

            if(inb_results[0].totalCallSeconds >0){
               var totalsec =inb_results[0].totalCallSeconds;
               var totalcost= (inb_results[0].totalCallSeconds)*('1.25');
               var totlGst= (totalcost*18)/100;
               var totalbillingcost = totalcost+totlGst;

            
            }


            const collectionoutb = database.collection('Krph_ob_test');
            const outb_results = await collectionoutb.aggregate(
                [
                  {
                    $lookup: {
                      from: 'krph_ticket_history_test',
                      localField: 'CUST_NUM',
                      foreignField: 'Mobile_No',
                      as: 'result'
                    }
                  },
                  { $match: { result: { $ne: [] } } },
                  {
                    $group: {
                      _id: null,
                      totalCallSeconds: {
                        $sum: '$Cust_Pulse'
                      }
                    }
                  }
                ],
                { maxTimeMS: 60000, allowDiskUse: true }
              ).toArray();

            if(outb_results[0].totalCallSeconds >0){
                var totalsec1 =outb_results[0].totalCallSeconds;
               var totalcost1= (outb_results[0].totalCallSeconds)*('1.25');
               var totlGst1= (totalcost1*18)/100;
               var totalbillingcost1 = totalcost1+totlGst1;              
            }
        
            const collectionagent = database.collection('sla_records');
            const agent_results = await collectionagent.aggregate(
                [
                    {
                    $lookup: {
                        from: 'Sep_agent_activity_LoginHr',
                        localField: 'Agent_Number',
                        foreignField: 'agent_number',
                        "pipeline":[{"$match":{last_status:"ACTIVE"}}],
                        as: 'result'
                      }
                  },
                  { $match: { result: { $ne: [] } } },
                  {
                    $group: {
                      _id: null,
                      totalCallSeconds: {
                       $sum: '$Customer_pulse'
                      }
                    }
                  }
                ],
                { maxTimeMS: 60000, allowDiskUse: true }
              ).toArray();

            if(agent_results[0].totalCallSeconds >0){
                var agent_totalsec =agent_results[0].totalCallSeconds;
               var agent_totalcost= (agent_results[0].totalCallSeconds)*('31000');
               var agent_totlGst= (agent_totalcost*18)/100;
               var agent_totalbillingcost = agent_totalcost+agent_totlGst;              
            }

           var  resoutput={"inboundCalls" : totalbillingcost, "outboundCalls" : totalbillingcost1, "agents" : agent_totalbillingcost };
            let response = resoutput;
            message = {
                msg: "Success",           
                code: 1
            };
                 
            if (response) {
              response = await new UtilService().GZip([response]);
          }
            return jsonResponseHandler(response, message, req, res, () => { });
    
        
          } catch (err) {
            console.error('Error during aggregation:', err);
          } 
          
          // finally {
          //   await client.close();
          // }
        
    
};


const addIndexes = async (uri) => {
  const client = new MongoClient(uri);
  
  try {
      await client.connect();
      const database = client.db('krph_db');
      await database.collection('sla_records').createIndex({ Customer_Number: 1, Status: 1 });
      await database.collection('krph_ticket_history_test').createIndex({ fullMobile: 1 });
      await database.collection('krph_ticket_history_test').createIndex({ Mobile_No: 1 });
      await database.collection('Krph_ob_test').createIndex({ CUST_NUM: 1 });
      await database.collection('Sep_agent_activity_LoginHr').createIndex({ agent_number: 1 });
      
      console.log("Indexes created successfully.");
  } catch (err) {
      console.error("Error creating indexes:", err);
  } finally {
      await client.close();
  }
};


export const get_dashboard = async (req, res) => {
  let message = {
    msg: "Fetched Successfully",
    code: 1,
  };
const {from , to } = req.body;
if (!from || !to ) {
  return sendErrorResponse(res,"Both 'from' and 'to'  dates are required.",1);
}


let fromdatecheck = dateValidator(from);
if  ( !(fromdatecheck instanceof Date)) {
  return sendErrorResponse(res,"Invalid from date format",1);
}
let todatecheck = dateValidator(to);
if  (!(todatecheck instanceof Date)) {
  return sendErrorResponse(res,"Invalid to date format.",1);
}
const fromFormatted = formatDateToMMDDYYYYHHMM(from);
const toFormatted = formatDateToMMDDYYYYHHMM(to);
  // const client = new MongoClient(uri);
console.log(fromFormatted, toFormatted);

const sdateObj = new Date(from)
sdateObj.setHours(0, 0, 0, 0);
const edateObj = new Date(to);
edateObj.setHours(0, 0, 0, 0);

  try {
    
    // await client.connect();
   
    const db = await req.db;
    
    
    const active_agent_data = await db.collection('Sep_agent_activity_LoginHr').aggregate(
      [
        {
          $match: {
            first_login_time: {
              $gte: from,
              $lte: to,
            },
          },
        },
        { $group: { _id: '$agent_number' } },
        { $count: 'totalCount' },
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    ).toArray();
    const active_agent = active_agent_data.length > 0 ? active_agent_data[0].totalCount : 0;

    console.log(active_agent, sdateObj, edateObj);
    // Call Attended Query
    const call_attended_data = await db.collection('sla_records').aggregate(
      [
        {
          $match: {
              Call_Start_Time: {
              $gte: sdateObj,
              $lte: edateObj,
            },
          },
        },
        {$match:  {$expr: {
          $gt: [
              { $toInt: "$Customer_Call_Sec" }, // Convert the string field to Int32
              0 // Replace this with the user inputted integer value
          ]
      }
        }},
        // { $match: { Customer_Call_Sec: { $gt: 0 } } },
        { $count: 'totalCalls' },
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    ).toArray();

const call_attended = call_attended_data.length > 0 ?  call_attended_data[0].totalCalls : 0;

console.log(call_attended);


    // // Total Training Hours Query
    const total_training_hr_data = await db.collection('krph_agent_training_data').aggregate([
      {
        $match: {
          date: {
            $gte: sdateObj,
            $lte: edateObj,
          },
        },
      },
      {
        $group: {
          _id: "$_Id", // Group by _Id or customerId
          totalTrainingHours: { $sum: "$training_hours" }, // Sum training_hours
        },
      },
    ]).toArray();
    const total_training_hr = total_training_hr_data.length > 0 ? total_training_hr_data[0].totalTrainingHours : 0;
    console.log(total_training_hr)
    const total_working_days_in_month = total_training_hr > 0 ? (total_training_hr / 12).toFixed(2) : 0;
    // Construct the response object
    let data = {
      active_agent,
      call_attended,
      total_training_hr,
      total_working_days_in_month
    };

    // Send the response
    message = {
      msg: "Success",
      code: 1,
    };
    console.log(data);

    if (data) {
      data = await new UtilService().GZip([data]);
  }
    return jsonResponseHandler(data, message, req, res, () => { });

  } catch (err) {
    console.error('Error during aggregation:', err);
    return res.status(500).json({
      message: {
        msg: "Error occurred",
        code: 0,
      },
      error: err.message,
    });
  }
  //  finally {
  //   // Ensure the session is closed after the operation completes
  //   await client.close();
  // }
};

export const getPulsShareAndCost = async (req, res) => {
  let message = {
    msg: "Fetched Successfully",
    code: 1,
  };
const {active_agent, from, to } = req.body;
if (!from || !to || !active_agent) {
  return sendErrorResponse(res,"Both 'from' and 'to'  dates and active_agent are required.", 1 );
}

let fromdatecheck = dateValidator(from);
if  ( !(fromdatecheck instanceof Date)) {
  return sendErrorResponse(res,"Invalid from date format",1);
}
let todatecheck = dateValidator(to);
if  (!(todatecheck instanceof Date)) {
  return sendErrorResponse(res,"Invalid to date format.",1);
}

const fromFormatted = formatDateToYYYYMMDD(from);
  const toFormatted = formatDateToYYYYMMDD(to) ;
  console.log(fromFormatted);
  // const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    // await client.connect();
   
    // const db = client.db('krph_db');
    const db = await req.db;


    const inboundDataCollection = db.collection('sla_records');

    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          Agent_Call_Start_Time: {
            $gte: from,   // From date as string
            $lte: to// Replace with your 'to' date
      }
    }
    },
    {
      $addFields: {
        "Customer_Number_new": {$convert: {
          input: "$Customer_Number",
          to: "int",
          onError: "Conversion Error",  // Specify how to handle errors
          onNull: "Value is null"        // Specify how to handle null values
        }
      }},
      
    },
      {
        $lookup: {
          from: "krph_ticket_history_test",            // The collection to join
          localField: "Customer_Number_new",     // Field from the inbounddata collection
          foreignField: "Mobile_No",         // Field from the ticket_history collection
          as: "ticketHistory"                 // Alias for the joined data 
        }
      },
      {
        $group: {
          _id: "$_Id",                        // Group by the unique identifier
          totalCustomerPulse: { $sum: "$Customer_pulse" },  // Sum Customer_pulse for matched records
          matchedCustomerPulse: { 
            $sum: {
              $cond: { 
                if: { $gt: [{ $size: "$ticketHistory" }, 0] }, // Check if matched
                then: "$Customer_pulse", 
                else: 0 
              }
            }
          }, // Total pulse for matched records
          unmatchedCustomerPulse: { 
            $sum: {
              $cond: { 
                if: { $eq: [{ $size: "$ticketHistory" }, 0] }, // Check if unmatched
                then: "$Customer_pulse", 
                else: 0 
              }
            }
          } // Total pulse for unmatched records
        }
      },
      {
        $project: {
          _id: 0,                              // Exclude _id field from output
          customerId: "$_Id",                  // Include customerId in output
          totalCustomerPulse: 1,                // Total Customer_pulse for all records
          matchedCustomerPulse: 1,              // Sum of matched Customer_pulse
          unmatchedCustomerPulse: 1             // Sum of unmatched Customer_pulse
        }
      }
    ];

    
    // Execute the aggregation
    const result = await inboundDataCollection.aggregate(pipeline).toArray();

    console.log(result)

    const {totalCustomerPulse,matchedCustomerPulse,unmatchedCustomerPulse} = {...result[0]}

    const pipeline2 = [
      {
        $match: {
          Agent_Call_Start_Time: {
            $gte: fromFormatted,   // From date as string
            $lte: toFormatted// Replace with your 'to' date
      }
    }
    },
      {
        $lookup: {
          from: 'ticket_history',
          localField: 'Customer_Number',
          foreignField: 'fullMobile',
          as: 'tickethistory'
        }
      },
      { $match: { tickethistory: { $ne: [] } } },
      {
        $group: {
          _id: {
            $arrayElemAt: [
              '$tickethistory.Insurance_Company',
              0
            ]
          },
          totalPulses: { $sum: '$Customer_pulse' },
          totalPulseShare: {
            $sum: '$Customer_pulse'
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalPulses: 1,
          percentagePulse: {
            $multiply: [
              { $divide: ['$totalPulses', matchedCustomerPulse] },
              100
            ]
          },
          agentCost: {
            $multiply: ['$totalPulses', active_agent]
          }
        }
      }
    ];
    let IC_data = await inboundDataCollection.aggregate(pipeline2).toArray();


    IC_data = IC_data.map(data => {
      let untaged_pulses
      try{
      untaged_pulses = (result[0].unmatchedCustomerPulse * data.percentagePulse) / 100;
    }catch(e){
      untaged_pulses = 0
    }
      const total_billing_pulses = data.totalPulses + untaged_pulses ;
      const total_amount = total_billing_pulses * 1.25 ;
      return {
        ...data,
        taged_pulses: data.totalPulses,
        untaged_pulses,
        total_billing_pulses ,
        total_amount,
        grand_total_amount : total_amount * 1.18
      };
    });
    


    // Construct the response object
    let data = {
      totalCustomerPulse,
      matchedCustomerPulse,
      unmatchedCustomerPulse,
      IC_data
    };

    // Send the response
    message = {
      msg: "Success",
      code: 1,
    };

    if (data) {
      data = await new UtilService().GZip([data]);
  }

    //console.log(response);
    return jsonResponseHandler(data, message, req, res, () => { });

  } catch (err) {
    console.error('Error during aggregation:', err);
    return res.status(500).json({
      message: {
        msg: "Error occurred",
        code: 0,
      },
      error: err.message,
    });
  } 
  // finally {
  //   // Ensure the session is closed after the operation completes
  //   await client.close();
  // }
};

export const getPulsShareAndCostOb = async (req, res) => {
  let message = {
    msg: "Fetched Successfully",
    code: 1,
  };
const {active_agent, from, to } = req.body;


if (!from || !to || !active_agent) {
  return sendErrorResponse(res,"Both 'from' and 'to'  dates and active_agent are required.", 1 );
}

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db('krph_db');


    const inboundDataCollection = db.collection('ob');

    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          AGENT_CALL_START_TIME: {
            $gte: from,
            $lte: to
          }
        }
      },
    
      {
        $lookup: {
          from: "ticket_history",            // The collection to join
          localField: "CUST_NUM",     // Field from the inbounddata collection
          foreignField: "Mobile_No",         // Field from the ticket_history collection
          as: "ticketHistory"                 // Alias for the joined data
        }
      },
      {
        $group: {
          _id: "$_Id",                        // Group by the unique identifier
          totalCustomerPulse: { $sum: "$Cust_Pulse" },  // Sum Customer_pulse for matched records
          matchedCustomerPulse: { 
            $sum: {
              $cond: { 
                if: { $gt: [{ $size: "$ticketHistory" }, 0] }, // Check if matched
                then: "$Cust_Pulse", 
                else: 0 
              }
            }
          }, // Total pulse for matched records
          unmatchedCustomerPulse: { 
            $sum: {
              $cond: { 
                if: { $eq: [{ $size: "$ticketHistory" }, 0] }, // Check if unmatched
                then: "$Cust_Pulse", 
                else: 0 
              }
            }
          } // Total pulse for unmatched records
        }
      },
      {
        $project: {
          _id: 0,                              // Exclude _id field from output
          customerId: "$_Id",                  // Include customerId in output
          totalCustomerPulse: 1,                // Total Customer_pulse for all records
          matchedCustomerPulse: 1,              // Sum of matched Customer_pulse
          unmatchedCustomerPulse: 1             // Sum of unmatched Customer_pulse
        }
      }    
    ];
    
    // Execute the aggregation
    const result = await inboundDataCollection.aggregate(pipeline).toArray();
    const {totalCustomerPulse,matchedCustomerPulse,unmatchedCustomerPulse} = {...result[0]}

    const pipeline2 = [
      {
        $match: {
          AGENT_CALL_START_TIME: {
            $gte: from,
            $lte: to
          }
        }
      },
    
          {
            $lookup: {
              from: 'ticket_history',
              localField: 'CUST_NUM',
              foreignField: 'Mobile_No',
              as: 'tickethistory'
            }
          },
          { $match: { tickethistory: { $ne: [] } } },
          {
            $group: {
              _id: {
                $arrayElemAt: [
                  '$tickethistory.Insurance_Company',
                  0
                ]
              },
              totalPulses: { $sum: '$Cust_Pulse' },
              totalPulseShare: {
                $sum: '$Cust_Pulse'
              }
            }
          },
          {
            $project: {
              _id: 1,
              totalPulses: 1,
              percentagePulse: {
                $multiply: [
                  { $divide: ['$totalPulses', matchedCustomerPulse] },
                  100
                ]
              },
              agentCost: {
                $multiply: ['$totalPulses', active_agent]
              },
            }
          }
    ];
    let IC_data = await inboundDataCollection.aggregate(pipeline2).toArray();


    IC_data = IC_data.map(data => {
      let untaged_pulses
      try{
      untaged_pulses = (result[0].unmatchedCustomerPulse * data.percentagePulse) / 100;
    }catch(e){
      untaged_pulses = 0
    }
      const total_billing_pulses = data.totalPulses + untaged_pulses ;
      const total_amount = total_billing_pulses * 1.25 ;
      return {
        ...data,
        taged_pulses: data.totalPulses,
        untaged_pulses,
        total_billing_pulses ,
        total_amount,
        grand_total_amount : total_amount * 1.18
      };
    });
    


    // Construct the response object
    let data = {
      totalCustomerPulse,
      matchedCustomerPulse,
      unmatchedCustomerPulse,
      IC_data
    };

    // Send the response
    message = {
      msg: "Success",
      code: 1,
    };

    if (data) {
      data = await new UtilService().GZip([data]);
  }
    //console.log(response);
    return jsonResponseHandler(data, message, req, res, () => { });

  } catch (err) {
    console.error('Error during aggregation:', err);
    return res.status(500).json({
      message: {
        msg: "Error occurred",
        code: 0,
      },
      error: err.message,
    });
  } finally {
    // Ensure the session is closed after the operation completes
    await client.close();
  }
};

export const get_dashboard_ob = async (req, res) => {
  let message = {
    msg: "Fetched Successfully",
    code: 1,
  };
  const { from, to } = req.body;

  if (!from || !to ) {
    return sendErrorResponse(res,"Both 'from' and 'to'  dates are required.",1);
  }
  const fromFormatted = `${from} 00:00:00`;
  const toFormatted = `${to} 23:59:59` ;
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db('krph_db');

    // Active Agent Query
    const ob_counts = await db.collection('ob').aggregate([
      {
        $addFields: {
          custCallStartDate: {
            $dateFromString: {
              dateString: "$CUST_CALL_START_TIME",
              format: "%Y-%m-%d %H:%M:%S"
            }
          }
        }
      },
      {
        $match: {
          custCallStartDate: {
            $gte: new Date(from),
            $lte: new Date(to)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCustPulse: { $sum: "$Cust_Pulse" },
          distinctAgents: { $addToSet: "$AGENT_NUM" },
          totalCalls: {
            $sum: {
              $cond: [{ $gt: ["$cust_duration", 0] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalCustPulse: 1,
          totalDistinctAgents: { $size: "$distinctAgents" },
          totalCalls: 1
        }
      }
    ]).toArray();
    const ob_counts_data = ob_counts.length > 0 ? ob_counts[0] : {totalCustPulse: 0,totalCalls: 0,totalDistinctAgents: 0}
    let data = {
      ...ob_counts_data
    };

    // Send the response
    message = {
      msg: "Success",
      code: 1,
    };
    if (data) {
      data = await new UtilService().GZip([data]);
  }
    //console.log(response);
    return jsonResponseHandler(data, message, req, res, () => { });

  } catch (err) {
    console.error('Error during aggregation:', err);
    return res.status(500).json({
      message: {
        msg: "Error occurred",
        code: 0,
      },
      error: err.message,
    });
  } finally {
    // Ensure the session is closed after the operation completes
    await client.close();
  }
};

export const get_sms_cost = async (req, res) => {
  let message = {
    msg: "Fetched Successfully",
    code: 1,
  };
const {active_agent, from, to } = req.body;

if (!from || !to || !active_agent) {
  return sendErrorResponse(res,"Both 'from' and 'to'  dates and active_agent are required.", 1 );
}
const fromFormatted = formatDateToYYYYMMDD(from);
  const toFormatted = formatDateToYYYYMMDD(to) ;
  console.log(fromFormatted);
  const client = new MongoClient(uri);

  try {
   
    await client.connect();
    const db = client.db('krph_db');


    const inboundDataCollection = db.collection('inbounddata');

    
    const pipeline = [
      {
        $match: {
          Agent_Call_Start_Time: {
            $gte: fromFormatted,   
            $lte: toFormatted
      }
    }
    },
      {
        $lookup: {
          from: "ticket_history",      
          localField: "Customer_Number",     
          foreignField: "Mobile_No",         
          as: "ticketHistory"                
        }
      },
      {
        $group: {
          _id: "$_Id",                      
          totalCustomerPulse: { $sum: "$Customer_pulse" },  
          matchedCustomerPulse: { 
            $sum: {
              $cond: { 
                if: { $gt: [{ $size: "$ticketHistory" }, 0] }, 
                then: "$Customer_pulse", 
                else: 0 
              }
            }
          }, 
          unmatchedCustomerPulse: { 
            $sum: {
              $cond: { 
                if: { $eq: [{ $size: "$ticketHistory" }, 0] }, 
                then: "$Customer_pulse", 
                else: 0 
              }
            }
          } 
        }
      },
      {
        $project: {
          _id: 0,                              // Exclude _id field from output
          customerId: "$_Id",                  // Include customerId in output
          totalCustomerPulse: 1,                // Total Customer_pulse for all records
          matchedCustomerPulse: 1,              // Sum of matched Customer_pulse
          unmatchedCustomerPulse: 1             // Sum of unmatched Customer_pulse
        }
      }
    ];
    
    // Execute the aggregation
    const result = await inboundDataCollection.aggregate(pipeline).toArray();
    const {totalCustomerPulse,matchedCustomerPulse,unmatchedCustomerPulse} = {...result[0]}

    const pipeline2 = [
      {
        $match: {
          Agent_Call_Start_Time: {
            $gte: fromFormatted,   // From date as string
            $lte: toFormatted// Replace with your 'to' date
      }
    }
    },
      {
        $lookup: {
          from: 'ticket_history',
          localField: 'Customer_Number',
          foreignField: 'fullMobile',
          as: 'tickethistory'
        }
      },
      { $match: { tickethistory: { $ne: [] } } },
      {
        $group: {
          _id: {
            $arrayElemAt: [
              '$tickethistory.Insurance_Company',
              0
            ]
          },
          totalPulses: { $sum: '$Customer_pulse' },
          totalPulseShare: {
            $sum: '$Customer_pulse'
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalPulses: 1,
          percentagePulse: {
            $multiply: [
              { $divide: ['$totalPulses', matchedCustomerPulse] },
              100
            ]
          },
          agentCost: {
            $multiply: ['$totalPulses', active_agent]
          }
        }
      }
    ];
    let IC_data = await inboundDataCollection.aggregate(pipeline2).toArray();

    const smsDataCollection = db.collection('SMS_Summary_Report');

    const smsResulet = await smsDataCollection.aggregate([
      {
        $match: {
          "Group By": {
            $gte: new Date(from),  // replace with your "from" date
            $lte: new Date(to)  // replace with your "to" date
          }
        }
      },
      {
        $group: {
          _id: null,  // No specific grouping, just sum up
          totalSubmitted: { $sum: "$Submitted" }
        }
      }
    ]).toArray();

    let {totalSubmitted} = smsResulet.length > 0 ? {...smsResulet[0]} : {totalSubmitted:0}


    IC_data = IC_data.map(data => {
      let sms_count
      try{
        sms_count = (totalSubmitted * data.percentagePulse) / 100;
    }catch(e){
      sms_count = 0
    }
      const total_amount = sms_count * 0.125 ;
      return {
        _id : data._id,
        percentageShare : data.percentagePulse,
        sms_count,
        total_amount,
        grand_total_amount : total_amount * 1.18
      };
    });
    


   
    let data = {
      totalCustomerPulse,
      matchedCustomerPulse,
      unmatchedCustomerPulse,
      IC_data
    };

 
    message = {
      msg: "Success",
      code: 1,
    };
    if (data) {
      data = await new UtilService().GZip([data]);
  }
    
    return jsonResponseHandler(data, message, req, res, () => { });

  } catch (err) {
    console.error('Error during aggregation:', err);
    return res.status(500).json({
      message: {
        msg: "Error occurred",
        code: 0,
      },
      error: err.message,
    });
  } finally {
   
    await client.close();
  }
};


export const agentWorkigDays_new = async (req, res) => {
  let message = {
    msg: "Fetched Successfully",
    code: 1,
  };
  const { from, to } = req.body;
 
  if (!from || !to ) {
    return sendErrorResponse(res,"Both 'from' and 'to'  dates are required.",1);
  }

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('krph_db');

    // Fetch working days data
    const user_data = await db.collection('agent_activity_LoginHr').aggregate([
      {
        $match: {
          first_login_time: {
            $gte: from,
            $lte: to,
          },
        },
      },
      {
        $group: {
          _id: '$user',
          totalWorkingDays: { $sum: 1 },
        },
      },
    ]).toArray();

    // Fetch inbound data
    const inboundData = await db.collection('inbounddata').aggregate([
      {
        $addFields: {
          Call_Start_Date: {
            $dateFromString: {
              dateString: "$Call_Start_Time",
              format: "%m/%d/%Y %H:%M",
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      {
        $match: {
          Status: 'Answered',
          Call_Start_Date: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $group: {
          _id: '$Agent_ID',
          callAttended: { $sum: 1 },
          totalPulsesIB: { $sum: '$Customer_pulse' },
        },
      },
    ]).toArray();

    // Fetch outbound data
    const ob_result = await db.collection('ob').aggregate([
      {
        $match: {
          AGENT_CALL_START_TIME: {
            $gte: `${from} 00:00:00`,
            $lte: `${to} 23:59:59`,
          },
          AGENT_CALL_STATUS: 'ANSWERED',
        },
      },
      {
        $group: {
          _id: '$user',
          totalOBCalls: { $sum: 1 },
          totalPulsesOB: { $sum: '$Cust_Pulse' },
        },
      },
    ]).toArray();

    // Fetch training data
    const training_data = await db.collection('agent_training_Data').aggregate([
      {
        $match: {
          date: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $group: {
          _id: '$user',
          totalTrainingHours: { $sum: '$training_hours' },
        },
      },
    ]).toArray();

    // Helper function to map data based on user/agent ID
    const mapDataByUser = (dataArray, key) =>
      dataArray.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {});

    // Map data by user/agent ID
    const userDataMap = mapDataByUser(user_data, 'user');
    const inboundDataMap = mapDataByUser(inboundData, 'Agent_ID');
    const outboundDataMap = mapDataByUser(ob_result, 'user');
    const trainingDataMap = mapDataByUser(training_data, 'user');

    // Merge data based on user/agent ID
    const mergedData = Object.keys(userDataMap).map((userId) => {
      const totalWorkingDays = userDataMap[userId]?.totalWorkingDays || 0;
      const totalTrainingHours = trainingDataMap[userId]?.totalTrainingHours || 0;
      let totalNoofWorkingDays;
  try {
    totalNoofWorkingDays = totalWorkingDays + totalTrainingHours / 8;
  } catch (error) {
    console.error(`Error calculating training hours for user ${userId}:`, error);
    totalNoofWorkingDays = totalWorkingDays;
  }
      return ({
      user: userId,
      totalWorkingDays,
      callAttended: inboundDataMap[userId]?.callAttended || 0,
      totalPulsesIB: inboundDataMap[userId]?.totalPulsesIB || 0,
      totalOBCalls: outboundDataMap[userId]?.totalOBCalls || 0,
      totalPulsesOB: outboundDataMap[userId]?.totalPulsesOB || 0,
      totalTrainingHours: trainingDataMap[userId]?.totalTrainingHours || 0,
      totalNoofWorkingDays
    })});

    // Send the response
    message = {
      msg: "Success",
      code: 1,
    };
    return jsonResponseHandler(mergedData, message, req, res, () => {});

  } catch (err) {
    console.error('Error during aggregation:', err);
    return res.status(500).json({
      message: {
        msg: "Error occurred",
        code: 0,
      },
      error: err.message,
    });
  } finally {
    await client.close();
  }
};

function formatDateToMMDDYYYYHHMM(dateString) {
  const date = new Date(dateString);
  
  const month = (date.getMonth() + 1).toString(); // Months are 0-indexed
  const day = date.getDate().toString();
  const year = date.getFullYear();
  const hour = '00'; // Fixed hour
  const minute = '00'; // Fixed minute
  
  // Format: mm/dd/yyyy hh:mm
  return `${month}/${day}/${year} ${hour} ${minute}`;
}
function formatDateToYYYYMMDD(dateString) {
  const date = new Date(dateString);
  const newdate =  new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  }).format(date);
  return newdate.replace(',','')
}
