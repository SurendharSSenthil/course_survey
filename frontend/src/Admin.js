import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
    const subjects = ["Probability,Statistics and Queuing Theory", "Digital Systems", "Discrete Structures","Data Structures","Foundations of Data Science","Object Oriented Programming","Engineering Exploration","Digital Systems Laboratory","Data Structures Laboratory"];
    const categories = ["Planning and organization", "Presentation and Communication", "Student participation", "Class Management"];

    const [marks, setMarks] = useState({});
    const [no, setNo] = useState({});

    const fetchCourseMark = async (sub, category) => {
        try {
            const response = await fetch(`http://localhost:3001/dashboard`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ sub, category }),
            });
            const data = await response.json();
    
            if (data && data.length > 0) {
                return data[0].totalScore;
            } else {
                return 0;
            }
        } catch (err) {
            console.error(err);
            return 0;
        }
    };    

    const fetchStdCount = async (sub) => {
        try {
            const response = await fetch(`http://localhost:3001/student/${sub}`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (err) {
            console.error(err);
            return 0;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const marksData = {};
            for (const subject of subjects) {
                for (const category of categories) {
                    const key = `${subject}-${category}`;
                    marksData[key] = await fetchCourseMark(subject, category);
                }
            }
            console.log(marksData);
            setMarks(marksData);
        };

        const fetchStdCountData = async () => {
            const stdCount = {};
            for (const subject of subjects) {
                stdCount[subject] = await fetchStdCount(subject);
                console.log(stdCount[subject]);
            }
            console.log(stdCount);
            setNo(stdCount);
        };

        fetchData();
        fetchStdCountData();
    }, []);

    const totRes = (sub) => {
        let tot = 0;
        for(const category of categories){
            const key = `${sub}-${category}`;
            tot+=marks[key];
        }
        return tot;
    };

    const average = (sub) => {
        if(no[sub]===0) return 0;
        return Math.round(totRes(sub)/no[sub]);
    };

    return (
        <table className='table table-bordered table-striped'>
            <thead>
                <tr>
                    <th>Course Name</th>
                    {categories.map((category, index) => (
                        <th key={index}>{category}</th>
                    ))}
                    <th>No of Students</th>
                    <th>Total</th>
                    <th>Average</th>
                </tr>
            </thead>
            <tbody>
                {subjects.map((subject, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{subject}</td>
                        {categories.map((category, colIndex) => (
                            <td key={colIndex}>{marks[`${subject}-${category}`]}</td>
                        ))}
                        <td>{no[subject]}</td>
                        <td>{totRes(subject)}</td>
                        <td>{average(subject)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Admin;
