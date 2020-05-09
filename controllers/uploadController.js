const multer = require('multer');
const fs = require('fs');
const stream = require('stream');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./')
    },
    filename : function(req,file,cb){
      cb(null,file.originalname);
    }
  });
  
  const uploadDisk = multer({storage : storage});

module.exports = (app) =>{
    app.post('/uploadImg',uploadDisk.single('img'),(req,res)=>{
        if(req.file){
          res.status(200).sendFile('C:\\Users\\acer\\Desktop\\projects\\rouqaya-server\\' + req.file.path);
        }else{
          res.status(400).send("No file has been sent");
        }
    });

    app.get('/getImg' , (req,res) =>{
      if(req.query.filePath){
        const path = 'C:\\Users\\acer\\Desktop\\projects\\rouqaya-server\\' + req.query.filePath;
        fs.access(path,fs.F_ok,(err)=>{
          if(err){
            res.status(404).send("No Such File Were Found");
          }else{
            res.status(200).sendFile(path);
          }
        })
      }else {
        res.status(400).send("no file has been specified");
      } 
    });
}