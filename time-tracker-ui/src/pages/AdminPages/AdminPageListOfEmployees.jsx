import React, { useRef, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CustomTable from '../../components/CustomTable';
import EditEmployeeModal from '../../components/EditEmployeeModal';
import {fetchEmployees, updateEmployee, deleteEmployee} from '../../api/employeesApi';
import { exportTableToCSV } from '../../utils/ExportUtils';

const AdminPageListOfEmployees = () => {

    const tableRef = useRef(null); // Создаем ref для таблицы
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Функция для открытия модального окна
    const handleEditEmployee = (employee) => {
        console.log('Редактируемый сотрудник:', employee);
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    // Функция для сохранения изменений
    const handleSaveEmployee = async (id, updatedData) => {
        // Если надо ошибку выводить в alert
        // try {
        //     await updateEmployee(id, updatedData);
        //     setIsModalOpen(false);
        //     setSelectedEmployee(null);
        //
        //     // Обновляем таблицу после сохранения
        //     if (tableRef.current && tableRef.current.refresh) {
        //         tableRef.current.refresh();
        //     }
        //
        //     alert('Данные сотрудника успешно обновлены!');
        // } catch (error) {
        //     console.error('Ошибка при обновлении сотрудника:', error);
        //     alert('Произошла ошибка при обновлении данных');
        // }

        await updateEmployee(id, updatedData);

        // Обновляем таблицу после сохранения
        if (tableRef.current && tableRef.current.refresh) {
            tableRef.current.refresh();
        }
    };

    // Функция для удаления
    const handleDeleteEmployee = async (id, updatedData) => {
        await deleteEmployee(id);

        // Обновляем таблицу после сохранения
        if (tableRef.current && tableRef.current.refresh) {
            tableRef.current.refresh();
        }
    };

    // Функция для закрытия модального окна
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const columns = [
        // { key: 'id', label: 'ID', width: 50 },
        { key: 'surname', label: 'Фамилия', width: '25%' },
        { key: 'name', label: 'Имя', width: '20%' },
        { key: 'patronymic', label: 'Отчество', width: '25%' },
        { key: 'stuffId', label: 'Таб. № сотрудн.', width: '10%' },
        { key: 'employeePost', label: 'Должность', width: '10%' },
        {
            key: 'actions',
            label: 'Действия',
            width: '10%',
            render: (value, row) => (
                <button
                    onClick={() => handleEditEmployee(row)}
                    className="edit-button"
                >
                    Редактировать
                </button>
            )
        },
    ];

    const handleExport = () => {
        if (!tableRef.current) return;
        exportTableToCSV('Персонал.csv', tableRef.current);
    };

    return (
        <>
            <Navbar />
            <div className="content">
                <h2 className="table-title">Таблица сотрудников из базы данных</h2>
                <CustomTable
                    ref={tableRef}
                    columns={columns}
                    loadData={() => fetchEmployees()}
                />
                <div className="table-controls">
                    <button
                        className="export-button"
                        onClick={handleExport}
                    >
                        Выгрузить
                    </button>
                </div>
                <EditEmployeeModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    employee={selectedEmployee}
                    onSave={handleSaveEmployee}
                    onDelete={handleDeleteEmployee}
                />
            </div>
        </>
    );
};

export default AdminPageListOfEmployees;
