import React from 'react';
import NavButton from './NavButton';

const EmployeeNavbar = () => {
    return (
        <div>
            <NavButton path="/employee/logentry" label="Мои смены" />
            <NavButton path="/employee/startTime" label="Начать смену" />
            <NavButton path="/employee/endTime" label="Завершить смену" />
        </div>
    );
};

export default EmployeeNavbar;