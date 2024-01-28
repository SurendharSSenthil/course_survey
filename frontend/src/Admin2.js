import React, { useEffect, useState } from "react";
import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin2 = () => {
    const [std, setStd] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stdListResponse = await fetch('http://localhost:3001/studentList');
                const stdList = await stdListResponse.json();
                console.log(stdList);

                const studentsWithCourses = await Promise.all(
                    stdList.map(async (student) => {
                        const res = await fetch(`http://localhost:3001/student/admin/${student.StdName}`);
                        const courses = await res.json();
                        console.log(courses);

                        return {
                            RegNo: student.RegNo,
                            Name: student.StdName,
                            CoursesSubmitted: courses
                        };
                    })
                );

                setStd(studentsWithCourses);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <table className='table table-bordered table-striped'>
            <thead>
                <tr>
                    <th>Register No</th>
                    <th>Student Name</th>
                    <th>Number of Courses Submitted</th>
                </tr>
            </thead>
            <tbody>
                {std.map((student) => (
                    <tr key={student.RegNo}>
                        <td>{student.RegNo}</td>
                        <td>{student.Name}</td>
                        <td id="center">{student.CoursesSubmitted}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Admin2;
