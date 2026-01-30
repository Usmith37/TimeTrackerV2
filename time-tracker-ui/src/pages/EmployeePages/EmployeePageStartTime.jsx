import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import StartLogButton from "../../components/StartEndButton/StartLogButton";


const EmployeePageStart = () => {

    return (
        <>
            <Navbar />
            <div className="content">
                <h2 className="title">Начните смену</h2>
                <StartLogButton />
            </div>
        </>
    );
};

export default EmployeePageStart;
