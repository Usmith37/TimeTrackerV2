import React from 'react';
import { Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

export const PrivateRoute = ({ children, roles }) => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Loading...</div>;
    }

    const isAuthed = keycloak.authenticated;
    const hasRole = roles.some(role => keycloak.hasRealmRole(role));

    if (!isAuthed) {
        return <Navigate to="/" />;
    }

    if (!hasRole) {
        return <Navigate to="/access-denied" />;
    }

    return children;
};