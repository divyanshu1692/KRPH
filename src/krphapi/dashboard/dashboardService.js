import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {ResponseStatus} from "../../constants/constant.js";

export class DashboardService {

    constructor() {
        this.utilService = new UtilService();
    }

   
    async getDashBoard(body, SP) {
        let items = [];
        let items1 = [];
        let object
        let kkeyy;
        let message = '';
        await sequelize.query(`CALL ${SP}(
       :SPFilterID,
       :SPFilterID1,
       :SPFilterID2,
       :SPUserID,
       :SPMasterName,
       :SPSearchText,
       :SPSearchCriteria,
        @rcode, @rmessage)`, {
            replacements: {
                    SPFilterID: +body.filterID,
                SPFilterID1: +body.filterID1,
                SPFilterID2: body.filterID2 || '',
                SPUserID: +body.objCommon.insertedUserID,
                SPMasterName: body.masterName,
                SPSearchText: body.searchText,
                SPSearchCriteria: body.searchCriteria,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                console.log('response',res);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if(body.masterName==='BYSTM')
                {
                
                    res.forEach(object => {
                        console.log('object',object);
                          kkeyy = (object.StateMasterName);
                          items[kkeyy] = object;
                  
            
                });
             //   items=items1;
                 console.log('items1items1items1items1items1',items);
            //}
                    message = data[0].message;
                }
                else
                {
                items = res;
                message = data[0].message;
                }
            }).catch((err) => {
                console.log({err});
            })
        }).catch((err) => {
            console.log({err});
        })
        return {data: {dashboard: items}, message};
    }

    async getDashBoardBKP(body, SP) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${SP}(
       :SPFilterID,
       :SPFilterID1,
       :SPFilterID2,
       :SPUserID,
       :SPMasterName,
       :SPSearchText,
       :SPSearchCriteria,
        @rcode, @rmessage)`, {
            replacements: {
                    SPFilterID: +body.filterID,
                SPFilterID1: +body.filterID1,
                SPFilterID2: body.filterID2 || '',
                SPUserID: +body.objCommon.insertedUserID,
                SPMasterName: body.masterName,
                SPSearchText: body.searchText,
                SPSearchCriteria: body.searchCriteria,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res;
                message = data[0].message;
            }).catch((err) => {
                console.log({err});
            })
        }).catch((err) => {
            console.log({err});
        })
        return {data: {dashboard: items}, message};
    }
}
