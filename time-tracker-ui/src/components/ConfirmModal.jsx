import React, {useEffect, useState} from 'react';
import Portal from './Portal';
import './ConfirmModal.css';

const ConfirmModal = ({
                          isOpen,
                          onClose,
                          onConfirm,
                          onSuccess,
                          title = "Подтверждение действия",
                          message = "Вы уверены, что хотите выполнить это действие?",
                          confirmText = "Да",
                          cancelText = "Отмена",
                          confirmType = "default", // (default | danger)
                          autoClose = true,
                          showSuccess = false,
                      }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Сбрасываем состояния при открытии/закрытии модалки
    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setError(null); // очищаем предыдущие ошибки
        // setSuccess(false);
        setIsLoading(true);

        try {
            await Promise.resolve(onConfirm?.());

            if (showSuccess) {
                setSuccess(true);

                // показываем сообщение об успехе 2 сек
                setTimeout(() => {
                    // сначала закрываем ConfirmModal
                    if (autoClose) onClose?.();
                    // потом уведомляем родителя (EditEmployeeModal)
                    onSuccess?.();
                }, 2000);
            } else {
                if (autoClose) onClose?.();
            }
        } catch (error) {
            console.error('Ошибка при подтверждении:', error);
            // Вытаскиваем осмысленное сообщение
            const apiMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Неизвестная ошибка при выполнении операции.';
            // показываем пользователю сообщение с ответом от бека
            setError(apiMessage);
            // показываем пользователю просто сообщение об ошибке
            // setError(error.message || 'Произошла ошибка');

        } finally {
            setIsLoading(false);
        }
    };

    // Кнопка "Понятно" — закрываем всё сразу, без таймера
    const handleImmediateClose = () => {
        onClose?.();
        onSuccess?.();
    };

    const handleClose = () => {
        setError(null); // очищаем ошибку при закрытии
        onClose?.();
    };

    const handleRetry = async () => {
        setError(null);
        await handleConfirm(); // повторяем запрос
    };

    return (
        <Portal>
            {/* другой вариант обработки пустых кликов*/}
            <div className="confirm-overlay" onClick={handleClose}>
                <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                    <div className="confirm-header">
                        <h4>{title}</h4>
                    </div>
                    <div className="confirm-body">
                        {/* Сообщение об успехе */}
                        {success && (
                            <div className="confirm-success">
                                ✅ Все прошло успешно!
                            </div>
                        )}
                        {/* Обычное сообщение */}
                        {!success && !error && <p>{message}</p>}
                        {/* Сообщение об ошибке */}
                        {error && (
                            <div className="confirm-error">
                                {/* Ошибка с простым сообщением */}
                                {/* ⚠️ Что-то пошло совсем не так: {error} */}

                                {/* Ошибка с реальным сообщением от API */}
                                ⚠️ {error}
                            </div>
                        )}
                    </div>
                    <div className="confirm-actions">
                        {/* Если произошла ошибка — показываем кнопку "Повторить" */}
                        {error && !success && (
                            <>
                                <button onClick={onClose} className="confirm-cancel">
                                    {cancelText}
                                </button>
                                <button onClick={handleRetry} className="confirm-ok">
                                    Повторить попытку
                                </button>
                            </>
                        )}
                        {/* Если нет ошибки — обычные кнопки подтверждения */}
                        {!error && !success && (
                            <>
                                <button onClick={handleClose} className="confirm-cancel" disabled={isLoading}>
                                    {cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`confirm-ok ${confirmType === 'danger' ? 'confirm-ok--danger' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Загрузка...' : confirmText}
                                </button>
                            </>
                        )}
                        {/* После успеха — кнопка "Понятно" */}
                        {success && (
                            <button
                                onClick={handleImmediateClose}
                                className="confirm-ok"
                            >
                                Понятно
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ConfirmModal;
