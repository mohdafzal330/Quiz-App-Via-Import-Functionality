let mammoth = require('mammoth');
const multer = require('multer');

// mammoth.extractRawText({path: "/home/afzalkhan/Projetcs/Online-Examination-System/src/question-files/questions.docx"})
// .then(function(result){
//     var text = result.value; // The raw text
//     var messages = result.messages;
//     console.log(text);
// })
// .catch(function(error) {
//     console.error('565',error);
// });

let storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, '/home/afzalkhan/Projetcs/Online-Examination-System/src/question-files/new/')
    },
    filename: function(request, file, callback){
        callback(null, 'newFile.docx')
    }
})
let upload = multer({storage: storage})

upload.any('/home/afzalkhan/Projetcs/Online-Examination-System/src/question-files/questions.docx')