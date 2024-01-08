import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Student({ stdName, setStdName, stdId, setStdId }) {
  const handleNameChange = (e) => {
    setStdName(e.target.value);
    console.log(stdName);
  }

  const handleIdChange = (e) => {
    setStdId(e.target.value);
    localStorage.setItem("studentId",stdId);
    console.log(stdId);
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="stdName">Student:</label>
            <input
              type="text"
              className="form-control"
              id="stdName"
              name="stdName"
              value={stdName}
              onChange={(e) => handleNameChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="stdId">Register Number:</label>
            <input
              type="text"
              className="form-control"
              id="stdId"
              name="stdId"
              value={stdId}
              onChange={(e) => handleIdChange(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
