
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';



export const genrateQuestionSetsController = async (req, res) => {
    try {
        let filePaths = req.files.map(file => file.path);

        const { name } = req.body;
        const parentFolder = 'results';
        const newFolder = name;
        const newFolderPath = path.join(parentFolder, newFolder);
        fs.mkdirSync(newFolderPath);
        let fileReadPromises = filePaths.map(async (path) => {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(path);
            const worksheet = workbook.getWorksheet();
            if (!worksheet) {
                throw new Error('Worksheet not found in the Excel file.');
            }

            let data = [];
            const heading = [];

            worksheet.eachRow((row, rowNumber) => {
                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    if (rowNumber == 99) {

                        // console.log("value ---> ", cell.value.richText);
                    }
                    if (rowNumber == 1) {
                        heading[colNumber - 1] = cell.value;
                    } else {
                        if (cell.value.richText && cell.value.richText.length > 0) {
                            // Handle rich text formatting
                            const formattedText = cell.value.richText.map((textObject) => {
                                const vertAlign = textObject.font && textObject.font.vertAlign;
                                const text = textObject.text;

                                // Check if the text is a degree symbol
                                if (text === '°') {
                                    return '°'; // Keep the degree symbol as is
                                }

                                // Process the text based on vertAlign value
                                // (You can customize this part based on your requirements)
                                const formattedText = vertAlign === 'superscript' ? superscriptMapping[text] : text;

                                return formattedText;
                                // return textObject.text;
                            }).join('');
                            rowData[`column${colNumber}`] = formattedText;
                        } else {
                            rowData[`column${colNumber}`] = cell.value;
                        }
                        // rowData[`column${colNumber}`] = cell.value;
                    }
                });
                if (rowNumber !== 1) {
                    data.push(rowData);
                }
            });

            data.shift();
            return data;
        });

        let filesData = await Promise.all(fileReadPromises);
        let data = filesData[0];
        let inputFileWithAnswer = "";
        let inputFileWithOutAnswer = "";
        for (let i = 0; i < data.length; i++) {
            let a = data[i];
            let b = "";
            b += (i + 1) + ".";
            b += "   " + a.column2 + "\n";
            b += "     " + "(a) " + a.column3 + "\n";
            b += "     " + "(b) " + a.column4 + "\n";
            b += "     " + "(c) " + a.column5 + "\n";
            b += "     " + "(d) " + a.column6 + "\n";
            inputFileWithOutAnswer += b + "\n";
            b += "     " + "(ans) " + a.column7 + "\n";
            inputFileWithAnswer += b + "\n";
        }

        const oq = 'results/' + name + '/Orignal_set' + '.txt';
        const qwa = 'results/' + name + '/Orignal_Set_WithAnswer' + '.txt';

        fs.writeFileSync(qwa, inputFileWithAnswer);
        fs.writeFileSync(oq, inputFileWithOutAnswer);
        let questionSetsData = [];
        for (let i = 0; i < 4; i++) {

            let a = [];
            let len1 = filesData[0].length;
            // let len2 = filesData[1].length;
            for (let j = 0; j < len1; j++) {
                let index = (j + 25 + ((i + 1) * 10)) % len1
                let b = filesData[0][index];

                a.push(b);

            }

            let mergedData = a;
            let questionsWithAnswer = "";
            let onlyQuestions = "";

            let qsd = [];

            for (let j = 0; j < mergedData.length; j++) {
                let a = mergedData[j];
                let b = "";
                b += (j + 1) + ".";
                b += "   " + a.column2 + "\n";
                b += "     " + "(a) " + a.column3 + "\n";
                b += "     " + "(b) " + a.column4 + "\n";
                b += "     " + "(c) " + a.column5 + "\n";
                b += "     " + "(d) " + a.column6 + "\n";
                onlyQuestions += b + "\n";
                b += "     " + "(ans) " + a.column7 + "\n";
                questionsWithAnswer += b + "\n";



                let c = { qno: a.column1, ans: a.column7 };
                qsd.push(c);
            }
            questionSetsData.push(qsd);
            let character = 'a';
            let asciiCode = character.charCodeAt(0);
            asciiCode = asciiCode + i
            const letter = String.fromCharCode(asciiCode);

            const oq = 'results/' + name + '/onlyQuestion_set-' + letter + '.txt';
            const qwa = 'results/' + name + '/questionWithAnswer_set-' + letter + '.txt';

            fs.writeFileSync(qwa, questionsWithAnswer);
            fs.writeFileSync(oq, onlyQuestions);
        }

        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Questions');


        // Define the columns in the Excel sheet 
        worksheet.columns = [
            { header: 'QNo.', key: 'Qno' },
            { header: 'SetA', key: 'SetA' },
            { header: 'AnsA', key: 'AnsA' },
            { header: 'SetB', key: 'SetB' },
            { header: 'AnsB', key: 'AnsB' },
            { header: 'SetC', key: 'SetC' },
            { header: 'AnsC', key: 'AnsC' },
            { header: 'SetD', key: 'SetD' },
            { header: 'AnsD', key: 'AnsD' },
        ];




        for (let j = 0; j < questionSetsData[0].length; j++) {

            worksheet.addRow({
                Qno: j + 1,
                SetA: questionSetsData[0][j].qno,
                AnsA: questionSetsData[0][j].ans,
                SetB: questionSetsData[1][j].qno,
                AnsB: questionSetsData[1][j].ans,
                SetC: questionSetsData[2][j].qno,
                AnsC: questionSetsData[2][j].ans,
                SetD: questionSetsData[3][j].qno,
                AnsD: questionSetsData[3][j].ans,

            });
        }




        const buffer = await workbook.xlsx.writeBuffer();
        let p = 'results/' + name + '/SetsDetail.xlsx';

        fs.writeFileSync(p, buffer);

        res.status(200).send({ success: true, message: "Processing completed" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error, message: "Error in generating question sets" });
    }
};







function generateSuperscriptMap() {
    const superscriptMap = {};

    for (let i = 0; i <= 1000; i++) {
        const key = i.toString();
        const superscriptValue = i < 10 ? convertToSuperscript(i) : convertToSuperscriptTens(i);

        superscriptMap[key] = superscriptValue;
    }

    return superscriptMap;
}

function convertToSuperscript(number) {
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

    return number.toString().split('').map(digit => superscripts[digit]).join('');
}

function convertToSuperscriptTens(number) {
    const tens = Math.floor(number / 10);
    const units = number % 10;

    if (tens === 1) {
        return `¹${convertToSuperscript(units)}`;
    } else {
        return `${convertToSuperscript(tens)}${convertToSuperscript(units)}`;
    }
}

const superscriptMapping = generateSuperscriptMap();

// console.log(superscriptMapping);
