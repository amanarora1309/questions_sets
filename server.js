import express from "express";
import morgan from "morgan";

import cors from 'cors';
import path from 'path';
import bodyParser from "body-parser";

import questionPaperRoutes from "./routes/questionPaperRoutes.js"

// rest object
const app = express();


// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());




//routes
app.use("/api/v1/question-paper", questionPaperRoutes);


// PORT
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`server Running on ${PORT}`);
});
