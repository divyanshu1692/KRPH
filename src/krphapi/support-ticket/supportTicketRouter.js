import express from 'express'
import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {SupportTicketController} from './supportTicketController.js'
import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {griveninceReports} from "../reports/reportControllers.js"
import stream from 'stream';
import multer from 'multer';

import util from "util";
import fs from 'fs';
const pipeline = util.promisify(stream.pipeline)
const supportTicketController = new SupportTicketController()
export const supportTicketRouter = express.Router()
const CHUNKS_DIR = './chunk/';
let absolutePath = process.env.IMAGE_PATH
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('req/body', req.body);
   // let filePath ='./krph_documents/' + file.filename;
    //const dirpath ='./krph_documents/' ;
    let filePath =`${absolutePath}` + file.filename;
    const dirpath =`${absolutePath}` ;
    console.log('dirpath', dirpath);
    
    
     // const mediaFolder = __dirname+'/testFiles'; // Change as per your Location
   if (file) { 
  new Promise ((resolve, reject) => {
   if (!fs.existsSync(dirpath)) {
     try {
       fs.mkdirSync(dirpath,{ recursive: true });
     } catch (error) {
       reject(error.message)
     }
   }
   
  }).then((data) => {
   console.log(`Successfully Uploaded Document`);
  }).catch((error) => {
   console.log(`Error occured at time of doc upload ${error.message}`);
  })
  //cb(null, './krph_documents/');
  cb(null, `${absolutePath}`);
    }
  }, 
    filename: (req, file, cb) => { 
      const fileName = `${Date.now()}-${file.originalname}`; 
      cb(null,  file.originalname)
    }
});

const uploads = multer({ storage: storages });
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    
    console.log('reqreq', file);
  console.log('reqreq.body', req.body);
  
  //let filePath ='./krph_documents/' + file.filename;
  //const dirpath ='./krph_documents/';
  //console.log('dirpath', dirpath);
  let filePath =`${absolutePath}` + file.filename;
  const dirpath =`${absolutePath}`;
  console.log('dirpath', dirpath);
 
  
   // const mediaFolder = __dirname+'/testFiles'; // Change as per your Location
 if (file) { 
new Promise ((resolve, reject) => {
 if (!fs.existsSync(dirpath)) {
   try {
     fs.mkdirSync(dirpath,{ recursive: true });
   } catch (error) {
     reject(error.message)
   }
 }
 
}).then((data) => {
 console.log(`Successfully Uploaded Document`);
}).catch((error) => {
 console.log(`Error occured at time of doc upload ${error.message}`);
})
//cb(null, './krph_documents/');
cb(null, `${absolutePath}`);
  }
}, 
  filename: (req, file, cb) => { 
    const fileName = `${Date.now()}-${file.originalname}`; 
    const uploadedfilename= req.body.ImageName  ;
    cb(null, uploadedfilename);
  }, 
}); 
  
const upload1 = multer({ storage }); 
const storagess = multer.memoryStorage();
//var uploadss = multer({ dest: './krph_documents/'});
var uploadss = multer({ dest: `${absolutePath}`});
//const uploads = multer({ storage: storage });
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      console.log ('file.mimetype',file.mimetype);
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg ,.pdf format allowed!'));
      }
  }
});
var type = upload.single('files');
/*

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const DIR = './krph_documents/';
        const dirpath ='./krph_documents/' + req.body.ImgPath;
         
fs.access(dirpath, (error) => { 

    // To check if given directory  
    // already exists or not 
    if (error) { 
      // If current directory does not exist then create it 
      fs.mkdir(dirpath, { recursive: true }, (error) => { 
        if (error) { 
          console.log(error); 
        } else { 
          console.log("New Directory created successfully !!"); 
        } 
      }); 
    } else { 
      console.log("Given Directory already exists !!"); 
    } 
  });

  console.log('dirpath1111111', dirpath);
        cb(null, './krph_documents/' + req.body.ImgPath);
    },
    filename: (req, file, cb) => {
      setTimeout(() => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        console.log('fileName',fileName);
       // cb(null,  fileName)
       console.log()
       cb(null,  req.body.ImageName)
       
      }, 1000);
       
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log ('file.mimetype',file.mimetype);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg ,.pdf format allowed!'));
        }
    }
});
*/

supportTicketRouter.post('/FarmerCallingHistory', authMiddleware, supportTicketController.farmerCallingHistory)
supportTicketRouter.post('/FarmerSelectCallingHistory', authMiddleware, supportTicketController.farmerSelectCallingHistory)

supportTicketRouter.post('/GetSupportTicketView_CSC', authMiddleware, supportTicketController.getTicketsList)
supportTicketRouter.post('/GetSupportTicketView_CSC_Index', authMiddleware, supportTicketController.getTicketsListIndex)
supportTicketRouter.post('/GetFarmerSupportTicketView_CSC', authMiddleware, supportTicketController.getFarmerTicketsList)
supportTicketRouter.post('/GetSupportTicketCropLossView', authMiddleware, supportTicketController.supportTicketCropLossView)

supportTicketRouter.post('/GetSupportTicketView_Insurance', authMiddleware, supportTicketController.supportTicketViewInsurance)

supportTicketRouter.post('/GetBulkTicketsList', authMiddleware, supportTicketController.getBulkTicketsList)
supportTicketRouter.post('/GetExcelBulkTicketsList', authMiddleware, supportTicketController.getExcelBulkTicketsList)
supportTicketRouter.post('/AddSupportTicket', authMiddleware, supportTicketController.addSupportTicket)
supportTicketRouter.post('/CallVoiceCallAPI',  supportTicketController.callVoiceCallAPI)
supportTicketRouter.post('/GenerateOfflineSupportTicket', authMiddleware, supportTicketController.generateOfflineSupportTicket)
supportTicketRouter.post('/GetOfflineSupportTicket', authMiddleware, supportTicketController.getOfflineSupportTicket)

supportTicketRouter.post('/AddFarmerSupportTicket', authMiddleware, supportTicketController.addFarmerSupportTicket)
supportTicketRouter.post('/GenerateSupportTicket', authMiddleware, supportTicketController.generateSupportTicket)
supportTicketRouter.post('/TicketStatusUpdate', authMiddleware, supportTicketController.updateTicketStatus)
supportTicketRouter.post('/AddBulkSupportTicketReview', authMiddleware, supportTicketController.addBulkSupportTicketReview)
supportTicketRouter.post('/UnassignedTicketListing',authMiddleware, supportTicketController.allUnassignedTickets)
supportTicketRouter.post('/FarmerTicketStatusUpdate', authMiddleware, supportTicketController.updateFarmerTicketStatus)
supportTicketRouter.post('/GetSupportTicketHistoryReport', authMiddleware, supportTicketController.supportTicketHistoryReport)
supportTicketRouter.post('/GetSupportTicketReview', authMiddleware, supportTicketController.getSupportTicketReview)
supportTicketRouter.post('/AddSupportTicketReview', authMiddleware, supportTicketController.addSupportTicketReview)
supportTicketRouter.post('/EditSupportTicketReview', authMiddleware, supportTicketController.editSupportTicketReview)
supportTicketRouter.post('/GetSupportAgeingReportDetail', authMiddleware, supportTicketController.getSupportAgeingReportDetail)
supportTicketRouter.post('/AddCSCSupportTicketReview', authMiddleware, supportTicketController.addCSCSupportTicketReview)
supportTicketRouter.post('/GetFarmerSupportTicketReview', authMiddleware, supportTicketController.getFarmerSupportTicketReview)
supportTicketRouter.post('/AddFarmerSupportTicketReview', authMiddleware, supportTicketController.addFarmerSupportTicketReview)
supportTicketRouter.post('/SendSMSToFarmer', authMiddleware, supportTicketController.sendSMSToFarmer)
supportTicketRouter.post('/SendSMSToNewFarmer', authMiddleware, supportTicketController.sendSMSToNewFarmer)
supportTicketRouter.post('/GetSupportTicketCategoryReport', authMiddleware, supportTicketController.getSupportTicketCategoryReport)
supportTicketRouter.post('/GetSupportAgeingReport', authMiddleware, supportTicketController.getSupportAgeingReport)
 supportTicketRouter.post('/GetSupportTicketDetailReport', authMiddleware, supportTicketController.getSupportTicketDetailReport)
// supportTicketRouter.post('/GetSupportTicketDetailReport', authMiddleware, griveninceReports)

supportTicketRouter.post('/GetSupportTicketReopenDetailReport', authMiddleware, supportTicketController.getSupportTicketReopenDetailReport)
supportTicketRouter.post('/AssignSupportTicketAgent',authMiddleware,supportTicketController.insuranceAssignTickets)
supportTicketRouter.post('/AgentListAndTicketCount',authMiddleware,supportTicketController.agentListAndCount)

supportTicketRouter.post('/UserWiseTicketList',authMiddleware,supportTicketController.userWiseTicketList)
supportTicketRouter.post('/UnassignSupportTicketAgent',authMiddleware,supportTicketController.insuranceUnassignTickets)


supportTicketRouter.post('/ComplaintMailReport', authMiddleware, supportTicketController.complaintMailReport)

supportTicketRouter.post('/GetAssignedTicketList', authMiddleware, supportTicketController.UserAssignedTicketsList)
supportTicketRouter.post('/GetTicketStatus', authMiddleware, supportTicketController.getTicketStatusByPhoneNumber)



supportTicketRouter.post('/UploadDocument2',authMiddleware, upload.single("files"), (req, res, next) => {

  res.status(200).send('Error uploading chunk');
})
/*supportTicketRouter.post('/UploadDocument',authMiddleware, upload.single("file"), (req, res, next) => {
  console.log('req',req);
  const { file, body: { totalChunks, currentChunk } } = req;
  const chunkFilename = `${file.originalname}.${currentChunk}`;
  const chunkPath = `${CHUNKS_DIR}/${chunkFilename}`;
  console.log('chunkPath',chunkPath);
  fs.rename(file.path, chunkPath, (err) => {
    if (err) {
      console.error('Error moving chunk file:', err);
      res.status(500).send('Error uploading chunk');
    } else {
      if (+currentChunk === +totalChunks) {
        console.log('file.originalname',file.originalname);
        // All chunks have been uploaded, assemble them into a single file
        assembleChunks(file.originalname, totalChunks)
          .then(() => res.send('File uploaded successfully'))
          .catch((err) => {
            console.error('Error assembling chunks:', err);
            res.status(500).send('Error assembling chunks');
          });
      } else {
        res.send('Chunk uploaded successfully');
      }
    }
  });
});
async function assembleChunks(filename, totalChunks) {
  const writer = fs.createWriteStream(`./krph_documents/${filename}`);
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = `${CHUNKS_DIR}/${filename}.${i}`;
    await pipeline(pump(fs.createReadStream(chunkPath)), pump(writer));
    fs.unlink(chunkPath, (err) => {
      if (err) {
        console.error('Error deleting chunk file:', err);
      }
    });
  }
}
  */

//supportTicketRouter.post('/UploadDocument', authMiddleware, supportTicketController.uploadDocument)
//supportTicketRouter.post('/UploadDocument',authMiddleware,uploadHelpers.uploadedFile, (req, res, next) => {
//supportTicketRouter.post('/UploadDocument', authMiddleware, supportTicketController.uploadDocument)
supportTicketRouter.post('/UploadDocument',authMiddleware, type, (req, res,next) => {
  try {

  let message = '';
  let fileoploadMessage = {};
  
  console.log('reqreq', req.file);
  console.log('reqreq.body', req.body);
  const mediaFolder ='./krph_documents/ABCD/';
  //let filePath ='./krph_documents/' + req.file.filename;
  let filePath =`${absolutePath}` + req.file.filename;
 // const dirpath ='./krph_documents/' + req.body.ImgPath;
// const dirpath ='./krph_documents/';
 // console.log('dirpath', dirpath);
  //console.log('mediaFolder', mediaFolder);
  
   // const mediaFolder = __dirname+'/testFiles'; // Change as per your Location
   /*
 if (req.file) { 
new Promise ((resolve, reject) => {
 if (!fs.existsSync(dirpath)) {
   try {
     fs.mkdirSync(dirpath,{ recursive: true });
   } catch (error) {
     reject(error.message)
   }
 }
 /*  fs.access(dirpath, (error) => { 

    // To check if given directory  
    // already exists or not 
    if (error) { 
      // If current directory does not exist then create it 
      fs.mkdir(dirpath, { recursive: true }, (error) => { 
        if (error) { 
          console.log(error); 
        } else { 
          console.log("New Directory created successfully !!"); 
        } 
      }); 
    } else { 
      console.log("Given Directory already exists !!"); 
    } 
  });

 let readStream = fs.createReadStream(req.file.originalname);
 readStream.once('error', (err) => {
   console.log(err);
        reject(error.message)
 });
 readStream.once('end', () => {
   console.log('done copying');
        resolve('done copying')
 });
 try {
  readStream.pipe(fs.createWriteStream(dirpath + '/' + req.file.filename));

 } catch (error) {
   reject(error.message)
 }
}).then((data) => {
 console.log(`Successfully Uploaded Document`);
}).catch((error) => {
 console.log(`Error occured at time of doc upload ${error.message}`);
})

 
 }*/
 
 message ='File uploaded successfully';


 return jsonResponseHandler(fileoploadMessage, message, req, res, () => {})

} catch (err) {
    return jsonErrorHandler(err, req, res, () => {
    })
}

})
/*
supportTicketRouter.post('/UploadDocument',authMiddleware, uploads.single('file'), (req, res) => {
  console.log("req.body",req.body);
  const { file, body: { totalChunks, currentChunk ,attachmentName,attachmentDirPath} } = req;
  console.log('reqreq', req.file);
  console.log('reqreq.body', req.body);
  const chunkFilename = `${file.originalname}.${currentChunk}`;
  const chunkPath = `${CHUNKS_DIR}/${chunkFilename}`;
  fs.rename(file.path, chunkPath, (err) => {
    if (err) {
      console.error('Error moving chunk file:', err);
      res.status(500).send('Error uploading chunk');
    } else {
      if (+currentChunk === +totalChunks) {
        // All chunks have been uploaded, assemble them into a single file
        assembleChunks(file.originalname, totalChunks)
          .then(() => res.send('File uploaded successfully'))
          .catch((err) => {
            console.error('Error assembling chunks:', err);
            res.status(500).send('Error assembling chunks');
          });
      } else {
        res.send('Chunk uploaded successfully');
      }
    }
  });
});
async function assembleChunks(filename, totalChunks) {
  const writer = fs.createWriteStream(`./krph_documents/${filename}`);
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = `${CHUNKS_DIR}/${filename}.${i}`;
    await pipeline((fs.createReadStream(chunkPath)), (writer));
    fs.unlink(chunkPath, (err) => {
      if (err) {
        console.error('Error deleting chunk file:', err);
      }
    });
  }
}
*/
