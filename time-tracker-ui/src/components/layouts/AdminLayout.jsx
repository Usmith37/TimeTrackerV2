// src/components/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
    return (
        <div>
            {/*<hr />*/}
            <Outlet />
        </div>
    );
};
