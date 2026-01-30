import { fetchEmployees } from '../api/employeesApi.js';

export const getEmployeeFullNamesMap = async () => {
    try {
        const employees = await fetchEmployees();
        console.log("проверяем каких сотрудников получили", employees);
        const fullNameMap = new Map();

        employees.forEach((employee) => {
            const fullName = `${employee.surname} ${employee.name} ${employee.patronymic}`.trim();
            fullNameMap.set(employee.stuffId, fullName);
        });
        console.log('чего мы намапили:', fullNameMap);

        return fullNameMap;
    } catch (error) {
        console.error('Ошибка при загрузке сотрудников:', error);
        return new Map();
    }
};