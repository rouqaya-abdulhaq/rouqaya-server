const multer = require('multer');

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
          res.status(200).send(req.file.path);
        }else{
          res.status(400).send("No file has been sent");
        }
    });
}