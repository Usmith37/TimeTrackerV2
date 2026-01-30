import React from 'react';
import { useNavigate } from 'react-router-dom';
import buttonStyles from '../components/StartEndButton/ButtonStyles.module.css';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoToStart = () => {
        navigate('/'); // Перенаправление на корневой маршрут (первую страницу)
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Страница не найдена</h1>
            <button
                className={buttonStyles.logButton}
                onClick={handleGoToStart}>
                В начало
            </button>
        </div>
    );
};

export default PageNotFound;