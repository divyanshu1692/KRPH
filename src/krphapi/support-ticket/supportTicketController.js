import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {SupportTicketService} from "./supportTicketService.js";
import {UtilService} from "../../helper/utilService.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import util from "util";
export class SupportTicketController {
    constructor() {
        this.utilService = new UtilService()
        this.supportTicketService = new SupportTicketService()
    }
  
    getFarmerTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_FARMERTICKET_VIEW_CSC)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getTicketsListIndex = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getTicketsListIndex1(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_VIEW_CSC_INDEX)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
       generateOfflineSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.generateOfflineSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getOfflineSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getOfflineSupportTicket(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_VIEW_CSC)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addCSCSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addCSCSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
      getSupportAgeingReportDetail = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportAgeingReportDetail(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getBulkTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getBulkTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_BULK_TICKET_VIEW_CSC)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getExcelBulkTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getExcelBulkTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_HISTORY_EXCEL_INSERT)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    supportTicketViewInsurance = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_VIEW_INSURANCE)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    supportTicketCropLossView = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getCropTicketList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    farmerSelectCallingHistory= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.farmerSelectCallingHistory(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    farmerCallingHistory= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.farmerCallingHistory(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    complaintMailReport= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.complaintMailReport(req.body, req.user)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }




    supportTicketHistoryReport= async (req, res) => {
        try {
            let {data, message} = await this.supportTicketService.supportTicketHistoryReport(req.body, req.user)

            if(data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    addSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addFarmerSupportTicket= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addFarmerSupportTicket(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    generateSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.generateSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    updateTicketStatus = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.updateTicketStatus(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    callVoiceCallAPI= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.callVoiceCallAPI()

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addBulkSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addBulkSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    updateFarmerTicketStatus = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.updateFarmerTicketStatus(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addFarmerSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addFarmerSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getFarmerSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    editSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.editSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    sendSMSToFarmer = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.sendSMSToFarmer(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    sendSMSToNewFarmer = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.sendSMSToNewFarmer(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getSupportTicketCategoryReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketCategoryReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getSupportAgeingReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportAgeingReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getSupportTicketReopenDetailReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketReopenDetailReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getSupportTicketDetailReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketDetailReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    uploadDocument = async (req, res) => {
        try {
            console.log('req.file',req.data);
              //  await uploadFile(req, res,next);
                        if (req.file == undefined) {
                  return res.status(400).send({ message: "Please upload a file!" });
                }
            
                res.status(200).send({
                  message: "Uploaded the file successfully: " + req.file.originalname,
                });
              } catch (err) {
                console.log(err);
            
          /*      if (err.code == "LIMIT_FILE_SIZE") {
                  return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                  });
                }
            */
                res.status(500).send({
                  message: `Could not upload the file: ${req.file.originalname}. ${err}`,
                });
              }
            };

            

            insuranceAssignTickets = async (req, res)=>{
                try{
                    let { item, message, failedRecords, existingRecords } = await this.supportTicketService.insuranceUserAssignTicket(req.body);
                    let data = {
                        item :item,
                        message:message,
                        failedRecords:failedRecords,
                        existingRecords:existingRecords
                    }
                    if(data) data = await this.utilService.GZip(data);
            
                    console.log(data)
                    return jsonResponseHandler(data, message, req, res, () => {})
            
                   }catch(err){
                    return jsonErrorHandler(err, req, res, () => {
                    })
                   }
            }
            
            
            
            
            
            
            
                        userWiseTicketList = async(req,res)=>{
                            try{
                                let {data, message} = await this.supportTicketService.userWiseListTickets(req.body)
                                // let data = await this.supportTicketService.userWiseListTickets(req.body)
                                if(data) data = await this.utilService.GZip(data);
                                return jsonResponseHandler(data, message, req, res, () => {})
                    
                            }catch(err){
                                console.log(err)
                                return jsonErrorHandler(err, req, res, () => {
                                })
                            }
                        }
            
            
            
            
                        insuranceUnassignTickets = async (req, res)=>{
                            try{
                             let {data , message } = await this.supportTicketService.insuranceUserUnassignTicket(req.body);
                             if(data) data = await this.utilService.GZip(data);
                             return jsonResponseHandler(data, message, req, res, () => {})
                     
                            }catch(err){
                             return jsonErrorHandler(err, req, res, () => {
                             })
                            }
                         }
            
      
    allUnassignedTickets = async (req, res)=>{
        try{
            let {data, message} = await this.supportTicketService.allUnassignedTicketsList(req.body)
            // let data = await this.supportTicketService.userWiseListTickets(req.body)
            if(data) data = await this.utilService.GZip(data);
            return jsonResponseHandler(data, message, req, res, () => {})

        }catch(err){
            console.log(err)
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
            
            
    agentListAndCount = async (req,res)=>{
    try{
        console.log(req.body);
        let {data, message} = await this.supportTicketService.agentListAndTicketCount(req.body)
        if(data) data = await this.utilService.GZip(data);
        return jsonResponseHandler(data, message, req, res, () => {})
    }catch(error){
        return jsonErrorHandler(error, req, res, () => {
        })
    }
}


    UserAssignedTicketsList = async (req, res)=>{
    try{    
        let data = await this.supportTicketService.userAssignedTicketListing(req.body)
        if(data) data = await this.utilService.GZip(data);
        return jsonResponseHandler(data, message, req, res, () => {})
    }catch(err){
        return jsonErrorHandler(err, req, res, () => {
        })
    }
    }

    getTicketStatusByPhoneNumber = async (req, res) => {
        const { phoneNumber, ticketNumber } = req.body;
        let ticket_status;
        let projection = {"Farmer Name": 1, "Description": 1, "Insurance Company": 1, 'Type': 1, 
            "Creation Date": 1, "State": 1, "Status Date": 1,"Ticket No": 1, "Ticket Status": 1, _id: 0 };

        // phoneNumber or ticketNumber is required. Validate for that.
        if (!phoneNumber && !ticketNumber) {
            return jsonErrorHandler(Error("'phoneNumber' or 'ticketNumber' required."), req, res.status(400), () => {
        });
        }
        
        // ticketNumber is not provided i.e phoneNumber is given
        if (!ticketNumber) {
            ticket_status = await req.db.collection('krph_ticket_history_test')
                .find({'Mobile No': phoneNumber},  { projection })
            .toArray();
        } else {
            // phoneNumber is not provided i.e ticketNumber is given
            ticket_status = await req.db.collection('krph_ticket_history_test')
            .findOne({'Ticket No': ticketNumber},  { projection })
        }

        let message = {
            msg: "Success",
            code: 1,
        };
        return jsonResponseHandler(ticket_status, message, req, res, () => {});
        
    }


        
    }

 

        // const reportHistory = async (req, res)=>{
        //     try {
        //         const { spFromDate, spToDate, spInsuranceCompanyID, spStateID, spUserID } = req.body;
        
        //         // Validate inputs
        //         if (!spInsuranceCompanyID || !spStateID || !spUserID) {
        //             return res.status(200).json({ rcode: 0, rmessage: 'Missing parameters!' });
        //         }
        
        //         const cacheKey = `${spFromDate}_${spToDate}_${spInsuranceCompanyID}_${spStateID}_${spUserID}`;
        //         const cachedResult = myCache.get(cacheKey);
        
        //         if (cachedResult) {
        //             return res.status(200).json({ rcode: 1, rmessage: 'Success (from cache)', result: cachedResult });
        //         }
        
        //         await db.collection("temp_userdetail").drop();
        //         const tempCollection = db.collection("temp_userdetail");
        //         createIndex(db);
        
        //         let dataInfo = await FN_FETCH_USER_TICKET_DETAIL(spUserID, db);
        //         let fromDateUTC = moment.tz(spFromDate, 'Asia/Kolkata').utc().toDate();
        //         let toDateUTC = moment.tz(spToDate, 'Asia/Kolkata').utc().toDate();
        
        //         await tempCollection.insertMany(dataInfo);
        
        //         let pipeline = [
        //             {
        //                 $match: {
        //                     $expr: {
        //                         $and: [
        //                             { $gte: ["$InsertDateTime", fromDateUTC] },
        //                             { $lte: ["$InsertDateTime", toDateUTC] },
        //                             {
        //                                 $or: [
        //                                     { $eq: [spStateID, "#ALL"] },
        //                                     { $in: ["$StateMasterID", spStateID.split(',')] }
        //                                 ]
        //                             },
        //                             {
        //                                 $or: [
        //                                     { $eq: [spInsuranceCompanyID, "#ALL"] },
        //                                     { $in: ["$InsuranceCompanyID", spInsuranceCompanyID.split(',')] }
        //                                 ]
        //                             }
        //                         ]
        //                     }
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "temp_userdetail",
        //                     let: {
        //                         stateMasterID: "$StateMasterID",
        //                         insuranceCompanyID: "$InsuranceCompanyID",
        //                         ticketCategoryID: "$TicketCategoryID"
        //                     },
        //                     pipeline: [
        //                         {
        //                             $match: {
        //                                 $expr: {
        //                                     $and: [
        //                                         { $in: ["$$stateMasterID", "$StateMasterID"] },
        //                                         { $in: ["$$insuranceCompanyID", "$InsuranceCompanyID"] },
        //                                         {
        //                                             $cond: {
        //                                                 if: { $eq: ["$BRHeadTypeID", 124303] },
        //                                                 then: { $in: ["$$ticketCategoryID", "$TicketCategoryID"] },
        //                                                 else: true
        //                                             }
        //                                         }
        //                                     ]
        //                                 }
        //                             }
        //                         }
        //                     ],
        //                     as: "userDetails"
        //                 }
        //             },
        //             {
        //                 $unwind: {
        //                     path: "$userDetails",
        //                     preserveNullAndEmptyArrays: true
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "user_district_assign",
        //                     let: { accessID: "$userDetails.AppAccessID" },
        //                     pipeline: [
        //                         {
        //                             $match: {
        //                                 $expr: {
        //                                     $eq: ["$AppAccessID", "$$accessID"]
        //                                 }
        //                             }
        //                         }
        //                     ],
        //                     as: "userDistrictAssign"
        //                 }
        //             },
        //             {
        //                 $addFields: {
        //                     LocationTypeID: {
        //                         $cond: {
        //                             if: { $eq: ["$LocationTypeID", 1] },
        //                             then: "$$ROOT",
        //                             else: { $ifNull: [{ $arrayElemAt: ["$userDistrictAssign.LocationTypeID", 0] }, null] }
        //                         }
        //                     }
        //                 }
        //             },
        //             {
        //                 $project: {
        //                     SupportTicketID: 1,
        //                     InsertDateTime: 1,
        //                     SupportTicketTypeID: 1,
        //                     AgentName: 1,
        //                     CreatedBY: 1,
        //                     CallerContactNumber: 1,
        //                     TicketRequestorID: 1,
        //                     StateMasterID: 1,
        //                     DistrictRequestorID: 1,
        //                     VillageRequestorID: 1,
        //                     SupportTicketNo: 1,
        //                     RequestorUniqueNo: 1,
        //                     RequestorName: 1,
        //                     RequestorMobileNo: 1,
        //                     RequestorAccountNo: 1,
        //                     RequestorAadharNo: 1,
        //                     TicketCategoryID: 1,
        //                     CropCategoryOthers: 1,
        //                     CropStageMasterID: 1,
        //                     TicketHeaderID: 1,
        //                     RequestYear: 1,
        //                     RequestSeason: 1,
        //                     TicketSourceID: 1,
        //                     TicketDescription: 1,
        //                     LossDate: 1,
        //                     LossTime: 1,
        //                     OnTimeIntimationFlag: 1,
        //                     VillageName: 1,
        //                     ApplicationCropName: 1,
        //                     CropName: 1,
        //                     AREA: 1,
        //                     PostHarvestDate: 1,
        //                     TicketStatusID: 1,
        //                     StatusUpdateTime: 1,
        //                     StatusUpdateUserID: 1,
        //                     ApplicationNo: 1,
        //                     InsuranceCompanyID: 1,
        //                     InsurancePolicyNo: 1,
        //                     InsurancePolicyDate: 1,
        //                     InsuranceExpiryDate: 1,
        //                     BankMasterID: 1,
        //                     AgentUserID: 1,
        //                     SchemeID: 1,
        //                     FarmerMasterID: 1,
        //                     AttachmentPath: 1,
        //                     HasDocument: 1,
        //                     InsertUserID: 1,
        //                     InsertIPAddress: 1,
        //                     UpdateUserID: 1,
        //                     UpdateDateTime: 1,
        //                     UpdateIPAddress: 1,
        //                     Relation: 1,
        //                     RelativeName: 1,
        //                     SubDistrictID: 1,
        //                     SubDistrictName: 1,
        //                     PolicyPremium: 1,
        //                     PolicyArea: 1,
        //                     PolicyType: 1,
        //                     LandSurveyNumber: 1,
        //                     LandDivisionNumber: 1,
        //                     PlotVillageName: 1,
        //                     PlotDistrictName: 1,
        //                     ApplicationSource: 1,
        //                     CropShare: 1,
        //                     IFSCCode: 1,
        //                     FarmerShare: 1,
        //                     SowingDate: 1,
        //                     CropSeasonName: 1,
        //                     TicketSourceName: 1,
        //                     TicketCategoryName: 1,
        //                     TicketStatus: 1,
        //                     InsuranceCompany: 1,
        //                     Created: 1,
        //                     TicketTypeName: 1,
        //                     StateMasterName: 1,
        //                     DistrictMasterName: 1,
        //                     TicketHeadName: 1,
        //                     BMCGCode: 1,
        //                     BusinessRelationName: 1,
        //                     SchemeName: 1,
        //                     SupportTicketTypeName: 1,
        //                     StatusDate: "$StatusUpdateTime",
        //                     InsuranceMasterName: "$InsuranceCompany",
        //                     ReOpenDate: "$supportTicketHistory.TicketHistoryDate"
        //                 }
        //             },
        //             {
        //                 $sort: { SupportTicketID: 1 }
        //             }
        //         ];
        
        //         const result = await db.collection('ticketlisting2').aggregate(pipeline, {
        //             allowDiskUse: true
        //         }).toArray();
        
        //         myCache.set(cacheKey, result, 3600); // 3600 seconds = 1 hour
        
        //         return res.status(200).json({ rcode: 1, rmessage: 'Success', result });
        
        //     } catch (err) {
        //         console.error('Error fetching grievance reports:', err);
        //         return res.status(500).json({ rcode: 0, rmessage: 'Internal Server Error' });
        //     }
        // }

        // async function createIndex(db) {
        //     await db.collection("support_ticket_history").createIndex({ SupportTicketID: 1, TicketStatusID: 1 });
        
        //     await db.collection("user_district_assign").createIndex({ AppAccessID: 1 });
        
        //     await db.collection("ticketlisting2").createIndex({ SupportTicketID: 1 });
        //     await db.collection("ticketlisting2").createIndex({ InsertDateTime: -1 });
        //     await db.collection("ticketlisting2").createIndex({ StateMasterID: 1 });
        
        //     // Create separate indexes for each array field
        //     await db.collection("temp_userdetail").createIndex({ StateMasterID: 1 });
        //     await db.collection("temp_userdetail").createIndex({ InsuranceCompanyID: 1 });
        //     await db.collection("temp_userdetail").createIndex({ TicketCategoryID: 1 });
        // }

        // async function FN_FETCH_USER_TICKET_DETAIL(_USERID, db) {
        //     try {
      
        //         let info = await bm_app_access.aggregate([
        //             {
        //                 $match: {
        //                     AppAccessID: _USERID
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "brm_business_relation",
        //                     localField: "BRHeadTypeID",
        //                     foreignField: "BRHeadID",
        //                     as: "business_relation"
        //                 }
        //             },
        //             {
        //                 $unwind: {
        //                     path: "$business_relation",
        //                     preserveNullAndEmptyArrays: true
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "user_profile_assign",
        //                     localField: "AppAccessID",
        //                     foreignField: "AccessID",
        //                     as: "user_profiles"
        //                 }
        //             },
        //             {
        //                 $unwind: {
        //                     path: "$user_profiles",
        //                     preserveNullAndEmptyArrays: true
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "ticket_escalation_matrix",
        //                     localField: "user_profiles.UserProfileID",
        //                     foreignField: "UserProfileID",
        //                     as: "escalation_matrix"
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "user_insurance_assign",
        //                     localField: "AppAccessID",
        //                     foreignField: "AppAccessID",
        //                     as: "user_insurance_assign"
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "user_state_assign",
        //                     localField: "AppAccessID",
        //                     foreignField: "AppAccessID",
        //                     as: "user_state_assign"
        //                 }
        //             },
        //             {
        //                 $lookup: {
        //                     from: "user_category_assign",
        //                     localField: "AppAccessID",
        //                     foreignField: "AppAccessID",
        //                     as: "user_category_assign"
        //                 }
        //             },
        //             {
        //                 $addFields: {
        //                     VarLossCatID: {
        //                         $reduce: {
        //                             input: {
        //                                 $filter: {
        //                                     input: "$user_category_assign",
        //                                     cond: { $eq: ["$$this.SupportTicketTypeID", 11] }
        //                                 }
        //                             },
        //                             initialValue: [],
        //                             in: {
        //                                 $concatArrays: [
        //                                     "$$value",
        //                                     [{ $toString: "$$this.TicketCategoryID" }]
        //                                 ]
        //                             }
        //                         }
        //                     }
        //                 }
        //             },
        //             {
        //                 $addFields: {
        //                     InsuranceCompanyID: {
        //                         $cond: {
        //                             if: { $eq: ["$AppAccessID", 999] },
        //                             then: {
        //                                 $reduce: {
        //                                     input: {
        //                                         $ifNull: ["$user_insurance_assign", []]
        //                                     },
        //                                     initialValue: [],
        //                                     in: {
        //                                         $concatArrays: [
        //                                             "$$value",
        //                                             [{ $toString: "$$this.InsuranceCompanyID" }]
        //                                         ]
        //                                     }
        //                                 }
        //                             },
        //                             else: {
        //                                 $reduce: {
        //                                     input: {
        //                                         $ifNull: ["$user_insurance_assign", []]
        //                                     },
        //                                     initialValue: [],
        //                                     in: {
        //                                         $concatArrays: [
        //                                             "$$value",
        //                                             [{ $toString: "$$this.InsuranceCompanyID" }]
        //                                         ]
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     },
        //                     StateMasterID: {
        //                         $reduce: {
        //                             input: {
        //                                 $ifNull: ["$user_state_assign", []]
        //                             },
        //                             initialValue: [],
        //                             in: {
        //                                 $concatArrays: [
        //                                     "$$value",
        //                                     [{ $toString: "$$this.StateMasterID" }]
        //                                 ]
        //                             }
        //                         }
        //                     },
        //                     TicketCategoryID: {
        //                         $cond: {
        //                             if: { $eq: ["$AppAccessID", 999] },
        //                             then: {
        //                                 $reduce: {
        //                                     input: {
        //                                         $concatArrays: [
        //                                             [{ $ifNull: ["$VarLossCatID", []] }],
        //                                             {
        //                                                 $map: {
        //                                                     input: "$user_category_assign",
        //                                                     as: "cat",
        //                                                     in: { $toString: "$$cat.TicketCategoryID" }
        //                                                 }
        //                                             }
        //                                         ]
        //                                     },
        //                                     initialValue: [],
        //                                     in: {
        //                                         $concatArrays: [
        //                                             "$$value",
        //                                             ["$$this"]
        //                                         ]
        //                                     }
        //                                 }
        //                             },
        //                             else: {
        //                                 $reduce: {
        //                                     input: {
        //                                         $ifNull: ["$user_category_assign", []]
        //                                     },
        //                                     initialValue: [],
        //                                     in: {
        //                                         $concatArrays: [
        //                                             "$$value",
        //                                             [{ $toString: "$$this.TicketCategoryID" }]
        //                                         ]
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             },
        //             {
        //                 $addFields: {
        //                     InsuranceCompanyID: {
        //                         $reduce: {
        //                             input: {
        //                                 $ifNull: ["$InsuranceCompanyID", []]
        //                             },
        //                             initialValue: "",
        //                             in: {
        //                                 $concat: [
        //                                     "$$value",
        //                                     {
        //                                         $cond: {
        //                                             if: { $eq: ["$$value", ""] },
        //                                             then: "",
        //                                             else: ","
        //                                         }
        //                                     },
        //                                     "$$this"
        //                                 ]
        //                             }
        //                         }
        //                     },
        //                     StateMasterID: {
        //                         $reduce: {
        //                             input: {
        //                                 $ifNull: ["$StateMasterID", []]
        //                             },
        //                             initialValue: "",
        //                             in: {
        //                                 $concat: [
        //                                     "$$value",
        //                                     {
        //                                         $cond: {
        //                                             if: { $eq: ["$$value", ""] },
        //                                             then: "",
        //                                             else: ","
        //                                         }
        //                                     },
        //                                     "$$this"
        //                                 ]
        //                             }
        //                         }
        //                     },
        //                     TicketCategoryID: {
        //                         $reduce: {
        //                             input: {
        //                                 $ifNull: ["$TicketCategoryID", []]
        //                             },
        //                             initialValue: "",
        //                             in: {
        //                                 $concat: [
        //                                     "$$value",
        //                                     {
        //                                         $cond: {
        //                                             if: { $eq: ["$$value", ""] },
        //                                             then: "",
        //                                             else: ","
        //                                         }
        //                                     },
        //                                     "$$this"
        //                                 ]
        //                             }
        //                         }
        //                     }
        //                 }
        //             },
        //             {
        //                 $project: {
        //                     _id: 0,
        //                     UserProfileID: "$user_profiles.UserProfileID",
        //                     AppAccessTypeID: 1,
        //                     AppAccessID: "$AppAccessID",
        //                     BRHeadTypeID: 1,
        //                     LocationTypeID: 1,
        //                     UserType: "$business_relation.OrganisationName",
        //                     EscalationFlag: {
        //                         $cond: [
        //                             {
        //                                 $in: ["$user_profiles.UserProfileID", "$escalation_matrix.UserProfileID"]
        //                             },
        //                             "Y",
        //                             "N"
        //                         ]
        //                     },
        //                     InsuranceCompanyID: {
        //                         $trim: {
        //                             input: {
        //                                 $ifNull: ["$InsuranceCompanyID", ""]
        //                             }
        //                         }
        //                     },
        //                     StateMasterID: {
        //                         $trim: {
        //                             input: {
        //                                 $ifNull: ["$StateMasterID", ""]
        //                             }
        //                         }
        //                     },
        //                     TicketCategoryID: {
        //                         $trim: {
        //                             input: {
        //                                 $ifNull: ["$TicketCategoryID", ""]
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
      
      
        //         ])
        //         let sfUser;
        //         console.log(info)
        //         let stateID = convertStringToArray(info[0].StateMasterID);
        //         let insuranceId = convertStringToArray(info[0].InsuranceCompanyID);
                
        //         info[0].StateMasterID = stateID
        //         info[0].InsuranceCompanyID = insuranceId
      
      
           
        //         if(info.length == 1){
                 
        //           return info
        //           sfUser = 1
        //         }else {
        //           sfUser
        //         }
        
        //         return sfUser
               
        //     } catch (err) {
        //         console.error(err);
        //         throw err;
        //     }
        // }

        // function convertStringToArray(str) {
        //     return str.split(",").map(Number);
        //   }


          

    