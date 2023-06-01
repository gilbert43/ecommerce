const { default: mongoose } = require("mongoose")

const dbConnect = async() =>{
    try{
      const resp = await mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("connected")
      })
    }catch(e){
      console.log(e.message)
    } 
}

module.exports = dbConnect;

