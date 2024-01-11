const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'StudentDB'
});

const responseSchema = new mongoose.Schema({
  qid: String,
  question: String,
  response: String,
});

const studentSchema = new mongoose.Schema({
  stdName: {
    type: String,
    required: true,
  },
  stdId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phNo: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  sem: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  responses: {
    type: [responseSchema],
    required: true,
  },
});


const Student = mongoose.model('Student', studentSchema);

app.get('/');

app.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(studentId);
  try {
    const studentData = await Student.findOne({ stdId: studentId });
    //console.log(studentData);
  if(studentData){
    res.json(studentData);
  }
  else{
    res.json("Student Not Found");
  }
  } catch (error) {
    console.error('Error retrieving student data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/submit-form', async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    console.log(formData.courseId);
    const newStudent = new Student({
      stdName: formData.stdName,
      stdId: formData.stdId,
      email: formData.email,
      phNo: formData.phNo,
      courseName: formData.courseName,
      courseId: formData.courseId,
      sem: formData.sem,
      year: formData.year,
      responses: formData.responses,
    });
    const duplicateEntry = await Student.find({stdId: formData.stdId, courseName: formData.courseName});
    if(duplicateEntry.length > 0){
      res.json("Duplicate Entry");
      console.log(duplicateEntry);
    }
    else{
    await newStudent.save();

    console.log('Document successfully inserted');
    res.json({ message: 'Form Successfully Submitted!' });
    }
  } catch (e) {
    console.log('Error Occurred:', e.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Express Listening on ${port}`);
});
