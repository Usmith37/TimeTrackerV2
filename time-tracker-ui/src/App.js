import React from 'react';
import './style.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import HomePage from './pages/HomePage';
import { ProtectedLayout } from './components/layouts/ProtectedLayout';

import { AdminLayout } from './components/layouts/AdminLayout';
import { EmployeeLayout } from './components/layouts/EmployeeLayout';

import AdminPageStart from './pages/AdminPages/AdminPageStart';
import AdminPageListOfEmployees from './pages/AdminPages/AdminPageListOfEmployees';
import AdminPageListOfEntries from './pages/AdminPages/AdminPageListOfEntries';
import AdminPageAddEmployee from './pages/AdminPages/AdminPageAddEmployee';

import EmployeePageStart from './pages/EmployeePages/EmployeePageStart';
import EmployeePageListOfEntries from './pages/EmployeePages/EmployeePageListOfEntries';
import EmployeePageStartTime from './pages/EmployeePages/EmployeePageStartTime';
import EmployeePageEndTime from './pages/EmployeePages/EmployeePageEndTime';

import AccessDeniedPage from './pages/AccessDeniedPage';
import PageNotFound from './pages/PageNotFound';
import Navbar from "./components/Navbar/Navbar";

function App() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (initialized && keycloak.authenticated) {
            if (keycloak.hasRealmRole('ADMIN') && location.pathname === '/') {
                navigate('/admin');
            } else if (keycloak.hasRealmRole('USER') && location.pathname === '/') {
                navigate('/employee');
            } else if (
                !keycloak.hasRealmRole('ADMIN') &&
                !keycloak.hasRealmRole('USER') &&
                location.pathname !== '/access-denied'
            ) {
                navigate('/access-denied');
            }
        }
    }, [initialized, keycloak, keycloak.authenticated, location.pathname, navigate]);

    return (
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route element={<ProtectedLayout roles={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminPageStart />} />
                        <Route path="employees" element={<AdminPageListOfEmployees />} />
                        <Route path="logentry" element={<AdminPageListOfEntries />} />
                        <Route path="addemployee" element={<AdminPageAddEmployee />} />
                    </Route>
                </Route>

                <Route element={<ProtectedLayout roles={['USER']} />}>
                    <Route path="/employee" element={<EmployeeLayout />}>
                        <Route index element={<EmployeePageStart />} />
                        <Route path="logentry" element={<EmployeePageListOfEntries />} />
                        <Route path="startTime" element={<EmployeePageStartTime />} />
                        <Route path="endTime" element={<EmployeePageEndTime />} />
                    </Route>
                </Route>

                <Route path="/access-denied" element={<AccessDeniedPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
    );
}

export default App;
