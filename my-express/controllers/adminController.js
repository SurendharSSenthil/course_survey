const coursesModel = require('../models/courseListModel');
const nameListSchema = require('../models/nameListModel');
const Student = require('../models/studentModel');
const studentDataSchema = require('../models/studentdataModel');

exports.getCourseList = async (req, res) => {
  try {
    const data = await coursesModel.find({}, { coursename: 1, coursecode: 1 });
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMarkData = async (req, res) => {
  try {
    const { coursecode, category } = req.body;
    let qid = 0;
    switch (category) {
      case 'CO1': qid = 1; break;
      case 'CO2': qid = 2; break;
      case 'CO3': qid = 3; break;
      case 'CO4': qid = 4; break;
      case 'CO5': qid = 5; break;
      case 'CO6': qid = 6; break;
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
};

exports.getResponseData = async (req, res) => {
  const { studentId, courseCode } = req.body;
  console.log(studentId, courseCode);
  try {
    const data = await Student.find({ stdId: studentId, courseId: courseCode });
    console.log(data);
    res.send(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.countStudentSubmissions = async (req, res) => {
  const student = req.params.sub;
  console.log(student);
  try {
    const resCount = await Student.countDocuments({ courseId: student });
    console.log(resCount);
    res.json(resCount);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudentList = async (req, res) => {
    console.log(req.params.sem)
  const stdList = await studentDataSchema.find({sem: req.params.sem});
  console.log(stdList);
  res.json(stdList);
};

