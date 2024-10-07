import express from "express";
import upload from './../multer_uploader/upload_file.js';
import { genrateQuestionSetsController } from "../controller/questionPaperController.js";


const router = express.Router();


router.post('/genrate-question-sets', upload.array('excelFile'), genrateQuestionSetsController);



export default router;