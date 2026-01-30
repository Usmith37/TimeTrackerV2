import React, {useState, useEffect, useCallback} from 'react';
import Portal from './Portal';
import ConfirmModal from './ConfirmModal';
import './EditEmployeeModal.css';
import {useBodyScrollLock} from "../hooks/useBodyScrollLock";

const EditEmployeeModal = ({
                               isOpen,
                               onClose,
                               employee,
                               onSave,
                               onDelete
                           }) => {
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        patronymic: '',
        stuffId: '',
        employeePost: ''
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Эффект для блокировки прокрутки body при открытом модальном окне
    // useEffect(() => {
    //     if (isOpen) {
    //         // Сохраняем текущее положение прокрутки
    //         const scrollY = window.scrollY;
    //         document.body.style.position = 'fixed';
    //         document.body.style.top = `-${scrollY}px`;
    //         document.body.style.width = '100%';
    //         document.body.style.overflow = 'hidden';
    //
    //         return () => {
    //             // Восстанавливаем прокрутку при закрытии
    //             const scrollY = parseInt(document.body.style.top || '0');
    //             document.body.style.position = '';
    //             document.body.style.top = '';
    //             document.body.style.width = '';
    //             document.body.style.overflow = '';
    //             window.scrollTo(0, Math.abs(scrollY));
    //         };
    //     }
    // }, [isOpen]);
    useBodyScrollLock(isOpen);

    // Заполняем форму данными сотрудника при открытии
    useEffect(() => {
        if (employee && isOpen) {
            setFormData({
                surname: employee.surname || '',
                name: employee.name || '',
                patronymic: employee.patronymic || '',
                stuffId: employee.stuffId || '',
                employeePost: employee.employeePost || ''
            });
        }
    }, [employee, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Специальная обработка для числового поля
        if (name === 'stuffId') {
            // Разрешаем только цифры
            if (/^\d+$/.test(value)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
            return;
        }
        // Для остальных полей обычная обработка
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // проверка внесения изменений:
    const hasChanges = () => {
        if (!employee) return false;

        const normalize = (value) => {
            if (value === null || value === undefined) return '';
            // Для числовых значений приводим к числу и обратно к строке
            if (!isNaN(value)) return Number(value).toString();
            return String(value);
        };

        return (
            normalize(formData.surname) !== normalize(employee.surname) ||
            normalize(formData.name) !== normalize(employee.name) ||
            normalize(formData.patronymic) !== normalize(employee.patronymic) ||
            normalize(formData.stuffId) !== normalize(employee.stuffId) ||
            normalize(formData.employeePost) !== normalize(employee.employeePost)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // // необязательная проверка, использовал ранее, сейчас блокируется кнопка отправки
        // if (!hasChanges()) {
        //     alert('Изменения не обнаружены');
        //     return;
        // }

        // Проверяем заполненность полей
        if (!formData.surname.trim() || !formData.name.trim() || !formData.patronymic.trim() || !formData.stuffId || !formData.employeePost.trim()) {
            alert('Заполните все поля!');
            return;
        }

        setShowConfirm(true);
    };

    // Функция для получения измененных полей
    const getChangedFields = useCallback(() => {
        if (!employee) return {};

        const changes = {};

        if (String(formData.surname).trim() !== String(employee.surname).trim()) {
            changes.surname = formData.surname;
        }
        if (String(formData.name).trim() !== String(employee.name).trim()) {
            changes.name = formData.name;
        }
        if (String(formData.patronymic).trim() !== String(employee.patronymic).trim()) {
            changes.patronymic = formData.patronymic;
        }
        if (String(formData.stuffId) !== String(employee.stuffId)) {
            changes.stuffId = Number(formData.stuffId);
        }
        if (String(formData.employeePost).trim() !== String(employee.employeePost).trim()) {
            changes.employeePost = formData.employeePost;
        }

        return changes;
    }, [formData, employee]);

    const handleConfirmSave = async () => {

        const changes = getChangedFields();

        // console.log('Отправляем только изменения:', changes);
        // onSave(employee.id, changes);
        // setShowConfirm(false);
        await onSave(employee.id, changes);
        // setShowConfirm(false);
        // onClose();
    };

    const handleSuccess = () => {
        onClose(); // Закрываем основное модальное окно только после успеха
    };

    const handleCancelConfirm = () => setShowConfirm(false);

    const handleDeleteClick = () => setShowDeleteConfirm(true);

    const handleConfirmDelete = async () => {
        // if (onDelete) onDelete(employee.id);
        // setShowDeleteConfirm(false);
        // onClose();
        await onDelete(employee.id);
    };

    const handleCancelDelete = () => setShowDeleteConfirm(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <Portal>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Редактирование сотрудника
                            <br/>
                            <span>
                            {employee ?
                                `${employee.surname} ${employee.name ? employee.name[0] + '.' : ''} 
                                ${employee.patronymic ? employee.patronymic[0] + '.' : ''}`
                                :''
                            }
                            </span>
                        </h3>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>

                    {employee ? (
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Фамилия:</label>
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Имя:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Отчество:</label>
                                <input
                                    type="text"
                                    name="patronymic"
                                    value={formData.patronymic}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Табельный номер:</label>
                                <input
                                    type="text"
                                    name="stuffId"
                                    value={formData.stuffId}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Должность:</label>
                                <input
                                    type="text"
                                    name="employeePost"
                                    value={formData.employeePost}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <div className="left-actions">
                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={handleDeleteClick}
                                        // стандартное окно подтверждения удаления:
                                        // onClick={() => {
                                        //     if (window.confirm('Вы уверены, что хотите удалить этого тупого сотрудника?')) {
                                        //         console.log('Удаляем сотрудника с ID:', employee.id);
                                        //     }
                                        // }}
                                    >
                                        Удалить сотрудника
                                    </button>
                                </div>

                                <div className="right-actions">
                                    <button type="button" onClick={onClose} className="cancel-button">
                                        Отмена
                                    </button>
                                    <button
                                        type="submit" // триггер для onSubmit формы!
                                        className={`save-button ${!hasChanges() ? 'save-button--disabled' : ''}`}
                                        disabled={!hasChanges()}
                                    >
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div>Загрузка данных...</div>
                    )}
                </div>
            </div>
        </Portal>

            {/*Окно подтверждения сохранения изменений*/}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={handleCancelConfirm}
                onConfirm={handleConfirmSave}
                onSuccess={handleSuccess}
                title="Подтверждение сохранения"
                message="Вы уверены, что хотите сохранить изменения данных сотрудника?"
                confirmText="Сохранить"
                cancelText="Отмена"
                showSuccess={true}
            />
            {/*Подтверждение удаления*/}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                onSuccess={handleSuccess}
                title="Удалить сотрудника"
                message="Вы уверены, что хотите удалить этого сотрудника? Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                confirmType="danger"
                showSuccess={true}
            />
        </>
    );
};

export default EditEmployeeModal;