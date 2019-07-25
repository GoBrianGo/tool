var express = require('express');
var graphqlHTTP = require('express-graphql');
var {
    GraphQLID,
    GraphQLList,  // 数组列表
    GraphQLObjectType, // 对象
    GraphQLString, // 字符串
    GraphQLInt,  // int类型
    GraphQLFloat,  // float类型
    GraphQLEnumType,  // 枚举类型
    GraphQLNonNull,
    buildSchema,
    GraphQLSchema,
    GraphQLObjectType
} = require('graphql');

//定义schema
var schema = buildSchema(`
    type User{
        name: String
        sex: String
        intro: String
    }
    type Anchor{
        name: String
        sex: String
        age: Int
    }
    type Query {
        user:User,
        anchor: Anchor
    }
`);
const userType = new GraphQLObjectType({
  name: 'userItem',
  description: '用户信息',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: '数据唯一标识'
    },
    username: {
      type: GraphQLString,
      description: '用户名'
    },
    age: {
      type: GraphQLInt,
      description: '年龄'
    },
    height: {
      type: GraphQLFloat,
      description: '身高'
    },
  })
})

function timeout(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
const outputType = new GraphQLObjectType({
  name: 'output',
  fields: () => ({
    id:     { type: GraphQLString},
    age:     { type: GraphQLInt},
    success:   { type: GraphQLString },
  })
});
// 规范写法，声明query(查询类型接口) 和 mutation(修改类型接口)
const hello = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'hello',
        description: '查询数据',
        fields: () => ({
            // 查询类型接口方法名称
            test: {
                type: outputType,
                description: 'test',
                args: {
                    id: {
                        type: GraphQLID
                    }
                },
                async resolve(value, args) {
                    console.log(value, args)
                    // await timeout(10000)
                    return timeout(0).then(() => {return {
                        "id": "5bce2b8c7fde05hytsdsc12c",
                        "username": "Davis",
                        "age": 23,
                        "height": 190.5,
                    }})
                },
            },
            count: {
                type:GraphQLString,
                resolve() {
                    return 'Brian'
                }
            }
        })
    }),
})
const hello1 = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'hello1',
        description: '查询数据',
        fields: () => ({
            // 查询类型接口方法名称
            test1: {
                type: outputType,
                description: 'test',
                args: {
                    id: {
                        type: GraphQLID
                    }
                },
                async resolve(value, args) {
                    console.log(value, args)
                    // await timeout(10000)
                    return timeout(0).then(() => {return {
                        "id": "123",
                        "username": "Davis",
                        "age": 23,
                        "height": 190.5,
                    }})
                },
            },
            count: {
                type:GraphQLString,
                resolve() {
                    return 'Brian'
                }
            }
        })
    }),
})

const schemas = {
    hello,
    hello1,
}
//定义服务端数据
var root = {
    user: async () => {
        await timeout(1000)
        return {
            name: 'Brian1',
            sex: '男',
            intro: '234234'
        }
    },
    anchor: async () => {
        await timeout(5000)
        return {
            name: 'Brian',
            age: 24,
            sex: '男',
            intro: 'sdfdsf'
        }
    }
};

var app = express();
app.use('/graphql', graphqlHTTP(async (request, response, graphQLParams) => {
    // console.log(graphQLParams);
    // var schema = schemas[graphQLParams.operationName]
    return {
        schema: schema,
        rootValue: root,
        graphiql: true,
    }
  }),
);

app.listen(4000, () => console.log('请在浏览器中打开地址：localhost:4000/graphql'));