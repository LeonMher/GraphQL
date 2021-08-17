const express = require('express');
const userData = require('./MOCK_DATA.json')
const graphql = require('graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = graphql
const { graphqlHTTP } = require('express-graphql')


const app = express();

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },


    })
})

const RootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                return userData
            }
        }
    }
});



const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },

            },
            resolve(parent, args) {
                userData.push({ id: userData.length + 1, firstName: args.firstName, lastName: args.lastName })
                return args;
            }
        }
    }
})

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation })

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true

}))

app.listen(8001, () => {
    console.log('listening')
})