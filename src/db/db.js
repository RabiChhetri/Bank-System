const mongoose=require('mongoose')
const dns=require('dns')

dns.setServers(['8.8.8.8','8.8.4.4'])

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('Connected to database successfully')
    })
    .catch((error)=>{
        console.log('Database connection error',error)
        process.exit(1)
    })
}
module.exports=connectDB