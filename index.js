const express = require('express');

const server = express();

server.use(express.json());

var projects = [];

const checkId = (req, res, next) => {
    const { id } = req.params;

    const project = projects.find(x => x.id == id);

    if(!project)
        return res.status(400).json({ error: "Project does not exists."});

    return next();
}

var number_of_reqs = 0;

const countReq = (req, res, next) => {
    number_of_reqs++;
    console.log("Número de requisições: " + number_of_reqs);

    next();
}

server.use(countReq);

server.post("/projects", (req, res) => {
    const { id, title } = req.body;

    projects.push({
        id,
        title,
        tasks: []
    });

    return res.json({projects});
});

server.get("/projects", (req, res) => {
    return res.json({projects});
});

server.put("/projects/:id", checkId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.find(x => x.id == id).title = title;

    return res.json({projects});
});

server.delete("/projects/:id", checkId, (req, res) => {
    const { id } = req.params;

    const removedItem = projects.map(project => {
        return project.id;
    }).indexOf(id);

    projects.splice(removedItem, 1);

    return res.json({projects});
});

server.post("/projects/:id/tasks", checkId, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.find(x => x.id == id).tasks.push(title);

    return res.json({projects});
});

server.listen(3333);