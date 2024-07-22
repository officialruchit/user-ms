import express  from "express";
import db from './config/db'
const app=express()
const PORT=5555
db();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});