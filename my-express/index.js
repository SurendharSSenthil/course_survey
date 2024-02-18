const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = 4000;

app.use(bodyParser.json());
// app.use(cors());

if (!process.env.MONGODB_CONNECTION_STRING) {
  console.error('MONGODB_CONNECTION_STRING is not set. Please set it in your environment.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'StudentDB'
});

const nameList = new mongoose.Schema({
  SNo: Number,
  RegNo: String,
  StdName: String,
  DOB: String
});

const questionschema = new mongoose.Schema({
    qid: Number,
    question: String
})

const responseSchema = new mongoose.Schema({
  qid: Number,
  question: String,
  response: String,
});

const courseListSchema = new mongoose.Schema({
  coursecode: String,
  coursename: String,
  questions: [questionschema]
});

const studentSchema1 = new mongoose.Schema({
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
  sem: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  courselist:{
    type: Object,
    required: true,
  },
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
    type: String,
    required: true,
  },
  responses: {
    type: [responseSchema],
    required: true,
  },
});

const Student1 = mongoose.model('IIIyrstudent',studentSchema1);
const Student = mongoose.model('IIIyrresponse', studentSchema);
const StudentIDModel = mongoose.model('IIIyrnameList', nameList);
const coursesModel = mongoose.model('IIIyrcourselist', courseListSchema);

//forLogin checking
app.post('/api/studentID', async (req, res) => {
  const studentAuth = req.body;
  console.log(studentAuth);
  const studentID = studentAuth.regNo;
  const studentDOB = studentAuth.dob;
  try {
    const isFound = await StudentIDModel.find({ RegNo: studentID, DOB: studentDOB });
    console.log(isFound);
    if (isFound.length>0) {
      res.json(isFound);
    } else {
      res.json("Wrong password");
    }
  } catch (err) {
    console.error('Error retrieving student data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//for auto data entry of Students from students collection
app.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(studentId);
  try {
    const studentData = await Student1.findOne({ stdId: studentId });
    console.log(studentData);
    if (studentData) {
      res.json(studentData);
    }
    else {
      res.json("Student Not Found");
    }
  } catch (error) {
    console.error('Error retrieving student data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//question for each course
app.get('/api/courses/:course', async(req,res) => {
  try{
      const coursecode = req.params.course;
      const data = await coursesModel.find({coursecode:coursecode});
      console.log(data[0]);
      res.send(data[0]);
}catch(err){console.log(err);}
})

//form submission to coursesurvey
app.post('/api/submit-form', async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    console.log(formData.courseId);
    const newStudent = new Student({
      stdName: formData.stdName,
      stdId: formData.regNo,
      email: formData.email,
      phNo: formData.phNo,
      courseName: formData.courseName,
      courseId: formData.courseId,
      sem: formData.sem,
      year: formData.year,
      responses: formData.responses,
    });
    const duplicateEntry = await Student.countDocuments({ stdId: formData.regNo, courseName: formData.courseName });
    if (duplicateEntry !== 0) {
      res.json("Duplicate Entry");
      console.log(duplicateEntry);
    }
    else {
      console.log(duplicateEntry);
      await newStudent.save();

      console.log('Document successfully inserted');
      res.json({ message: 'Form Successfully Submitted!' });
    }
  } catch (e) {
    console.log('Error Occurred:', e.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//admin page course list
app.get('/api/admin/courses', async(req,res) => {
    try{
      const data = await coursesModel.find({},{coursename:1,coursecode:1});
      console.log(data);
      res.send(data);
}catch(err){
  console.log(err);
}
})

//admin data
app.post('/api/admin/markdata', async (req, res) => {
  try {
    const { coursecode, category } = req.body;
    let qid = 0;
    switch(category){
      case 'CO1': qid = 1;break;
      case 'CO2': qid = 2;break;
      case 'CO3': qid = 3;break;
      case 'CO4': qid = 4;break;
      case 'CO5': qid = 5;break;
      case 'CO6': qid = 6;break;
    }
    const responses = await Student.aggregate([
      {
        $match: { courseId: coursecode }
      },
      {
        $unwind: "$responses"
      },
      {
        $match: { "responses.qid": qid }
      },
      {
        $group: {
          _id: {
            courseId: "$courseId",
            qid: "$responses.qid"
          },
          totalScore: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ["$responses.response", "Strongly agree"] }, then: 5 },
                  { case: { $eq: ["$responses.response", "Agree"] }, then: 4 },
                  { case: { $eq: ["$responses.response", "Neutral"] }, then: 3 },
                  { case: { $eq: ["$responses.response", "Disagree"] }, then: 2 },
                ],
                default: 1 
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id.courseId",
          qid: "$_id.qid",
          totalScore: 1
        }
      }
    ]);
    console.log(responses);
    res.send(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//for proof
app.post('/api/admin/responsedata', async(req,res) => {
  const { studentId, courseCode } = req.body;
  console.log(studentId, courseCode);
    try{
      const data = await Student.find({stdId: studentId, courseId: courseCode});
      console.log(data);
      res.send(data[0]);
}catch(err){console.log(err);}
})
//for counting no of submissions for each course
app.get('/api/students/:sub', async (req, res) => {
  const subject = req.params.sub;
  console.log(subject);
  try {
    const stdCount = await Student.countDocuments({ courseId: subject });
    console.log(stdCount);
    res.json(stdCount);
  } catch (err) {
    console.log(err);
  }
})

//for counting no of courses each student submitted
app.get('/api/student/admin/:std', async(req,res) => {
  const student = req.params.std;
  console.log(student);
  try{
    const resCount = await Student.countDocuments({stdId: student});
    console.log(resCount);
    res.json(resCount);
  }catch(err){
    console.log(err);
  }
})
//for getting student list
app.get('/api/studentList', async(req,res) => {
  const stdList = await StudentIDModel.find();
  console.log(stdList);
  res.json(stdList);
})

app.listen(port, () => {
  console.log(`Express Listening on ${port}`);
});
