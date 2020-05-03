module.exports = (app ,projects) => {
    app.post('/addProject',(req,res)=>{
        const title = req.body.title;
        const info = req.body.info;
        const url = req.body.url;
        const imgUrl = req.body.imgUrl;
    
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
        const projectsToSend = projectCopy.splice(beginIndex, 10) 
        res.status(200).send(projectsToSend);
    });

    app.get('/loadProject',(req,res)=>{
        let projectTitle = req.query.projectTitle;
        for(let i = 0; i < projects.length; i++){
            if(projects[i].title === projectTitle){
                console.log(projects[i]);
                res.status(200).send(projects[i]);
            }
        }
    });

    app.put('/editProject',(req,res)=>{
        let projectTitle = req.query.projectTitle;
        const updatedProject = req.body.updatedProject;
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