const express = require('express');
const cors = require('cors');
let mammoth = require('mammoth');
const multer = require('multer');
const convertAPI = require('convertapi')('fQuKxYj7Y78ZR6qf')
const { readFile, writeFileSync  } = require('fs')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mohammadraaz:js0R1WzeupZtwpHE@cluster0.9jttv89.mongodb.net/EcomApp');

const questionSchema = new mongoose.Schema({
    question: String,
    optionA: String,
    optionB: String,
    optionC: String,
    optionD: String,
    answer: String
});
let Question = mongoose.model("Question", questionSchema); 

const app = express();
app.use(express.json())
app.use(cors())

let storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './question-files/quiz-1/')
    },
    filename: function(request, file, callback){
        callback(null, 'question.docx')
    }
})
let upload = multer({storage: storage})

app.get('/questions', async (req,res)=>{
    let result = await Question.find()
    res.status(200).send(result);
})

app.get('/loadQuestions', async (req,res) => {
    res.status(200).sendFile('question-files/quiz-1/question.html', {root:'.'});
})

app.post('/uploadFile', upload.single('questionFile'), async (req, res) => {

    convertAPI.convert('html', {
        File: req.file?.path
    }, 'docx').then(async function(result) {
        await result.saveFiles('./question-files/quiz-1/question.html');

        mammoth.convertToHtml({path: req.file?.path})
        .then(async function(result){
            var text = result.value.split('<p>'); 
            for (let i = 0; i < text.length; i++) {
                let question, optionA, optionB, optionC, optionD;
                let line = text[i].split('</p>')[0]
                if(line.charAt(0)=='Q'){
                    question = line;
                    
                    if(line.charAt(1)=='2') {
                        i++;
                        await readFile('./question-files/quiz-1/question.html','utf8', (error, data)=>{ 
                            let htmlFileText = data.split('src="')[1];
                            let base64 = '', idx = 0;
                            while(htmlFileText.charAt(idx)!='"'){
                                base64 +=htmlFileText.charAt(idx++)
                            }
                            question = line;
                            optionA = './question-files/quiz-1/Q2Option1.gif';
                            optionB = text[i+2].split('</p>')[0]
                            optionC = text[i+3].split('</p>')[0]
                            optionD = text[i+4].split('</p>')[0]
                            answer = text[i+5].split('</p>')[0]
                            saveQuestion(question, optionA,  optionB, optionC, optionD, answer);
                            const buffer = Buffer.from(base64.split(',')[1], "base64");
                            writeFileSync('./question-files/quiz-1/Q2Option1.gif', buffer);
                        })
                    } else if (line.charAt(1)=='3') {
                        await readFile('./question-files/quiz-1/question.html','utf8', (error, data)=>{ 
                            question = line;
                            let htmlFileText = data.split('src="');
                            for (let indx = 2; indx < htmlFileText.length; indx++) {
                                const element = htmlFileText[indx];
                                
                                let base64 = '', idx = 0;
                                while(element.charAt(idx)!='"'){
                                    base64 +=element.charAt(idx++)
                                }
                                if(indx==2) optionA = './question-files/quiz-1/Q3Option'+(indx-1)+'.gif';
                                if(indx==3) optionB = './question-files/quiz-1/Q3Option'+(indx-1)+'.gif';
                                if(indx==4) optionC = './question-files/quiz-1/Q3Option'+(indx-1)+'.gif';
                                if(indx==5) optionD = './question-files/quiz-1/Q3Option'+(indx-1)+'.gif';
                                let d = base64.split(',')[1]
                                const buffer = Buffer.from(base64.split('base64,')[1], "base64");
                                writeFileSync('./question-files/quiz-1/Q3Option'+(indx-1)+'.gif', buffer);
                            }

                            answer = text[i+5].split('</p>')[0]
                            saveQuestion(question, optionA,  optionB, optionC, optionD, answer);
                        })
                    } else {
                        optionA = text[i+1].split('</p>')[0]
                        optionB = text[i+2].split('</p>')[0]
                        optionC = text[i+3].split('</p>')[0]
                        optionD = text[i+4].split('</p>')[0]
                        answer = text[i+5].split('</p>')[0]
                        saveQuestion(question, optionA,  optionB, optionC, optionD, answer);
                    }
                }
            }
        })
        .catch(function(error) {
            console.error('Error in processing question file',error);
        });
        
    });
    res.status(201).send('File uploaded successfully');
})
app.listen(8200, () => {
    console.log('Listening at port 8200');
});

async function saveQuestion(question, optionA,  optionB, optionC, optionD, answer) {
    console.log('Saving...');
    let dbQuestion = new Question({
        question, optionA,  optionB, optionC, optionD, answer
    });
    await dbQuestion.save();
}