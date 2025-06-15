import dotenv from 'dotenv'
import {app} from './app.js'
dotenv.config()
import connectDB from "./db/index.js"

connectDB()
.then(()=>{
    
    app.listen(process.env.PORT||3000, ()=>{
        console.log(`Server is running on some port`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!! :", err)
})
