import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app= express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());

//routes

//route import
import adminRouter from "./routes/admin.routes.js"
import eventRouter from "./routes/event.routes.js"

//route declare
app.use('/api/v1/admin', adminRouter); 
app.use('/api/v1/event', eventRouter); 

export {app}