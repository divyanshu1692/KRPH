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
import moment from 'moment-timezone'
import NodeCache from 'node-cache'
const myCache = new NodeCache();
import axios from 'axios'
import zlib from 'zlib'

export const griveninceReports = async (req, res) => {
    try {
        const { spFromDate, spToDate, spInsuranceCompanyID, spStateID, spUserID } = req.body;
        let dataInfo = []
        if (!spInsuranceCompanyID || !spStateID || !spUserID) {
            return res.status(200).json({ rcode: 0, rmessage: 'Missing parameters!' });
        }
        const cacheKey = `${spFromDate}_${spToDate}_${spInsuranceCompanyID}_${spStateID}_${spUserID}`;
        const cachedResult = myCache.get(cacheKey);

        if (cachedResult) {
            return res.status(200).json({ rcode: 1, rmessage: 'Success (from cache)', result: cachedResult });
        }
        await db.collection("temp_userdetail").drop();
        const tempCollection = db.collection("temp_userdetail");
        createIndex(db);
        getSupportTicketUserDetail(spUserID).then(async(response)=>{
            console.log(response)
            let responseInfo = await new UtilService().unGZip(response.responseDynamic);
            let item = responseInfo.data.user[0]
            let objectToPass = {
                UserProfileID: item.UserProfileID,
                FromDay: item.FromDay,
                ToDay: item.ToDay,
                AppAccessTypeID: item.AppAccessTypeID,
                AppAccessID: item.AppAccessID,
                BRHeadTypeID:item.BRHeadTypeID,
                LocationTypeID: item.LocationTypeID,
                UserType: item.UserType,
                EscalationFlag: item.EscalationFlag,
                InsuranceCompanyID: item.InsuranceCompanyID ? convertStringToArray(item.InsuranceCompanyID) : [],
                StateMasterID: item.StateMasterID ? convertStringToArray(item.StateMasterID) : [],
                TicketCategoryID: item.TicketCategoryID ? convertStringToArray(item.TicketCategoryID) : []
              }
              dataInfo.push(objectToPass)
              let fromDateUTC = moment.tz(spFromDate, 'Asia/Kolkata').utc().toDate();
              let toDateUTC = moment.tz(spToDate, 'Asia/Kolkata').utc().toDate();
              await tempCollection.insertMany(dataInfo);
                const pipeline = buildAggregationPipeline(spStateID, spInsuranceCompanyID, fromDateUTC, toDateUTC);
                const result = await db.collection('ticketlisting2').aggregate(pipeline, {
                allowDiskUse: true
            }).toArray();
            myCache.set(cacheKey, result, 3600); 
            return res.status(200).json({ rcode: 1, rmessage: 'Success', result });
          
        }).catch((err)=>{
            console.log(err)
        })
       
    } catch (err) {
        console.error('Error fetching grievance reports:', err);
        return res.status(500).json({ rcode: 0, rmessage: 'Internal Server Error' });
    }
};



const buildAggregationPipeline = (spStateID, spInsuranceCompanyID, fromDateUTC, toDateUTC) => {
    return [
        {
            $match: {
                $expr: {
                    $and: [
                        { $gte: ["$InsertDateTime", fromDateUTC] },
                        { $lte: ["$InsertDateTime", toDateUTC] },
                        {
                            $or: [
                                { $eq: [spStateID, "#ALL"] },
                                { $in: ["$StateMasterID", spStateID.split(',')] }
                            ]
                        },
                        {
                            $or: [
                                { $eq: [spInsuranceCompanyID, "#ALL"] },
                                { $in: ["$InsuranceCompanyID", spInsuranceCompanyID.split(',')] }
                            ]
                        }
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "temp_userdetail",
                let: {
                    stateMasterID: "$StateMasterID",
                    insuranceCompanyID: "$InsuranceCompanyID",
                    ticketCategoryID: "$TicketCategoryID"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$$stateMasterID", "$StateMasterID"] },
                                    { $in: ["$$insuranceCompanyID", "$InsuranceCompanyID"] },
                                    {
                                        $cond: {
                                            if: { $eq: ["$BRHeadTypeID", 124303] },
                                            then: { $in: ["$$ticketCategoryID", "$TicketCategoryID"] },
                                            else: true
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: "userDetails"
            }
        },
        {
            $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "user_district_assign",
                let: { accessID: "$userDetails.AppAccessID" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$AppAccessID", "$$accessID"]
                            }
                        }
                    }
                ],
                as: "userDistrictAssign"
            }
        },
        {
            $addFields: {
                LocationTypeID: {
                    $cond: {
                        if: { $eq: ["$LocationTypeID", 1] },
                        then: "$$ROOT",
                        else: { $ifNull: [{ $arrayElemAt: ["$userDistrictAssign.LocationTypeID", 0] }, null] }
                    }
                }
            }
        },
        {
            $project: {
                SupportTicketID: 1,
                InsertDateTime: 1,
                SupportTicketTypeID: 1,
                AgentName: 1,
                CreatedBY: 1,
                CallerContactNumber: 1,
                TicketRequestorID: 1,
                StateMasterID: 1,
                DistrictRequestorID: 1,
                VillageRequestorID: 1,
                SupportTicketNo: 1,
                RequestorUniqueNo: 1,
                RequestorName: 1,
                RequestorMobileNo: 1,
                RequestorAccountNo: 1,
                RequestorAadharNo: 1,
                TicketCategoryID: 1,
                CropCategoryOthers: 1,
                CropStageMasterID: 1,
                TicketHeaderID: 1,
                RequestYear: 1,
                RequestSeason: 1,
                TicketSourceID: 1,
                TicketDescription: 1,
                LossDate: 1,
                LossTime: 1,
                OnTimeIntimationFlag: 1,
                VillageName: 1,
                ApplicationCropName: 1,
                CropName: 1,
                AREA: 1,
                PostHarvestDate: 1,
                TicketStatusID: 1,
                StatusUpdateTime: 1,
                StatusUpdateUserID: 1,
                ApplicationNo: 1,
                InsuranceCompanyID: 1,
                InsurancePolicyNo: 1,
                InsurancePolicyDate: 1,
                InsuranceExpiryDate: 1,
                BankMasterID: 1,
                AgentUserID: 1,
                SchemeID: 1,
                FarmerMasterID: 1,
                AttachmentPath: 1,
                HasDocument: 1,
                InsertUserID: 1,
                InsertIPAddress: 1,
                UpdateUserID: 1,
                UpdateDateTime: 1,
                UpdateIPAddress: 1,
                Relation: 1,
                RelativeName: 1,
                SubDistrictID: 1,
                SubDistrictName: 1,
                PolicyPremium: 1,
                PolicyArea: 1,
                PolicyType: 1,
                LandSurveyNumber: 1,
                LandDivisionNumber: 1,
                PlotVillageName: 1,
                PlotDistrictName: 1,
                ApplicationSource: 1,
                CropShare: 1,
                IFSCCode: 1,
                FarmerShare: 1,
                SowingDate: 1,
                CropSeasonName: 1,
                TicketSourceName: 1,
                TicketCategoryName: 1,
                TicketStatus: 1,
                InsuranceCompany: 1,
                Created: 1,
                TicketTypeName: 1,
                StateMasterName: 1,
                DistrictMasterName: 1,
                TicketHeadName: 1,
                BMCGCode: 1,
                BusinessRelationName: 1,
                SchemeName: 1,
                SupportTicketTypeName: 1,
                StatusDate: "$StatusUpdateTime",
                InsuranceMasterName: "$InsuranceCompany",
                ReOpenDate: "$supportTicketHistory.TicketHistoryDate"
            }
        },
        {
            $sort: { SupportTicketID: 1 }
        }
    ];
};


const getSupportTicketUserDetail = (userID) => {
    const data = { userID };
  
    return axios.post(process.env.USER_DETAIL_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN
      }
    })
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; 
    });
  };



async function createIndex(db) {
    await db.collection("support_ticket_history").createIndex({ SupportTicketID: 1, TicketStatusID: 1 });
    await db.collection("user_district_assign").createIndex({ AppAccessID: 1 });
    await db.collection("ticketlisting2").createIndex({ SupportTicketID: 1 });
    await db.collection("ticketlisting2").createIndex({ InsertDateTime: -1 });
    await db.collection("ticketlisting2").createIndex({ StateMasterID: 1 });
    await db.collection("temp_userdetail").createIndex({ StateMasterID: 1 });
    await db.collection("temp_userdetail").createIndex({ InsuranceCompanyID: 1 });
    await db.collection("temp_userdetail").createIndex({ TicketCategoryID: 1 });
}

function convertStringToArray(str) {
    return str.split(",").map(Number);
  }