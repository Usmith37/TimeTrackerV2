import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import buttonStyles from '../components/StartEndButton/ButtonStyles.module.css';
import keycloak from "../keycloak";

const AccessDeniedPage = () => {
    const { keycloak } = useKeycloak();

    const handleLogout = () => {
        keycloak.logout({
            redirectUri: window.location.origin
        });
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Доступ запрещен</h1>
            <button
                className={buttonStyles.logButton}
                onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default AccessDeniedPage;