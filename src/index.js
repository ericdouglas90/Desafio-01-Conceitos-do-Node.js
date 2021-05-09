const express = require('express');
const cors = require('cors');
const { v4: uuidv4, v4} = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  
  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({ error: "User don't exist!" });
  }

  request.user = user;

  return next();
  
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExist = users.some(user => user.username === username);

  if(userAlreadyExist) {
    return response.status(400).json({ error: "User already exist!" });
  }

  const createUser = {
    id: v4(),
    name,
    username,
    todos: []
  }

  users.push(createUser)

  return response.status(201).json(createUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  // console.log(user);
  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const createTodos = {
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(createTodos);

  return response.status(201).json(createTodos);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  
  const { user } = request;
  const todos = user.todos.find(todo => todo.id === id);

  if(!todos) {
    return response.status(404).json({ error: "User dont exist!" });
  }

  todos.title = title;
  todos.deadline = new Date(deadline);

  return response.status(201).json(todos);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  
  const { user } = request;
  const todos = user.todos.find(todo => todo.id === id);

  if(!todos) {
    return response.status(404).json({ error: "User dont exist!" });
  }

  todos.done = true;

  return response.status(200).json(todos);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  
  const { user } = request;
  const todos = user.todos.findIndex(todo => todo.id === id);

  if(todos === -1) {
    return response.status(404).json({ error: "User dont exist!" });
  }

 user.todos.splice(todos, 1);

  return response.status(204).send();
});

module.exports = app;