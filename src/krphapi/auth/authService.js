import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import {AuthHelpers} from "../../helper/authHelper.js";
import axios from "axios";
import {constant} from "../../constants/constant.js";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import https from "https";
import bcrypt  from "bcryptjs";
import cron  from "node-cron";
import nodemailer  from "nodemailer";

export class AuthService {

    constructor() {
        this.utilService = new UtilService();
    //   this.scheduler();
    }
    async getTime(body) {
        const timestamp = moment().utc();
        return {timestamp}
    }
   
    async cscInboundVoiceSelectApi(body) {
        let items = {};
        let message = '';
                await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_CSC_INBOUND_VOICE_BOT_HISTORY_SELECT}(
       :SPFROMDATE,
       :SPTODATE,
       :SPBatchID,           	
        @rcode, @rmessage)`, {
            replacements: {
                
                SPFROMDATE: body.fromDate ,
                SPTODATE: body.toDate,
                SPBatchID: body.batchID,
               
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
          //  console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
              //  console.log("result", result)
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                const report = Object.values(res[0]).map((el) => el);
               
                items = {report}
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error(err)
        })
        return {data: items, message};
    }  
	   async supportTicketMongoDBSYNC(body) {
        let items = {};
        let message = '';
        console.log("body",body);
             await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_MONGODB_SYNC}(
        :SPViewMode,
        :SPFROMDATE,
       :SPTODATE,
        :SPPageIndex,
	   :SPPageSize,
       @SPRecordCount, 	
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPFROMDATE: body.fromDate || null,
                SPTODATE: body.toDate || null,
                SPPageIndex: body.pageIndex, 
                SPPageSize: body.pageSize,
                        },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message,@SPRecordCount as count').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
              
                const supportTicket = Object.values(res[0]).map((el) => el);
                items = { supportTicket,count:data[0].count}
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error('Something Went Wrong!')
        })
        return {data: items, message};
    }
    async getSupportTicketUserDetail(body) {
        let message = '';
        let items = {};
        console.log('body',body);
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_USER_DETAIL}(
        :SPUserID,
         @rcode, @rmessage)`, {
            replacements: {
                SPUserID: +body.userID
                                    
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                const user = Object.values(res[0]).map((el) => el);
                items={user:user};
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
  
	   async getTicketStatusChatBot(body) {
        let items = {};
        let message = '';
        
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_STATUS_CHATBOT}(
       
       :SPRequestorMobileNo)`, {
            replacements: {
                
                SPRequestorMobileNo: body.requestorMobileNo || body.RequestorMobileNo || ""
                            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log(res,'res');
            //     await sequelize.query('select @rcode AS code, @rmessage AS message').then(async (result) => {
                           
                const response = res['0'];
                console.log('response',response)
                    if ((response['0'].rcode  === 0) ) {
                        
                        throw new Error(response['0'].rmessage)
                    }     
              else{
                message=response['0'].rmessage;
             //   items = Object.values(res['1']).map(el => el);                
               
                
                const unresolved = Object.values(res['1']).map((el) => el);
                const resolved = Object.values(res['2']).map((el) => el);
                

                items = {unresolved:unresolved,resolved:resolved}
              
              }
            
        }).catch((err) => {
            console.log(err);
            throw new Error(err)
        })
        return {data: items, message};
    }
async cscInboundVoiceApi(body) {
    console.log('..body',body);
            let items = {};
            let message = '';
            let referenceID = 0;
            for (let key in body.voxbotCallDetails) 
                {
            await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_CSC_INBOUND_VOICE_BOT_HISTORY_INSERT}(
	        :SPUniqueId,
                :SPBatchID, 
                :SPID,
	    	    :SPCustomerNumber, 
                :SPState,
                :SPDistrict,
				:SPCallDateTime, 
				:SPCallStatus, 
				:SPDurations, 
				:SPLanguages, 
                :SPLangRes,
				:SPUserName, 
                :SPPathTaken,
				:SPReason, 
				:SPCallSummary, 
				:SPAudioFile
                 )`, {
                replacements: {   
                    SPUniqueId: body.voxbotCallDetails[key].UniqueId,
                    SPBatchID: body.voxbotCallDetails[key].BatchId,
                    SPID:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].Id) ? body.voxbotCallDetails[key].Id : 0, 
                    SPCustomerNumber:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].CustomerNumber) ? body.voxbotCallDetails[key].CustomerNumber : "",
                    SPState:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].State )? body.voxbotCallDetails[key].State: "",
                    SPDistrict:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].District) ? body.voxbotCallDetails[key].District : "",
                    SPCallDateTime: (body.voxbotCallDetails[key] && body.voxbotCallDetails[key].CallDateTime) ? body.voxbotCallDetails[key].CallDateTime : "",
                    SPCallStatus:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].CallStatus) ? body.voxbotCallDetails[key].CallStatus : "",  
                    SPDurations:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].Durations) ? body.voxbotCallDetails[key].Durations : 0, 
                    SPLanguages:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].Language) ? body.voxbotCallDetails[key].Language : "", 
                    SPLangRes:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].LangRes) ? body.voxbotCallDetails[key].LangRes : "", 
                    SPUserName:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].UserName) ? body.voxbotCallDetails[key].UserName : "",
                    SPPathTaken:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].PathTaken) ? body.voxbotCallDetails[key].PathTaken : "",
                    SPReason:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].Reason) ? body.voxbotCallDetails[key].Reason : "",
                    SPCallSummary:(body.voxbotCallDetails[key] && body.voxbotCallDetails[key].CallSummary) ? body.voxbotCallDetails[key].CallSummary : "", 
                    SPAudioFile: (body.voxbotCallDetails[key] && body.voxbotCallDetails[key].AudioFile) ? body.voxbotCallDetails[key].AudioFile : "", 
                    },
                type: sequelize.QueryTypes.INSERT,
            }).then(async res => {
                console.log('response', res[0]);
               
                if (res[0].rcode === '0') {
                  throw new Error(res[0].rmessage);
                } else {
                  message = res[0].rmessage;
                  referenceID= res[0].CSCRefernceID;
                }
                
            })
        }
            return {message,referenceID};
        }
    
    async diffUsersLogin(bodyjson) {
       
        let data = [];
        let data1 = [];
        let message = '';
        let payload = {};
        let request = {};
        let result = {};
        let body = {};        
        let user = {};
        let tokenPayload = {};
        let token = {};        
        const url = `${constant.PM_API_HTTPS}user/user/login`;
        const hashPasswordd = await AuthHelpers.decryptData(bodyjson.appAccessPWD);
        console.log('hashPasswordd',hashPasswordd);
        const decryptyPassword = await AuthHelpers.createCryptoHashPassword(hashPasswordd);
        console.log('decryptyPassword',decryptyPassword);
        let requestData = {
                    "deviceType": "android",
                    "otp": 123456,
                //    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                "password": decryptyPassword,
                "mobile": bodyjson.mobilenumber
               };
       await  axios.post(url,requestData,  {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            }).then(async (res) => {
console.log('resress',res.data);
            if (res.data.status) {
          
                 result = res.data;
                payload= {data: payload, message};
               // console.log('resresresresres',result.error);
                console.log('token',result.data.roles[0]);
                if(result.data.roles[0].roleName==='STATE_GOVT_ADMIN'||result.data.roles[0].roleName==='STATE_GOVT_USER')
                {
                    body={
                    "otherAccessID":result.data.userData.userID,
                    "stateID":result.data.roles[0].data[0].stateID,
                    "userDisplayName":result.data.userData.name,
                    "appAccessUserName": result.data.userData.mobile,
                    "appAccessPWD": result.data.userData.mobile,
                    "appAccessTypeID": 503,
                    "emailAddress": result.data.userData.email,
                    "userMobileNumber": result.data.userData.mobile,
                    "bRHeadTypeID": 124005,
                    "userRelation": result.data.roles[0].roleName,
                    "locationTypeID": 1 ,
                    "branchAlphaCode":"",
                    "bankAlphaCode":"",
                    "branchCode":"",
                   "branchName":"", 
                   "bankName":"",
                   "iFSCCode":"",
                   "bankType":"",
                   "districtAlphaCode":"",
                }
                console.log('bodyyyy',body);
                 }
                else
                {
                    body={
                        "otherAccessID":result.data.userData.userID,
                        "stateID":result.data.roles[0].data[0].stateID,
                        "userDisplayName":result.data.userData.name,
                        "appAccessUserName": result.data.userData.mobile,
                        "appAccessPWD": result.data.userData.mobile,
                        "appAccessTypeID": 503,
                        "emailAddress": result.data.userData.email,
                        "userMobileNumber":result.data.userData.mobile,
                        "bRHeadTypeID": 124004,
                        "userRelation": result.data.roles[0].roleName,
                        "locationTypeID": 1,
                        "branchAlphaCode":result.data.roles[0].data[0].branchID,
                    "bankAlphaCode":result.data.roles[0].data[0].bankID,
                    "branchCode":result.data.roles[0].data[0].branchCode,
                   "branchName":result.data.roles[0].data[0].branchName, 
                   "bankName":result.data.roles[0].data[0].bankName,
                   "iFSCCode":result.data.roles[0].data[0].ifscCode,
                   "bankType":result.data.roles[0].data[0].bankType,
                   "districtAlphaCode":result.data.roles[0].data[0].districtID,         
                    }
                    console.log('bodyyyy',body);
                }
            await sequelize.query(`CALL ${STORE_PROCEDURE.BM_DIFF_USER_LOGIN}(
                @SPAppAccessID,
                :SPOtherAccessID,
                :SPStateID,
                :SPUserDisplayName,
                :SPAppAccessUserName,
                :SPAppAccessPWD,
                :SPAppAccessTypeID,
                :SPEmailAddress,
                :SPUserMobileNumber,
                :SPBRHeadTypeID,
                :SPUserRelation,
                :SPLocationTypeID,
                :SPBranchAlphaCode,
                :SPBankAlphaCode,
                :SPBranchCode,
                :SPBranchName,
                :SPBankName,
                :SPIFSCCode,
                :SPBankType,
                :SPDistrictCodeAlpha,	
                        @rcode, @rmessage)`, {
                    replacements: {
                        SPOtherAccessID: body.otherAccessID,
                        SPStateID: body.stateID,
                        SPUserDisplayName: body.userDisplayName,
                        SPAppAccessUserName: body.appAccessUserName,
                        SPAppAccessPWD: body.appAccessPWD,
                        SPAppAccessTypeID: body.appAccessTypeID,
                        SPEmailAddress: body.emailAddress,
                        SPUserMobileNumber: body.userMobileNumber,
                        SPBRHeadTypeID: body.bRHeadTypeID,
                        SPUserRelation: body.userRelation,
                        SPLocationTypeID: body.locationTypeID,
                        SPBranchAlphaCode: body.branchAlphaCode,
                SPBankAlphaCode: body.bankAlphaCode,
                SPBranchCode: body.branchCode,
                SPBranchName: body.branchName,
                SPBankName: body.bankName,
                SPIFSCCode: body.iFSCCode,
                SPBankType: body.bankType,
                SPDistrictCodeAlpha: body.districtAlphaCode,
                                            },
                                            type: sequelize.QueryTypes.SELECT,
                }).then(async (res) => {
                    await sequelize.query('select @SPAppAccessID AS id, @rcode AS code, @rmessage AS message').then((results) => {
                    /*    const data = flatMap(result);
                        console.log('resresres',res);
                        if (+data[0].code === 0) {
                            throw new Error(data[0].message)
                        }
                        message = data[0].message;
                        payload =  data[0].id;*/
                        const data = flatMap(results);
                console.log(data,'data');
                console.log(res,'res');
                if (data && data[0].code === 0) {
                    console.log(data,'data');
                    throw new Error(data[0].message)
                  
                }
                message=data[0].message;
                const id = res[0]['0'].LoginID;
                const menuList = Object.values(res[1]).map((el) => el);
                const userResponse = Object.values(res[0]).map((el) => el);
                const appAccessUserName=  res[0]['0'].AppAccessUserName;
            
                user = {
                    LoginID: userResponse[0].LoginID,
                    AppAccessUID: userResponse[0].AppAccessUserName,
                    AppAccessTypeID: userResponse[0].AppAccessTypeID,
                    AccessProfileID: userResponse[0].AccessProfileID,
                    AccessProfileType: userResponse[0].AccessProfileType,
                    UserDisplayName: userResponse[0].UserDisplayName,
                    UserRelationID: userResponse[0].UserRelationID,
                    UserRelationType: userResponse[0].UserRelationType,
                    UserMobileNumber: userResponse[0].UserMobileNumber,
                    UserCompanyType: userResponse[0].UserCompanyType,
                    CompanyName: userResponse[0].CompanyName,
                    BRHeadTypeID: userResponse[0].BRHeadTypeID,
                    LocationTypeID: userResponse[0].LocationTypeID,
                    ActivationDays: userResponse[0].ActivationDays,
                    FirstTimeLogin: userResponse[0].FirstTimeLogin,
                    LocationMasterName: userResponse[0].LocationMasterName,
                    rcode: data[0].code,
                    rmessage: data[0].message,
                    
                }
                const timestamp = Date.now() / 1000
                //  const expiresIn = moment().add(1, 'M').utc();
                const expiresIn = moment().add(10, 'hours').utc();
                  const token1 = jwt.sign(
                      {
                          expiresIn,
                          iat: timestamp,
                          id,
                          appAccessUserName
                      },
                      process.env.JWT_SECRET
                  )
              token={ Token:token1, expirationTime:timestamp,  validFrom: moment().utc(),validTo: expiresIn};
           
                user = {...user,token, userMenuMaster: menuList}
                
                
                        
                    })
                })
            }
            else
            {
                console.log('errrrroorr',res.data);
                throw new Error(res.data.error)
            }
        
            }).catch((error) => {
                console.log('errrrroorr',error);
                throw new Error(error)
            })
            return user;
        //return {AppAccessID:payload, message};
        
    
    }
    async diffAddUser(body) {
        let data = [];
        let data1 = [];
        let message = '';
        let payload = {};
        
        const hashPassword = await AuthHelpers.decryptData(body.appAccessUserName);
        const hashPasswordd = await AuthHelpers.decryptData(body.appAccessUserName);
        const decryptyPassword = await AuthHelpers.createCryptoHashPassword(body.appAccessUserName);
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_CREATE_NODE}(
        @SPAppAccessID,
        :SPOtherAccessID,
        :SPStateID
        :SPUserDisplayName
        :SPAppAccessUserName,
        :SPAppAccessPWD,
        :SPAppAccessTypeID,
        :SPEmailAddress,
        :SPUserMobileNumber,
        :SPBRHeadTypeID,
        :SPUserRelationID,
        :SPLocationTypeID,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPOtherAccessID: body.otherAccessID,
                SPStateID: body.stateID,
                SPUserDisplayName: body.userDisplayName,
                SPAppAccessUserName: body.appAccessUserName,
                SPAppAccessPWD: body.appAccessPWD,
                SPAppAccessTypeID: body.appAccessTypeID,
                SPEmailAddress: body.emailAddress,
                SPUserMobileNumber: body.userMobileNumber,
                SPBRHeadTypeID: body.bRHeadTypeID,
                SPUserRelationID: body.userRelationID,
                SPLocationTypeID: body.locationTypeID,
                SPInsertUserID: +body.objCommon?.insertedUserID,
                SPInsertIPAddress: body.objCommon?.insertedIPAddress,
            },
            type: sequelize.QueryTypes.UPSERT,
        }).then(async () => {
            await sequelize.query('select @SPAppAccessID AS id, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                payload = {AppAccessID: data[0].id};
                message = data[0].message;
            })
        })
        return {data: payload, message};
        
    }
    async login(username, password,insertedIPAddress) {
        const hashPassword = await AuthHelpers.decryptData(username);
         console.log(hashPassword);
         let message1=''
         let fetchpassword ;
         const hashPassword1 = await AuthHelpers.encryptData(username);
     //    console.log(hashPassword1);
                   
// check password

         let message = '';
        let user = {};
        let tokenPayload = {};
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_LOGIN_NODE}(
        :SPAppAccessUID,
        :SPAppAccessPWD,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessUID: hashPassword,
                SPAppAccessPWD: password,
                SPInsertIPAddress: insertedIPAddress
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
           // console.log(res,'res');
                 await sequelize.query('select @rcode AS code, @rmessage AS message').then(async (result) => {
                   
                const data = flatMap(result);
                console.log(data,'data');
         //       console.log(res,'res');
                if ((data && data[0].code === 0)||(data && data[0].code === 2) ) {
                   // console.log(data,'data');
                    throw new Error(data[0].message)
                  
                }
                message=data[0].message;
                const id = res[0]['0'].LoginID;
                const menuList = Object.values(res[1]).map((el) => el);
                const userResponse = Object.values(res[0]).map((el) => el);
                tokenPayload = await this.generateJwtToken(id, hashPassword);
                user = {
                    LoginID: userResponse[0].LoginID,
                    AppAccessUID: hashPassword,
                    AppAccessTypeID: userResponse[0].AppAccessTypeID,
                    AccessProfileID: userResponse[0].AccessProfileID,
                    AccessProfileType: userResponse[0].AccessProfileType,
                    UserDisplayName: userResponse[0].UserDisplayName,
                    UserRelationID: userResponse[0].UserRelationID,
                    UserRelationType: userResponse[0].UserRelationType,
                    UserMobileNumber: userResponse[0].UserMobileNumber,
                    UserCompanyType: userResponse[0].UserCompanyType,
                    CompanyName: userResponse[0].CompanyName,
                    BRHeadTypeID: userResponse[0].BRHeadTypeID,
                    LocationTypeID: userResponse[0].LocationTypeID,
                    ActivationDays: userResponse[0].ActivationDays,
                    FirstTimeLogin: userResponse[0].FirstTimeLogin,
                    LocationMasterName: userResponse[0].LocationMasterName,
                    SessionID:userResponse[0].sessionID,
                    rcode: data[0].code,
                    rmessage: data[0].message,

                }
                
                user = {...user, token: {
                    Token: tokenPayload.token,
                        expirationTime: tokenPayload.timestamp,
                        validFrom: moment().utc(),
                        validTo: tokenPayload.expiresIn}, userMenuMaster: menuList}
                
                
            })
            
        })
        return user;
    }
    
    async intial(body) {
        let message = '';
        let sentdata = '';
        const hashPassword = await AuthHelpers.decryptData(body.appAccessUID);
        console.log(hashPassword);
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_APP_SALT_SESSION_INSERT}(
        :SPAppAccessUID,
        :SPInsertIPAddress,
         @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessUID: hashPassword,
                SPInsertIPAddress: body.objCommon?.insertedIPAddress            
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
               
                const id = res[0]['0'].token;
                message = data[0].message;
                sentdata= {data: id, message};
                console.log(sentdata,'sentdata');
            })
        })
        return sentdata
    }
   
    async logOut(body) {
        let message = '';
        console.log('body',body);
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_APP_LOGOUT_USER}(
        :SPAppAccessID,
        :SPSessionID,
         @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessID: +body.appAccessUID,
                SPSessionID:+body.sessionID
                                    
            },
            type: sequelize.QueryTypes.UPDATE,
        }).then(async () => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                message = data[0].message;
            })
        })
        return {data: null, message};
    }
  
    async resetForgetPassword(body) {
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_PASSWORD_FORGETRESET}(
        :SPAppAccessID,
        :SPNewPassword,
       @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessID: +body.appAccessID,
                SPNewPassword: body.newPassword
            },
            type: sequelize.QueryTypes.UPDATE,
        }).then(async () => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                message = data[0].message;
            })
        })
        return {data: null, message};
    }
    async forget(username) {
        // check password
        let message = '';
                    let user = {};
                    const hashPassword = await AuthHelpers.decryptData(username);
                    console.log('hashPassword',hashPassword);
                let templateIDD = '';
                let customTemplate = '';
                let items = {};
                await sequelize.query(`CALL ${STORE_PROCEDURE.BM_APACCESS_FORGOT_PASSWORD}(
                :SPAppAccessUserName,
                @SPOTP,
                @SPUserMobileNumber,
                @rcode, @rmessage)`, {
                    replacements: {
                        SPAppAccessUserName: hashPassword
                    },
                    type: sequelize.QueryTypes.RAW,
                }).then(async (res) => {
                 

               await sequelize.query('select @SPOTP as OTP,@SPUserMobileNumber AS UserMobileNumber, @rcode AS code, @rmessage AS message').then(async (result) => {
                       
                        const data = flatMap(result);
                        console.log('body',data[0]);
                        if (data && data[0].code === 0) {
                            throw new Error(data[0].message)
                        }
                        if (data && data[0].code === 2) {
                            message = 'OTP send to the Registered Mobile Number !';
                          //  return {data:items,message};
                        }
                        else{
                                        templateIDD = "1707170748006783465";
                                        customTemplate=`${data[0].OTP} is your OTP for reset the password of KRPH portal. Please keep it safe for next 10 minutes. Team-CSCSPV`;
                                        const customTemplateEncode = this.utilService.GetSingleUnicodeHex(customTemplate);
                                       const response = await axios.post(`https://bulksmsapi.vispl.in/?username=cscetrnapi3&password=csce_123&messageType=unicode&mobile=${data[0].UserMobileNumber}&senderId=CSCSPV&ContentID=${templateIDD}&EntityID=1301157363501533886&message=${customTemplateEncode}`);
                                       
                                      console.log('URL',`https://bulksmsapi.vispl.in/?username=cscetrnapi3&password=csce_123&messageType=unicode&mobile=9215368699&senderId=CSCSPV&ContentID=${templateIDD}&EntityID=1301157363501533886&message=${customTemplateEncode}`);
                                      console.log('URL',`https://bulksmsapi.vispl.in/?username=cscetrnapi3&password=csce_123&messageType=text&mobile=9215368699&senderId=CSCSPV&ContentID=${templateIDD}&EntityID=1301157363501533886&message=${customTemplate}`);
                                     
                                        if (response.status === 200) {
                                            const val = response.data.split('#');
                                            if (val.length < 0) {
                                                throw new Error('Could not send Message');
                                            }
                                            await sequelize.query(`CALL ${STORE_PROCEDURE.PASSWORD_OTP_SMS_HISTORY_INSERT}(
                                                @SPOTPSMSHistoryID,
                                                :SPAppAccessUserName,
                                                :SPSMSReferenceNo,
                                                :SPTemplateID,
                                                :SPOTP,
                                                :SPMobileNo,
                                                :SPInsertUserID,
                                                :SPInsertIPAddress,
                                                 @rcode, @rmessage)`, {
                                                        replacements: {
                                                            SPAppAccessUserName: hashPassword,
                                                            SPSMSReferenceNo: val[2],
                                                            SPTemplateID: templateIDD,
                                                            SPOTP:data[0].OTP,
                                                            SPMobileNo: data[0].UserMobileNumber,
                                                            SPInsertUserID: 1,
                                                            SPInsertIPAddress:'125.0.0.1',
                                                        },
                                                        type: sequelize.QueryTypes.INSERT,
                                                    }).then(async () => {
                                                        await sequelize.query(`select @SPOTPSMSHistoryID AS historyID, @rcode AS code, @rmessage AS message`).then((result) => {
                                                            const data = flatMap(result);
                                                            console.log('data',data);
                                                            if (data[0].code === '0') {
                                                                throw new Error(data[0].message)
                                                            }
                                                            items= {SMSHistoryID: data[0].historyID}
                                                            message = val[1].toString();
                                                        })
                                                    })
                                                }
                                            
                                    
                                    
                                            }
                        
                       // send OTP To message.............
                       
                    })
                }).catch((error) => {
                    console.log('error',error);
                    throw new Error(error)
                })
                return {data: items, message};
            
}
            async otpValidate(username,otp) {
                // check password
                let message = '';
                        let user = {};
                        const hashPassword = await AuthHelpers.decryptData(username);
                        let tokenPayload = {};
                        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_APACCESS_VALIDATE_OTP}(
                        :SPAppAccessUserName,
                        :SPOTP,
                        @SPAppAccessID,
                        @rcode, @rmessage)`, {
                            replacements: {
                                SPAppAccessUserName: hashPassword,
                                SPOTP:otp                               
                            },
                            type: sequelize.QueryTypes.RAW,
                        }).then(async (res) => {

                            await sequelize.query('select @SPAppAccessID as appAccessID, @rcode AS code, @rmessage AS message').then(async (result) => {
                              
                                const data = flatMap(result);
                           
                                if (data[0].code === 0) {
                                    throw new Error(data[0].message)
                                }
                                else{
                                console.log('message',data[0].message);
                                message = data[0].message;
                               console.log('data[0].appAccessID',data[0].appAccessID);
                                user = {appAccessID: data[0].appAccessID};
                                }
                            })
                        }).catch((error) => {
                            
                            throw new Error(error)
                        })
                    return user;
                
                    }       

    async generateJwtToken(id, username) {
        const timestamp = Date.now() / 1000
      //  const expiresIn = moment().add(1, 'M').utc();
      const expiresIn = moment().add(10, 'hours').utc();
        const token = jwt.sign(
            {
                expiresIn,
                iat: timestamp,
                id,
                username
            },
            process.env.JWT_SECRET
        )
        return {token, timestamp, expiresIn}
    }
   async  generatedoublehash(fetchpassword, salt1) {
    console.log(fetchpassword,'fetchpassword');
    console.log(salt1,'salt1');
        bcrypt.hash(fetchpassword, salt1, (err, hash) =>{
            console.log(err,'errrrrrr');
            console.log(hash,'hash');
        return hash;
    })
}
async Compare(fetchpassword, hash) {
        bcrypt.compare(fetchpassword, hash, (err, isMatch) => { 
            if( err ) { 
                return err; 
            } 
              
            // If password matches then display true 
            return isMatch; 
        });
    
    }


  
       ///////////////////////////////////////////////////////////////////////////////////////////
/*async prepareDBByMobileNumber(body) {
    let message1 = '';
    let farmermobilenumber ='';
    await sequelize.query(`CALL mobilenumber_select(
       
         @rcode, @rmessage)`, {
            replacements: {
                          
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
               // console.log(res,'res[0]');
                const count = res.count;
                message1 = data[0].message;
               
             //   console.log(res.length,'sentdata');
                if(res.length>0)
                {
                 //   for (let mobile of res) {
                    for (let i = 0; i < res.length; i++) {
 farmermobilenumber = res[i].Farmer_Number;
  this.callfetchfarmer (farmermobilenumber);
    let message = '';
  }
   
                }
            })
        })
    return { message1}
}
*/

 async prepareDBByMobileNumber(body) {
    let message1 = '';
    let farmermobilenumber ='';
    let farmerID ='';
    await sequelize.query(`CALL mobilenumber_select(
       
         @rcode, @rmessage)`, {
            replacements: {
                          
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
               // console.log(res,'res[0]');
                const count = res.count;
                message1 = data[0].message;
               
 
                if(res.length>0)
                {
 
                    for (let i = 0; i < res.length; i++) {
 
 farmermobilenumber = res[i].MobileNumber;
 farmerID= res[i].FarmerID;
 
  this.callfetchfarmerinsurance (farmermobilenumber,farmerID);
    let message = '';
  }
   
                }
            })
        })
    return { message1}
} 
async callfetchfarmer(farmermobilenumber) {
{
    let message='';
const url = `${constant.PM_API_HTTPS}services/services/farmerMobileExists`;
const config = {
    method: "GET",
    url,
    params: {
        mobile: farmermobilenumber,
        authToken: constant.PM_API_TOKEN,
    },
}
let sqlstring =''
//console.log(config);
await axios(config).then(res => {
    if (res.data && res.data.status) {
        const user = res.data.data;
       // console.log('user',user);
        if (user.output === 0) {
         //   throw new Error('No farmer found with this record')
         sqlstring =" INSERT INTO farmers_master_mobile_number1(MobileNumber,Description) VALUES"
         sqlstring +="('"  + farmermobilenumber + "','No farmer found with this record');";
        } else if (user.output === 2) {
           // message = {msg: 'Farmer Registered with Duplicate Mobile Number', code: user.output}
           sqlstring =" INSERT INTO farmers_master_mobile_number1(MobileNumber,Description) VALUES"
           sqlstring +="('"  + farmermobilenumber + "','Farmer Registered with Duplicate Mobile Number')";
        } else {
            
            sqlstring =" INSERT INTO farmers_master_mobile_number1(FarmerFullName,FarmerID,MobileNumber,DistrictID,StateMasterID,Age,Gender,District,State,Village,VillageID,SubDistrict,SubDistrictID,PinCode) VALUES"
            sqlstring +="('" +  user.result.farmerName  + "','" +  user.result.farmerID +  "','"  + user.result.mobile + "','" + user.result.districtID + "' , '" + user.result.stateID + "',"  + user.result.age  + ",'"  + user.result.gender + "','"  + user.result.district + "','"  + user.result.state + "','"  + user.result.village + "','"  + user.result.villageID + "','"  + user.result.subDistrict + "','"  + user.result.subDistrictID + "','"  + user.result.resPincode + "');";
        }
        //    data = res.data;
            message = 'SUCCESS'
            ////////////

             sequelize.query(sqlstring, {
                replacements: {
                      
                },
                   type: sequelize.QueryTypes.INSERT,
               }).then(async (res) => {

               })

            //////////////
        
    } else {
        //throw new Error(res.data.error);
    }
}).catch((err) => {
    console.log(err);
    throw new Error(err);
})
}


 

}

 async callfetchfarmerinsurance(farmermobilenumber,farmerid) {
    {
        let message='';
       let InsuranceName='';

    const url = `${constant.PM_API_HTTPS}policy/policy/policyListOfaVillageOrAFarmer`;
    const config = {
        method: "GET",
        url,
        params: {
           
            farmerID: farmerid,
            seasonCode: "1",
            year: "2020",
            listType: 'FARMER_POLICY',
        },
    }
    let sqlstring =''

    await axios(config).then(res => {
       console.log('resresres',res.data);
        if (res.data && res.data.status && !isEmpty(res.data.data)) {
            const user = res.data.data;
            console.log('user',user);
            if (Object.keys(user).length > 0) {
                const farmersData = Object.values(user);
                if (farmersData && farmersData.length > 0) {
                  const farmerAndApplicationData = [];
            
                    
                      InsuranceName=farmersData[0].insuranceCompanyName;
                      sqlstring =" UPDATE farmers_master_mobile_number1 SET InsuranceCompanyName = '" + InsuranceName + "', Description ='Data Found with 2020 with season code  1' Where farmerID='" + farmerid + "';";
           
            }
            else{
                sqlstring =" UPDATE farmers_master_mobile_number1 SET InsuranceCompanyName = '" + InsuranceName + "', Description ='Data Not Found' Where farmerID='" + farmerid + "';";
            }
                  };
               
            
        } else {
            sqlstring =" UPDATE farmers_master_mobile_number1 SET InsuranceCompanyName = '" + InsuranceName + "', Description ='Data Not Found' Where farmerID='" + farmerid + "';";
        }
              
            
            message = 'SUCCESS'
                      sequelize.query(sqlstring, {
                replacements: {
                      
                },
                   type: sequelize.QueryTypes.UPDATE,
               }).then(async (res) => {

               })
               InsuranceName='';
           
 
    }).catch((err) => {
        console.log(err);
        throw new Error(err);
    })
    }    
    }
async scheduler()
{
    let message1 = '';   
    

  cron.schedule('00 30 07 * * *', async function () {
    
        let message = '';
        
        let sentdata = '';
        let mailOptions='';
        let transporter='';
        let farmermobilenumber='';
        let seprate=[];
        let details =[];
        let sqlstring='';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_SEND_ESCALATION_MAIL}(
                 @rcode, @rmessage)`, {
            replacements: {
                          
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then( async(result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                else
                {
                if(res.length>0)      {
                 
                const mailuser = res;
                message = data[0].message;
                sentdata= {data: mailuser, message};
               
                for (let i = 0; i < res.length; i++) {
                 
                    details = res[i].TicketNo.split(',');
                //    farmermobilenumber = res[i].Farmer_Number;
                    //'<b>Notification from: krphhelpline@gmail.com </b><br/>' +
                      //          '<b>Notification To: ' + res[i].EmailAddress + '</b><br/><br/><br/>' +
                                //'<b>Email Subject : </b> KRPH  Total  ' + (details.length + 1) + '  Tickets are waiting for resolution.<br/><br/>' +
                                let header =        '<b>Dear : </b>  ' + res[i].UserDisplayName +   '<br/>' +
                                'The Open ticket/s has been pending for resolution in your bucket. <br/ >' +
                                'Kindly review the ticket/s and initiate action as required from your Insurance Company on priority on or before  ' +  moment().add(2, 'days').format("DD-MM-YYYY") +  ' <br/> Ticket Details are as follow :- ' ;



                    let message = header + '<br/><br/>' +
                    '<table style="border: 1px solid #333;">' +
                        '<thead style="border: 1px solid #333;">' +
                        '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; Sr No. &nbsp;&nbsp;</th>' +
                        '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; Ticket Number &nbsp;&nbsp;</th>' +
                        '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; Creation Date &nbsp;&nbsp;&nbsp;</th>'  +                    
                        '</thead>';                       
                    
                      for (let j = 0; j < details.length; j++) {
                         seprate = details[j].split('|');
                
                         message += (
                           '<tr style="border: 1px solid black;">' +
                           '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     + (j+1) +     '&nbsp;&nbsp;&nbsp;</td>' +
                            '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     + seprate[0] +     '&nbsp;&nbsp;&nbsp;</td>' +
                            '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     + seprate[1] +     '&nbsp;&nbsp;&nbsp;</td>' +
                            '</tr>'
                         );
                 
                         }
                      message +=  '</table><br/><br/><br/>Thanks <br/>KRPH.<br/><br/>' +
                      'Kindly note: Do not reply to this email as this is an autogenerated email.';
                     mailOptions = {
                        from: ' krphhelpline@gmail.com',
                        to: res[i].EmailAddress,
                        subject: 'KRPH  Total  ' + ( details.length ) + '  Tickets are waiting for resolution.',
                        text: 'Some content to send',
                        html: message
                      //  html: '<b>Dear ' + res[i].UserDisplayName + '<br />Email from KRPH Potal, For reminding about tickets which will be escalated from tomorrow. Details Of Ticket: -  '  + res[i].TicketNo + '</b>'
                      };
                      
                      // Mail transport configuration
                       transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'krphhelpline@gmail.com',
                          pass: 'yems qima behw hwvj',
                        },
                        tls: {
                          rejectUnauthorized: false,
                        },
                      });
                      
                      // Delivering mail with sendMail method
                 await  transporter.sendMail(mailOptions, async (error, info) => {
                        sqlstring='';
                       
                        if (error) {console.log(error);}
                        else {
                            await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_ESCALATION_TICKET_DETAIL_INSERT}(
                                :SPUserID,
                                :SPViewMode,
                                :SPGmailStatus,
                                :SPInsuranceMasterID,
                                 @rcode, @rmessage)`, {
                                     replacements: {
                                        SPUserID:res[i].AccessID,
                                        SPViewMode:"MAIL",
                                        SPGmailStatus:info.response,
                                        SPInsuranceMasterID:0,
                                     },
                                     type: sequelize.QueryTypes.INSERT,
                                 }).then(async () => {
                                     await sequelize.query(`select  @rcode AS code, @rmessage AS message`).then((result) => {
                                         const data = flatMap(result);
                                         if (+data[0].code === 0) {
                                             throw new Error(data[0].message)
                                         }
                                     
                                     })
                                 })
                            
                        
                               //  sqlstring =" INSERT INTO  fgms_escalation_mail_history_master(TicketDetails,AccessID,UserProfileID,IsDeleteFlag,FromDuration,ToDuration,EmailAddress,UserDisplayName,GmailInfoResponse) VALUES";
                                 //sqlstring +="('"  + res[i].TicketNo + "',"  + res[i].AccessID + ","  + res[i].UserProfileID + ",'"  + res[i].IsDeleteFlag + "','"  + res[i].FromDuration + "','"  + res[i].ToDuration + "','"  + res[i].EmailAddress + "','"  + res[i].UserDisplayName + "', '"  + info.response + "');";

                               
                                   // message = 'SUCCESS'
                                  
                                    //console.log('sqlstring',sqlstring);
                             /*       await sequelize.query(sqlstring, {
                                        replacements: {
                                              
                                        },
                                           type: sequelize.QueryTypes.INSERT,
                                       }).then(async (res) => {
                            
                                       }).catch((err) => {
                                    console.log(err);
                                    throw new Error(err);
                                })*/
                            
                                    console.log('Email sent: ' + info.response);
                                    }
                           
                      
                      });
                    
                }
                }
            }
        })
        console.log('---------------------');
        console.log('Running Cron Process');
        
      });
      
})
/*cron.schedule('00 00 06 * * *', async function () {

    let message = '';    
    let sentdata = '';
    let mailOptions='';
    let transporter='';
    let farmermobilenumber='';
    let seprate=[];
    let details =[];
    let sqlstring='';
    let AllTicket='';
    let companycount=0;
    let message1='';
    let message2='';
    let message3='';
    await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_SEND_ESCALATION_MAIL_COMPLAINT}(
             @rcode, @rmessage)`, {
        replacements: {
                      
        },
        type: sequelize.QueryTypes.SELECT,
    }).then(async (res) => {
        await sequelize.query('select @rcode AS code, @rmessage AS message').then( async(result) => {
            const data = flatMap(result);
          
          const data1= Object.values(res[0]).map((el) => el);
          const data2= Object.values(res[1]).map((el) => el);
          let companydata ;
       
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            else
            {
            if(res.length>0)      {
           //  console.log('1119',res[0]);
            const mailuser = res;
            message = data[0].message;
            sentdata= {data: mailuser, message};
          
            for (let n= 0; n <  data1.length; n++) 
                {
                    message1='';
                    message2='';
                    message3='';
              
                let comp = data1[n].InsuranceMasterID;
                
                companycount=0;
                 companydata = data2.filter((x) => {
                    return x.InsuranceCompanyID === comp;
                   });
                
           if(companydata.length>0)
                {
             
                    message2='';
                    AllTicket='';
                 for (let t= 0; t < companydata.length; t++) 
                    {
           console.log('11143',companydata[t]);
            
     AllTicket=AllTicket +companydata[t].TicketDetails;

                details = companydata[t].TicketNo.split(',');
           
                  for (let j = 0; j < details.length; j++) {
                     seprate = details[j].split('|');
                     companycount=companycount+1;
                     
                     message2 +='<tr style="border: 1px solid black;">' +
                       '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     + (companycount) +     '&nbsp;&nbsp;&nbsp;</td>' +
                        '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     + seprate[0] +     '&nbsp;&nbsp;&nbsp;</td>' +
                        '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     + seprate[1] +     '&nbsp;&nbsp;&nbsp;</td>' +
                        '<td style="border: 1px solid black;">&nbsp;&nbsp;&nbsp;'     +  companydata[t].StateMasterName +     '&nbsp;&nbsp;&nbsp;</td>' +
                        '</tr>'
                     ;
      
                     }
                    }    
                       
                   let header =        '<b>Dear : Sir / Madam </b><br/>' +
                   'This email is to inform you that <count of tickets> no. of Grievances of farmers are pending at CGRO level for resolution pertaining to  Insurance Company (' + data1[n].InsuranceMasterName + ') under Pradhan Mantri Fasal Bima Yojana. <br/ > <br/ >' +
                   'You are requested to take up with the concerned Insurance Company at appropriate level to resolve the pending grievances' +  moment().add(2, 'days').format("DD-MM-YYYY") +  ' <br/> Ticket Details are as follow :- ' ;
        message1 = header + '<br/><br/>' +
       '<table style="border: 1px solid #333;">' +
           '<thead style="border: 1px solid #333;">' +
           '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; Sr No. &nbsp;&nbsp;</th>' +
           '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; Ticket Number &nbsp;&nbsp;</th>' +
           '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; Creation Date &nbsp;&nbsp;&nbsp;</th>'  +     
           '<th style="border: 1px solid #333;">&nbsp;&nbsp;&nbsp; State &nbsp;&nbsp;&nbsp;</th>'  +                    
           '</thead>';   
                  
                  message3 +=  '</table><br/><br/><br/>Thanks <br/>Krishi Rakshak Portal & Helpline<br/><br/>PMFBY, DA&FW, GoI.<br/><br/>' +
                  'Kindly note: Do not reply to this email as this is an autogenerated email.';
                   let mess4= message1 + message2 + message3;
               
                 mailOptions = {
                    from: 'krphhelpline@gmail.com',
                
                to: 'complaints@irdai.gov.in',
              
                    subject: 'Krishi Rakshak Portal & Helpline - ' + companycount + ' Tickets are unresolved by Insurance Company (' + data1[n].InsuranceMasterName + ')',
                    text: 'Some content to send',
                    html: mess4
                  //  html: '<b>Dear ' + res[i].UserDisplayName + '<br />Email from KRPH Potal, For reminding about tickets which will be escalated from tomorrow. Details Of Ticket: -  '  + res[i].TicketNo + '</b>'
                  };
                  
                  // Mail transport configuration
                   transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'krphhelpline@gmail.com',
                      pass: 'yems qima behw hwvj',
                    },
                    tls: {
                      rejectUnauthorized: false,
                    },
                  });
                  
                  // Delivering mail with sendMail method
             await  transporter.sendMail(mailOptions, async (error, info) => {
                    sqlstring='';
                   
                    if (error) {console.log(error);}
                    else {
                

                        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_ESCALATION_TICKET_DETAIL_INSERT}(
                            :SPUserID,
                            :SPViewMode,
                            :SPGmailStatus,
                            :SPInsuranceMasterID,
                             @rcode, @rmessage)`, {
                                 replacements: {
                                    SPUserID: 0,
                                    SPViewMode: "CMPLNT",
                                    SPGmailStatus: info.response,
                                    SPInsuranceMasterID:comp,
                                 },
                                 type: sequelize.QueryTypes.INSERT,
                             }).then(async () => {
                                 await sequelize.query(`select  @rcode AS code, @rmessage AS message`).then((result) => {
                                     const data = flatMap(result);
                                  console.log('daattt',data);
                                     if (+data[0].code === 0) {
                                         throw new Error(data[0].message)
                                     }
                                 
                                 })
                             })
                        
                                  console.log('Email sent: ' + info.response);
                                
                                }
             
                  
                  
    });
                
    }

            }
        }
      }
    }
    )
    console.log('---------------------');
    console.log('Running Cron Process');
    
  });
  
})*/
   return { message1}
}
pushVoiceAPIResponse= async (req, res) => {
    console.log('reqreq',req);
    try { 	
console.log('reqreq',req);
        let {data, message} = await this.authService.pushVoiceAPIResponse(req.body)

        // compress
        if(data) data = await this.utilService.GZip(data);

        // return response
        return jsonResponseHandler(data, message, req, res, () => {})
    } catch (err) {
        return jsonErrorHandler(err, req, res, () => {
        })
    }
}
}
