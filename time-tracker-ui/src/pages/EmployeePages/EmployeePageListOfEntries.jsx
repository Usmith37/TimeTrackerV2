import React, { useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CustomTable from '../../components/CustomTable';
import { fetchLogEntriesByEmployee } from '../../api/logEntriesApi';
import { exportTableToCSV } from '../../utils/ExportUtils';

const EmployeePageListOfEntries = () => {
    const username = 'пользователя';
    const tableRef = useRef(null); // Создаем ref для таблицы

    const columns = [
        { key: 'id', label: 'Номер смены', width: '5%' },
        { key: 'employeeId', label: 'Таб. № сотрудн.', width: '5%' },
        { key: 'startTime', label: 'Начало смены', width: '30%' },
        { key: 'endTime', label: 'Окончание смены', width: '30%' },
        { key: 'jobTime', label: 'Часов отработано', width: '10%' },
        { key: 'message', label: 'Сообщение', width: '20%' },
    ];

    const handleExport = () => {
        if (!tableRef.current) return;
        exportTableToCSV(`Смены ${username}.csv`, tableRef.current);
    };

    return (
        <>
            <Navbar />
            <div className="content">
                <h2 className="table-title">Таблица смен из базы данных</h2>
                <CustomTable
                    ref={tableRef}
                    columns={columns}
                    loadData={async () => {
                        const response = await fetchLogEntriesByEmployee();
                        return response.logEntryList.map(item => ({
                            ...item,
                            jobTime: `${item.jobTime} ч.`
                        }));
                    }}
                />
                <div className="table-controls">
                    <button
                        className="export-button"
                        onClick={handleExport}
                    >
                        Выгрузить
                    </button>
                </div>
            </div>
        </>
    );
};

export default EmployeePageListOfEntries;