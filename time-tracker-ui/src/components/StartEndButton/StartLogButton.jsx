import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import { startLogEntry } from '../../api/logEntriesApi';
import { useApiRequest } from '../../hooks/useApiRequest';
import buttonStyles from './ButtonStyles.module.css';

const StartLogButton = ({ onLogStarted }) => {
    const { isLoading, error, success, executeRequest } = useApiRequest();
    const [logEntryId, setLogEntryId] = useState(null);

    const handleStartLog = async () => {
        try {
            const result = await executeRequest(startLogEntry);
            const newLogEntryId = result.logEntryId;

            setLogEntryId(newLogEntryId);
            if (onLogStarted) onLogStarted(newLogEntryId);
        } catch (error) {
            // Ошибка уже обработана в useApiRequest
        }
    };

    return (
        <div className="start-log-container">
            <button
                className={`${buttonStyles.logButton} ${isLoading ? buttonStyles.loading : ''}`}
                onClick={handleStartLog}
                disabled={isLoading}
            >
                {isLoading ? 'Запуск смены...' : 'Начать смену'}
            </button>

            {success && (
                <div className="success-message">
                    ✅ Смена успешно начата! ID: <strong>{logEntryId}</strong>
                </div>
            )}

            {error && (
                <div className="error-message">
                    ❌ {error}
                    {error.includes('незавершенная смена') && (
                        <div className="error-hint">
                            Пожалуйста, завершите текущую смену перед началом новой
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

StartLogButton.propTypes = {
    onLogStarted: PropTypes.func
};

export default StartLogButton;