import { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheckCircle, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [updated,setUpdated] = useState(false);
  const [responses, setResponses] = useState({});
  const questions = [
    {
      qid : '1', question: "Teacher comes to the class in time ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '2', question: "Teaching is well planned ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '3', question: "Aim/Objectives made clear ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '4', question: "Subject matter organised in logical sequence", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '5', question: "Teacher comes well prepared in the subject  ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '6', question: "Teacher speaks clearly and audibly ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '7', question: "Teacher writes and draws legibly ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '8', question: "Teacher provides examples of concepts/principles.Explanations are clear and effective", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '9', question: "Teacher's pace and level of instruction are suited to the attainment of students", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '10', question: "Teacher offers assistance and counselling to the eed students", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '11', question: "Teacher asks questions to promote interaction and reflective thinking", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '12', question: "Teacher encourages questioning/raising doubts by students and answers them well", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '13', question: "Teaches and shares learner activity and problem solving everything in the class ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '14', question: "Teacher encourages, compliments and praises originally and creativity displayed by the student ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '15', question: "Teacher is courteous and impartial in dealing with the students", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '16', question: "Teacher engages classes regularly and maintains discipline ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '17', question: "Teacher covers the syllabus completely and at appropriate pace ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '18', question: "Teacher holds test regularly which are helpful to students in building up confidence in the acquisition and application of knowledge", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '19', question: "Teacher's marking of scripts is fair and impartial ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    },
    {
      qid : '20', question: "Teacher is prompt in valuing and returning the answer scripts providing feedback on performance ", qoption: ['Excellent','Very Good','Good','Fair','Satisfactory','Poor']
    }
  ]

  const handleOptionChange = (qid, selectedOption) => {
    setResponses({ ...responses,[qid]: selectedOption});
  };

  const handleInputChange = (e) => {
    setResponses({...responses,[e.target.name] : e.target.value})
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3001/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: responses }),
    })
      .then(response => response.json())
      .then(data => {console.log('Response from server:', data);
                      setUpdated(true);})
      .catch(error => console.error('Error sending POST request:', error));
    console.log('User responses:', responses);
  };
  return(
    <div>
      {updated ? (<><div className='submitted'><FontAwesomeIcon icon={faCheckCircle} className='fontIconSubmit'/>Form Successfully Submitted</div>
      </>):
      ( <div>
        <h1>Evaluation Form</h1>
        <form onSubmit={handleSubmit} className='formcard'>
          <div className='info'>
          <label htmlFor='name'><FontAwesomeIcon icon={faUser} className='fontIcon'/><input type='text' name='name' placeholder='Example' onChange={(e) => handleInputChange(e)} required/></label>
          
          <label htmlFor='email'><FontAwesomeIcon icon={faEnvelope} className='fontIcon'/><input type='email' name='email' placeholder='Example@gmail.com' onChange={(e) => handleInputChange(e)} required/></label>
          
          <label htmlFor='phno'><FontAwesomeIcon icon={faPhone} className='fontIcon'/><input type='tel' name='ph-no' placeholder='Mobile Number' onChange={(e) => handleInputChange(e)} required/></label>
          
          </div>
          <table className='table table-bordered table-striped'>
            <thead>
            <th>Evaluation Question</th>
            <th>Excellent</th>
            <th>Very Good</th>
            <th>Good</th>
            <th>Fair</th>
            <th>Satisfactory</th>
            <th>Poor</th>
            </thead>
            <tbody>
                {questions.map(question => (
                  <tr key={question.qid} className={question.qid % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{question.question}</td>
                    {question.qoption.map(option => (
                      <td key={option}>
                        <input
                          type="radio"
                          name={question.qid}
                          value={option}
                          checked={responses[question.qid] === option}
                          onChange={() => handleOptionChange(question.qid, option)}
                          required
                        />
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>

          </table>
      <button type="submit">Submit</button>
    </form>
    </div>
      )
      }
      
    </div>
  )
}

export default App;
