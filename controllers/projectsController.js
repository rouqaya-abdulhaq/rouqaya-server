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

module.exports = (app ,projects,client) => {
    app.post('/addProject',uploadDisk.single('img'),(req,res)=>{
        const project = extractProjectFromReq(req);
        projects.push(project)
        res.status(200).send(project);
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
        const updatedProject = extractProjectFromReq(req);
        for(let i = 0; i < projects.length; i++){
            if(projects[i].title === projectTitle){
                projects[i] = updatedProject;
            }
        }
        res.status(200).send(updatedProject);
    });

    app.delete('/removeProject',(req,res)=>{
        const index = req.body.index;
        console.log(index);
        projects.splice(index,1);
        res.status(200).send("project removed");
    });
}

const extractProjectFromReq = (req) =>{
    return{
        id : req.body.id,
        title : req.body.title,
        info : req.body.info,
        url : req.body.url,
        imgUrl : checkAndAssignImgUrl(req.file)
    }
}

const checkAndAssignImgUrl = (file) =>{
    if(file){
        return 'C:\\Users\\acer\\Desktop\\projects\\rouqaya-server\\' + file.path;
    }else{
        return "";
    }
}