const mongoose = require('mongoose')

mongoose.connect(process.env.HOST, {
    dbName:process.env.DB_NAME, 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
    useFindAndModify: false
})
.then(()=>{
   console.log('mongoose connected');
})
.catch((err)=>{
    console.log(err);
})

mongoose.connection.on('connected', ()=>{
    console.log('mongoose connected to db')
})
mongoose.connection.on('error', (err)=>{
    console.log(err.message)
})
mongoose.connection.on('disconnected', ()=>{
    console.log('mongooes connection disconnected ')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})