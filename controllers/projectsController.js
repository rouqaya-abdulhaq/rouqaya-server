const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./')
    },
    filename : function(req,file,cb){
      cb(null,file.originalname);
    }
  });
  
const uploadDisk = multer({storage : storage});
//CLEAN UP REPEATED CODE
module.exports = (app ,projects) => {
    app.post('/addProject',uploadDisk.single('img'),(req,res)=>{
        const title = req.body.title;
        const info = req.body.info;
        const url = req.body.url;
        let imgUrl = "";
        if(req.file){
            imgUrl = 'C:\\Users\\acer\\Desktop\\projects\\rouqaya-server\\' + req.file.path
        }
    
        const project = {
            title : title,
            info : info,
            url : url,
            imgUrl : imgUrl
        }
        projects.push(project)
        res.status(200).send(projects);
    });

    app.get('/loadProjects',(req,res)=>{
        let beginIndex = req.query.loadCount * 10;
        const projectCopy = [...projects];
        const projectsToSend = projectCopy.splice(beginIndex, 10);
        console.log(projectsToSend); 
        res.status(200).send(projectsToSend);
    });

    app.get('/loadProject',(req,res)=>{
        let projectTitle = req.query.projectTitle;
        for(let i = 0; i < projects.length; i++){
            if(projects[i].title === projectTitle){
                res.status(200).send(projects[i]);
            }
        }
    });

    app.put('/editProject',uploadDisk.single('img'),(req,res)=>{
        let projectTitle = req.query.projectTitle;
        const updatedProject = {
             title : req.body.title,
             info : req.body.info,
             url : req.body.url,
             imgUrl : "",
        };
        if(req.file){
            updatedProject.imgUrl = 'C:\\Users\\acer\\Desktop\\projects\\rouqaya-server\\' + req.file.path
        }
        for(let i = 0; i < projects.length; i++){
            if(projects[i].title === projectTitle){
                projects[i] = updatedProject;
            }
        }
        res.status(200).send(projects);
    });

    app.delete('/removeProject',(req,res)=>{
        const index = req.body.index;
        console.log(index);
        projects.splice(index,1);
        res.status(200).send(projects);
    });
}