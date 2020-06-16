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
        addProjectToDB(project,client,res);
    });

    app.get('/loadProjects',(req,res)=>{
        let beginIndex = req.query.loadCount * 10;
        const projectCopy = [...projects];
        const projectsToSend = projectCopy.splice(beginIndex, 10);
        console.log(projectsToSend); 
        res.status(200).send(projectsToSend);
    });

    app.get('/loadProject',(req,res)=>{
        let projectId = req.query.projectId;
        getProjectFromDB(projectId,client,res);
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
        github : req.body.github,
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

const addProjectToDB = (project,client,res) =>{
    const query = addProjectQuery(project);
    client.query(query,(err,response)=>{
        if(err){
            res.status(403).send({message : "could not post project to DB"});
        }else{
            const id = response.rows[0].id;
            console.log(id);
            getProjectFromDB(id,client,res);
        }
    });
}

const getProjectFromDB = (projectId, client, res) => {
    client.query(`SELECT * FROM projects WHERE id = '${projectId}'`,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not get project from DB"});
        }else{
            if(response.rows[0]){
                res.status(200).send(response.rows[0]); 
            }else{
                res.status(403).send({message : "the provided id does not match any project"}); 
            }
        }
    });
}

const addProjectQuery = (project) =>{
    return `INSERT INTO projects(title,info,url,github)
    VALUES('${project.title}','${project.info}','${project.url}','${project.github}') 
    RETURNING id`; 
}