import React from "react";
import './Auth.css';

const Auth = ({regNo, setRegNo, dob, setDob, isAuth, setIsAuth, stdName, setStdName}) => { 

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/studentID', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({regNo, dob}),
    })
    .then((res) => res.json())
    .then((res) => {
      if(res !== "Wrong password") {
        setIsAuth(true);
        // setWrong(false);
        setStdName(res[0].StdName);
        console.log(stdName);
        localStorage.setItem('isAuth', true);
        localStorage.setItem('studentId', regNo);
      } else {
        setRegNo("");
        setDob("");
        // setWrong(true);
        setIsAuth(false);
      }
    })
    .catch((err) => console.log(err))
  } 

  return (
    <div className="main__login__container">
      <div className="login__container">
      <h2 className="login__header">Login</h2>
      <form onSubmit={handleSubmit} className="login__form">
        <label>Register Number : </label>
        <input
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            type="text"
            required
            className="login__input"
        />
        <label>Date Of Birth : </label>
        <input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            type="text"
            placeholder="DD-MM-YYYY"
            required
            className="login__input"
        />
        <div className="error-message"></div>
        <button type="submit" className="login__button">Login</button>
      </form>
      </div>
    </div>
  );
};

export default Auth;
