
const todos = [
    { id: 0, task: "Learn Vue.js", completed: false },
    { id: 1, task: "Learn Apollo", completed: true }
];

const resolvers = {
    Query: {
        getTodos: () => (
            todos
        )
    }
};

module.exports = resolvers;