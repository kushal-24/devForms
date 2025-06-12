import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})
import connectDB from "./db/index.js"

connectDB()
.then(()=>{
    
    app.listen(process.env.PORT||8000, ()=>{
        console.log(`Server is running on some port`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!! :", err)
})
