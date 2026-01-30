import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import buttonStyles from '../components/StartEndButton/ButtonStyles.module.css';

const HomePage = () => {
    const { keycloak } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkKeycloakAvailability = async () => {
        const url = `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/.well-known/openid-configuration`;
        try {
            const response = await fetch(url, { method: 'GET', mode: 'cors' });
            if (!response.ok) {
                throw new Error('Keycloak недоступен');
            }
            return true;
        } catch (err) {
            return false;
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        const available = await checkKeycloakAvailability();
        if (!available) {
            setError('Невозможно подключиться к серверу аутентификации');
            setLoading(false);
            return;
        }

        // Если сервер доступен — вызываем login
        try {
            await keycloak.login();
        } catch (err) {
            setError('Ошибка при попытке входа');
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Добро пожаловать в систему учета рабочего времени!</h1>
            {loading ? (
                <p>Вход...</p>
            ) : (
                <button className={buttonStyles.logButton} onClick={handleLogin}>
                    Войти
                </button>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default HomePage;
