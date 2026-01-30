import React, {useRef} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import EmployeeRegistrationForm from "../../components/AddEmployeeForm";

const AdminPageStart = () => {

    return (
        <>
            <Navbar/>
            <div className="App">
                <EmployeeRegistrationForm/>
            </div>
        </>
    );
};

export default AdminPageStart;
