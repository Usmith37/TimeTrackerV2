import axios from 'axios';
import { getValidToken } from '../utils/authUtils'; // Функция для получения актуального токена
import {handleApiError, withErrorHandling} from '../utils/apiErrorHandler'; // обработка ошибок

const API_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;
const EMPLOYEE_PATH = process.env.REACT_APP_EMPLOYEE_PATH;

// мощная проверка при импорте модуля
if (!API_URL || !EMPLOYEE_PATH) {
    const missingVars = [];
    if (!API_URL) missingVars.push('REACT_APP_API_GATEWAY_BASE_URL');
    if (!EMPLOYEE_PATH) missingVars.push('REACT_APP_EMPLOYEE_PATH');

    throw new Error(
        `Критические переменные окружения не заданы: ${missingVars.join(', ')}.\n` +
        'Пожалуйста, проверьте файл .env или настройки deployment.'
    );
}

// вариант с общей функцией для всех методов
const authorizedRequest = async (method, url, data = null) => {
    try {
        const token = await getValidToken();
        const config = {
            method,
            url: `${API_URL}${EMPLOYEE_PATH}${url}`.replace(/([^:]\/)\/+/g, '$1'),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        if (data) config.data = data;

        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const fetchEmployees = () =>
    authorizedRequest('get', '/api/employees');

export const registerEmployee = (employee) =>
    authorizedRequest('post', '/api/employees', employee);

export const updateEmployee = (id, updatedData) =>
    authorizedRequest('patch', `/api/employees/${id}`, updatedData);

export const deleteEmployee = (id) =>
    authorizedRequest('delete', `/api/employees/${id}`);

// вариант с вызовом через обертку с обработчиком ошибок
// export const fetchEmployees = async () => {
//     const token = await getValidToken();
//
//     return withErrorHandling(
//         axios.get(`${API_URL}${EMPLOYEE_PATH}/api/employees`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         })
//     );
// };
//
// export const registerEmployee = async (employee) => {
//     const token = await getValidToken();
//
//     return withErrorHandling(
//
//         axios.post(
//             `${API_URL}${EMPLOYEE_PATH}/api/employees`,
//             employee,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         )
//     );
// };
//
// export const updateEmployee = async (id, updatedData) => {
//     const token = await getValidToken();
//
//     return withErrorHandling(
//
//         axios.patch(
//             `${API_URL}${EMPLOYEE_PATH}/api/employees/${id}`,
//             updatedData,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         )
//     );
// };
//
// export const deleteEmployee = async (id) => {
//     const token = await getValidToken();
//     return withErrorHandling(
//         axios.delete(
//             `${API_URL}${EMPLOYEE_PATH}/api/employees/${id}`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         )
//     );
// };


// вариант с отдельным обработчиком ошибок
// export const fetchEmployees = async () => {
//     try {
//         const token = await getValidToken();
//         const response = await axios.get(`${API_URL}${EMPLOYEE_PATH}/api/employees`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw handleApiError(error);
//     }
// };

// export const registerEmployee = async (employee) => {
//     try {
//         const token = await getValidToken();
//         const response = await axios.post(
//             `${API_URL}${EMPLOYEE_PATH}/api/employees`,
//             employee,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         throw handleApiError(error);
//     }
// };

// export const updateEmployee = async (id, updatedData) => {
//     try {
//         const token = await getValidToken();
//         const response = await axios.patch(
//             `${API_URL}${EMPLOYEE_PATH}/api/employees/${id}`,
//             updatedData,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         console.log('отправляем данные на сервер:', updatedData);
//         return response.data;
//     } catch (error) {
//         throw handleApiError(error);
//     }
// };

// export const deleteEmployee = async (id) => {
//     try {
//         const token = await getValidToken();
//         const response = await axios.delete(
//             `${API_URL}${EMPLOYEE_PATH}/api/employees/${id}`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         console.log('удаляем сотрудника: ', id);
//         return response.data;
//     } catch (error) {
//         throw handleApiError(error);
//     }
// };



// вариант с обработчиком ошибок внутри запроса
// export const updateEmployee = async (id, updatedData) => {
//     try {
//         const response = await fetch(`/api/employees/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(updatedData),
//         });
//
//         if (!response.ok) {
//             throw new Error('Ошибка при обновлении сотрудника');
//         }
//
//         return await response.json();
//     } catch (error) {
//         console.error('Error updating employee:', error);
//         throw error;
//     }
// };