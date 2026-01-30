import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { endLogEntry } from '../../api/logEntriesApi';
import { useApiRequest } from '../../hooks/useApiRequest';
import formStyles from './FormStyles.module.css';
import buttonStyles from './ButtonStyles.module.css';

const EndLogButton = ({ onLogEnded }) => {
    const { isLoading, error, success, executeRequest } = useApiRequest();
    const [reportMessage, setReportMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [validationError, setValidationError] = useState('');

    const handleEndLog = async () => {
        if (!reportMessage.trim()) {
            setValidationError('Пожалуйста, заполните отчет о смене');
            return;
        }

        try {
            const result = await executeRequest(() => endLogEntry(reportMessage));
            setReportMessage(''); // Очищаем поле после успеха
            setValidationError(''); // Очищаем ошибку при успехе
            if (onLogEnded) {
                onLogEnded(result);
            }
        } catch (error) {
            // Ошибка уже обработана в useApiRequest
        }
    };

    const handleMessageChange = (e) => {
        const value = e.target.value;
        if (value.length <= 255) {
            setReportMessage(value);
            setCharCount(value.length);

            // Сбрасываем ошибку валидации, если пользователь начал вводить текст
            if (validationError && value.trim()) {
                setValidationError('');
            }

        }
    };

    return (
        <div className={formStyles.endLogContainer}>
            <div className={formStyles.reportInputContainer}>
                <label
                    htmlFor="report-message"
                    className={formStyles.reportLabel}
                >
                    Отчет о смене:
                </label>
                <textarea
                    id="report-message"
                    className={formStyles.reportTextarea}
                    value={reportMessage}
                    onChange={handleMessageChange}
                    placeholder="Опишите результаты работы за смену (макс. 255 символов)"
                    rows={4}
                    maxLength={255}
                />
                    <div className={formStyles.charCounter}>
                        {charCount}/255
                    </div>
            </div>

            <button
                className={`${buttonStyles.logButton} ${isLoading ? buttonStyles.loading : ''}`}
                onClick={handleEndLog}
                disabled={isLoading || !reportMessage.trim()}
                // disabled={isLoading}
                // className={`end-log-button ${isLoading ? 'loading' : ''}`}
            >
                {isLoading ? 'Завершение смены...' : 'Завершить смену'}
            </button>

            {success && (
                <div className="success-message">
                    ✅ {success.message || 'Смена успешно завершена!'}
                </div>
            )}

            {/* Выводим ошибку валидации */}
            {validationError && (
                <div className="error-message">❌ {validationError}</div>
            )}

            {error && (
                <div className="error-message">
                    ❌ {error}
                    {error.includes('нет начатых смен') && (
                        <div className="error-hint">
                            Пожалуйста, начните смену перед попыткой завершения
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

EndLogButton.propTypes = {
    onLogEnded: PropTypes.func
};

export default EndLogButton;