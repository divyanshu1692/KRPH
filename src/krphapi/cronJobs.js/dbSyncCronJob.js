import axios from 'axios'
import {UtilService} from "../../helper/utilService";
import {MongoClient} from 'mongodb'
const uri = process.env.MONGODB;
const client = new MongoClient(uri);
const db = client.db('krph_db');
client.connect().then((res)=>{
    console.log("connectedMongo")
}).catch((err)=>{
    console.log(err)
})


// export const dbSyncCron = async(req, res) =>{
//     console.log(req.headers.authorization)
//     let token = req.headers.authorization

//         let {viewMode, fromdate, toDate, pageIndex, pageSize, insertedUserID, insertedIPAddress, dateShort, dateLong} = req.body
       
//          const currentDate = new Date();
//           toDate = currentDate.toISOString().split('T')[0]; 
     

  

//     sendSupportTicketRequest(viewMode, fromdate, toDate, pageIndex, pageSize, insertedUserID, insertedIPAddress, dateShort, dateLong,token).then(async(response)=>{
//         let responseInfo = await new UtilService().unGZip(response.responseDynamic);

//         await db.collection('ticketRecords').insertMany(responseInfo.supportTicket)
//         res.send("Added")

//     }).catch((err)=>{
//         console.log(err)
//     })
// }

export const dbSyncCron = async (req, res) => {

    console.log(req.body)
    
    console.log(req.headers.authorization);
    let token = req.headers.authorization;

    const { viewMode, pageIndex, pageSize, insertedUserID, insertedIPAddress, dateShort, dateLong } = req.body;

    const currentDate = new Date();
    const startYear = 2023; 
    const endYear = currentDate.getFullYear();
    const startMonth = 0;
    const endMonth = currentDate.getMonth(); 

    console.log(endYear, startYear)

    const processMonth = async (year, month) => {
        if (year > endYear || (year === endYear && month > endMonth)) {
            return; 
        }
    
        const fromDate = new Date(year, month, 1).toISOString().split('T')[0];
        const toDate = new Date(year, month + 1, 0).toISOString().split('T')[0]; 

    
        try {
            const response = await sendSupportTicketRequest(viewMode, fromDate, toDate, pageIndex, pageSize, insertedUserID, insertedIPAddress, dateShort, dateLong, token);
            const responseInfo = await new UtilService().unGZip(response.responseDynamic);
            console.log(responseInfo)
            if (responseInfo.supportTicket && responseInfo.supportTicket.length > 0) {
                await db.collection('ticketlisting2').insertMany(responseInfo.supportTicket).then((response)=>{
                    db.collection('ticketlisting2').updateMany({}, [{$set: {InsertDateTime: {$toDate: "$InsertDateTime"}}}]).then((response)=>{
                        console.log("updated")
                    })
                })
            } else {
                console.log(`No tickets found for ${fromDate} to ${toDate}`);
            }
    
            await processMonth(year, month + 1);
        } catch (err) {
            console.log(err);
        }
    };

    await processMonth(startYear, startMonth);
    res.send("Records added month-wise");
};





export const sendSupportTicketRequest = async (viewMode, fromdate, toDate, pageIndex, pageSize, insertedUserID, insertedIPAddress, dateShort, dateLong,token) => {
    const url = process.env.DB_SYNC_URL;
    const data = {
        viewMode,
        fromdate,
        toDate,
        pageIndex,
        pageSize,
        objCommon: {
            insertedUserID,
            insertedIPAddress,
            dateShort,
            dateLong
        }
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error sending request:', error);
        throw error;
    }
};


