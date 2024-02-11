import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Card } from 'react-bootstrap';
import {url} from './url';

const DropdownPart = ({faculty, courseName, setCourseName, courses,setCourseId, questions, setQuestion, setTable }) => {
  async function handleOptionChange(e){
   const coursename = e.target.value;
   await setCourseName(coursename);
   setCourseId(courses[coursename]);
   console.log(coursename);
   console.log(courses[coursename]);
   const data = await fetch(`${url}/courses/${courses[coursename]}`);
   const jsondata = await data.json();
   setQuestion(jsondata.questions);
   console.log(jsondata.questions);
   setTable(true);
  };

  return (
    <Card className="m-4 p-4 shadow">
      <Form>
        <Row className="mb-3">
          <Form.Label column sm="2" className="fw-bold">
            Select a Course:
          </Form.Label>
          <Col sm="10">
            <Form.Select
              className="form-select select-dropdown"
              value={courseName}
              onChange={handleOptionChange}
              required
            >
              <option value="Probability,Statistics and Queuing Theory">Probability, Statistics and Random Processes</option>
              <option value="Digital Systems">Digital Systems</option>
              <option value="Discrete Structures">Discrete Structures</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Foundations of Data Science">Foundations of Data Science</option>
              <option value="Object Oriented Programming">Object Oriented Programming</option>
              <option value="Engineering Exploration">Engineering Exploration</option>
              <option value="Digital Systems Laboratory">Digital Systems Laboratory</option>
              <option value="Data Structures Laboratory">Data Structures Laboratory</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {courseName && (
        <div className="selected-info mt-4">
          <h5 className="mb-3">Selected Course Information:</h5>
          <p className="course-info"><strong>Course Name:</strong> {courseName}</p>
          <p className="course-info"><strong>Course Code:</strong> {courses[courseName]}</p>
          <p className="course-info"><strong>Faculty:</strong> {faculty[courseName]}</p>
        </div>
      )}
    </Card>
  );
};

export default DropdownPart;