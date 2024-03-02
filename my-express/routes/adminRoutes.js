const express = require('express');
const router = express.Router();
const { getCourseList,
        getMarkData,
        getResponseData,
        countStudentSubmissions,
        getStudentList} = require('../controllers/adminController');

router.get('/courses', getCourseList);
router.post('/markdata', getMarkData);
router.post('/responsedata', getResponseData);
router.get('/studentList/:sem', getStudentList);
router.get('/:sub', countStudentSubmissions);

module.exports = router;
