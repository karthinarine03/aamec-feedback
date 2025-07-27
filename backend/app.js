import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDatabase from './config/dbConnect.js';
import courserouter from './routers/courserouter.js';
import studentRouter from './routers/studentRouter.js';
import staffRouter from './routers/staffRouter.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// 1. Load env variables before anything else
dotenv.config({ path: './config/config.env' });

const app = express();

// 2. Connect to MongoDB once, using process.env.MONGO_URI
connectDatabase();
console.log('PORT:', process.env.PORT);
// console.log('MONGO_URI:', process.env.MONGO_URI);
// 3. Middlewares
app.use(express.json());
app.use(cors({
  origin: '*'
}));

// 4. Routes
app.use('/api/v1', courserouter);
app.use('/api/v1', studentRouter);
app.use('/api/v1', staffRouter);
app.get('/',(req,res)=>{
  res.json({
    message : "welcome "
  })
})
// 5. Error handling
app.use(errorMiddleware);

// 6. Start server with a default port
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on sucess`);
});
