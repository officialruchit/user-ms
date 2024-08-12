import express  from "express";
import db from './config/db'
import Routes from '../src/routes/userRoutes'
const app=express()
app.use(express.json());
app.use('/user',Routes)
const PORT=5555
db();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});