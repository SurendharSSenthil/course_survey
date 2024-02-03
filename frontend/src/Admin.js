import React, { useEffect, useState } from "react";
import { Table, Spin } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import { url } from './url';

const Admin = () => {
    const subjects = ["Probability,Statistics and Queuing Theory", "Digital Systems", "Discrete Structures", "Data Structures", "Foundations of Data Science", "Object Oriented Programming", "Engineering Exploration", "Digital Systems Laboratory", "Data Structures Laboratory"];
    const categories = ["Planning and organization", "Presentation and Communication", "Student participation", "Class Management"];

    const [loading, setLoading] = useState(true);
    const [marks, setMarks] = useState({});
    const [no, setNo] = useState({});

    const fetchCourseMark = async (sub, category) => {
        try {
            const response = await fetch(`${url}/dashboard`, {
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
            const response = await fetch(`${url}/students/${sub}`);
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
            setLoading(false);
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
        for (const category of categories) {
            const key = `${sub}-${category}`;
            tot += marks[key];
        }
        return tot;
    };

    const average = (sub) => {
        if (no[sub] === 0 || isNaN(no[sub])) return 0;
        return Math.round(totRes(sub) / no[sub]);
    };

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'course',
            key: 'course',
        },
        ...categories.flatMap(category => ([
            {
                title: `${category}`,
                dataIndex: `${category}Total`,
                key: `${category}Total`,
            },
        ])),
        {
            title: 'Total Students',
            dataIndex: 'totalStudents',
            key: 'totalStudents',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Average',
            dataIndex: 'overallAvg',
            key: 'overallAvg',
        },
    ];

    const data = subjects.map((subject) => {
        const row = {
            key: subject,
            course: subject,
            totalStudents: no[subject],
            total: totRes(subject),
            overallAvg: average(subject),
        };

        categories.forEach((category) => {
            const key = `${subject}-${category}`;
            row[`${category}Total`] = marks[key];
        });

        return row;
    });
    return (
        <>
            <h3>Course Feedback Summary</h3>
            { loading ? (<div id="spin"><Spin size="large" /></div>) :
            (<Table dataSource={data} columns={columns} />)}
        </>
    );
};

export default Admin;
