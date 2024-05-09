import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import dotenv from 'dotenv';
import 'dotenv/config'
import './config/db.js'
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';


const  __filename= fileURLToPath(import.meta.url);
const  __dirname= path.dirname(__filename);

//rest object
const app = express();

//middelwares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'./client/build')))
//routes
app.use(authRoutes);
app.use(categoryRoutes);
app.use(productRoutes);



// Add CORS middleware to handle OPTIONS requests
// app.options('/admin-auth', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.sendStatus(200);
//   });
  
//   // You can also handle other routes similarly if needed
//   app.options('/all-category', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.sendStatus(200);
//   });
  
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})





//rest api
// app.get('/',(req,resp)=>{

//      resp.send({message:'welcome to ecommerce'})
//      console.log('server is on')
// })

// const PORT = 8080;
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log('server running on 8080')
});