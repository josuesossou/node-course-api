const env = process.env.NODE_ENV || 'developement';

console.log('ENV ****************', env);
if(env === 'developement'){

    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'


}else if(env === 'test'){

    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'

}

console.log(process.env.MONGODB_URI)