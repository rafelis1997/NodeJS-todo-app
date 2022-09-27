const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();


app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const checkIfUserAlreadyExists = users.some(user => user.username === username);

  if(checkIfUserAlreadyExists) {
    return response.status(400).json({error: "User already exists!"});
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(newUser);

  return response.status(200).json(newUser);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(201).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(user.todos[0]);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { id } = request.params;

  const { title, deadline } = request.body;

  const checkIfTodoExists = user.todos.find(todo => todo.id === id);

  if(!checkIfTodoExists) {
    return response.status(404).json({error: "Todo not found"});
  }

  user.todos.map(todo => {
    
    if(todo.id === id) {
      todo.title = title;
      todo.deadline = new Date(deadline);
      return;
    }
    return todo;
  });

  return response.status(200).json(user.todos.find(todo => todo.id === id));
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { id } = request.params;

  const checkIfTodoExists = user.todos.find(todo => todo.id === id);

  if(!checkIfTodoExists) {
    return response.status(404).json({error: "Todo not found"});
  }

  user.todos.map(todo => {
    
    if(todo.id === id) {
      todo.done = true;
      return;
    }
    return todo;
  });

  return response.status(200).json(user.todos.find(todo => todo.id === id));
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const deletedTodo = user.todos.find(todo => todo.id === id);

  if(!deletedTodo) {
    return response.status(404).json({error: "Todo not found"});
  }

  user.todos.splice(deletedTodo, 1);

  return response.status(204).json(user.todos);
});

module.exports = app;