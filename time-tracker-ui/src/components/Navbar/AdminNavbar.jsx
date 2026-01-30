import React from 'react';
import NavButton from './NavButton';

const AdminNavbar = () => {
    return (
        <div>
            <NavButton path="/admin/employees" label="Журнал сотрудников" />
            <NavButton path="/admin/logentry" label="Журнал смен" />
            {/*<NavButton path="/admin/employeesentry" label="Журнал смен сотрудников" />*/}
            <NavButton path="/admin/addemployee" label="Добавить сотрудника" />
        </div>
    );
};

export default AdminNavbar;