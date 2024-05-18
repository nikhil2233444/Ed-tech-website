const express=require('express')
const app=express();



const userRoutes=require('./routes/User')
const profileRoutes=require('./routes/Profile')
const PaymentsRoutes=require('./routes/Payments')
const courseRoutes=require('./routes/Course')


const database=require('./config/database')
const cookieParsar=require('cookie-parser')
const cors=require('cors')

const fileUpload=require('express-fileupload')
const dotenv=require('dotenv')
dotenv.config()
const {cloudinaryConnect}=require('./config/cloudnary')
const PORT=process.env.PORT||PORT 

app.use(express.json())
app.use(cookieParsar())
//connect database
database.connect();

// connet cloudnary
cloudinaryConnect();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(
    fileUpload({

        useTempFiles:true,
        tempFileDir:'/temp'
    })
)

//routes
app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/payment',PaymentsRoutes)
app.use('/api/v1/profile',profileRoutes)


app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:"you server is up and this is defualt sever"
    })
})


app.listen(PORT,()=>{
    console.log(`app is running at port number ${PORT}`)
})

