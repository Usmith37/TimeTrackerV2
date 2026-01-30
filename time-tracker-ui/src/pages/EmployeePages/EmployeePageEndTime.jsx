import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import EndLogButton from "../../components/StartEndButton/EndLogButton";


const EmployeePageEnd = () => {

    return (
        <>
            <Navbar />
            <div className="content">
                <h2 className="title">Страница завершения смены</h2>
                <EndLogButton />
            </div>
        </>
    );
};

export default EmployeePageEnd;
