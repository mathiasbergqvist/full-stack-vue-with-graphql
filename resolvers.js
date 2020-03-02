const todos = [
    { task: 'Learn Vue.js', completed: false },
    { task: 'Learn Apollo', completed: true }
];

const resolvers = {
    Query: {
        getTodos: () => todos
    },
    Mutation: {
        // Destructure the second parameter "args"
        addTodo: (_, { task, completed }) => {
            const todo = { task, completed };
            todos.push(todo);
            return todo;
        }
    }
};

module.exports = resolvers;
