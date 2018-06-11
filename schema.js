const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList} = require ('graphql')

const fetch = require('node-fetch')

const result = fetch('https://reqres.in/api/users/')
    .then(response => response.json());

const UserType = new GraphQLObjectType({
    name: "User",
    description: "Specific user",
    fields: () => ({
        first_name : {
            type: GraphQLString,
            resolve : (root) => root.first_name
        },
        last_name: {
            type: GraphQLString,
            resolve : (root) => root.last_name
        },
        avatar : {
            type: GraphQLString,
            resolve : (root) => root.avatar
        }
    })
})

const schema = new GraphQLSchema({
    query : new GraphQLObjectType({
        name : "Users",
        description: "Sample Users",
        fields: () =>({
            users : {
                type: GraphQLList(UserType),
                args: {
                    page : { type: GraphQLInt},
                    perPage: { type: GraphQLInt }
                },
                resolve: (root, args) =>  fetch(`https://reqres.in/api/users/?page=${args.page||0}&per_page=${args.perPage||0}`).then(response => response.json()).then(json => json.data)
            },
            user : {
                type: UserType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) => fetch(`https://reqres.in/api/users/${args.id}`).then(response => response.json().then(json => json.data))
            },
        }),
        
    })
})

module.exports = schema