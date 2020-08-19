const express = require("express");
const cors = require("cors");
const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateID = (request, response, next) => {
  const { id } = request.params;

  if (!validate(id))
    return response.status(400).json({ error: "Repo ID isn't valid!" });

  return next();
};

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };

  repositories.push(repo);

  return response.status(200).json(repo);
});

app.put("/repositories/:id", validateID, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex((project) => project.id === id);

  if (repoIndex < 0)
    return response.status(400).json({ error: "Project not found" });

  const oldRepo = repositories[repoIndex];
  const project = {
    id,
    title,
    url,
    techs,
    likes: oldRepo.likes,
  };

  repositories[repoIndex] = project;
  return response.json(project);
});

app.delete("/repositories/:id", validateID, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((project) => project.id === id);

  if (repoIndex < 0)
    return response.status(400).json({ error: "Project not found" });

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateID, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((project) => project.id === id);

  if (repoIndex < 0)
    return response.status(400).json({ error: "Project not found" });

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
