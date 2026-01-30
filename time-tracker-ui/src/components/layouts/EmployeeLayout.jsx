// src/components/layouts/EmployeeLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export const EmployeeLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};
