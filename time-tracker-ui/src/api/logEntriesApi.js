import axios from 'axios';
import {getUserIdFromKeycloak, getValidToken} from '../utils/authUtils'; // Функция для получения актуального токена
import {handleApiError, withErrorHandling} from '../utils/apiErrorHandler'; // обработка ошибок

const API_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;
const LOG_ENTRY_PATH = process.env.REACT_APP_LOG_ENTRY_PATH;

export const fetchLogEntries = async () => {
    try {
        const token = await getValidToken();
        const response = await axios.get(`${API_URL}${LOG_ENTRY_PATH}/api/log_entries`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        // return response.data;
        const data = response.data;

        // Если данные приходят в виде массива
        if (Array.isArray(data)) {
            return data.map(item => ({
                ...item,
                startTime: new Date(item.startTime).toLocaleString(),
                endTime: new Date(item.endTime).toLocaleString(),
                date: new Date(item.date).toLocaleDateString()
            }));
        }
        // Если данные приходят как одиночный объект
        // return {
        //     ...data,
        //     startTime: new Date(data.startTime).toLocaleString(),
        //     endTime: new Date(data.endTime).toLocaleString(),
        //     date: new Date(data.date).toLocaleDateString()
        // };

    } catch (error) {
        handleApiError(error);
    }
};

export const fetchLogEntriesByEmployee = async () => {
    try {
    const token = await getValidToken();
    const userId = await getUserIdFromKeycloak();
        if (!userId) {
            throw new Error('Не удалось получить ID пользователя из токена');
        }
    const response = await axios.get(`${API_URL}${LOG_ENTRY_PATH}/api/log_entries/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status < 200 || response.status >= 300) {
        throw new Error('Ошибка при загрузке данных сотрудников');
    }

    const data = response.data;

    if (!data.logEntryList) {
        return data;
    }

    const processedData = {
        ...data,
        logEntryList: data.logEntryList.map(item => ({
            ...item,
            startTime: new Date(item.startTime).toLocaleString(),
            endTime: new Date(item.endTime).toLocaleString(),
            // date нет в исходных данных, не во всех DTO добавлял дату
            date: item.date ? new Date(item.date).toLocaleDateString() : undefined,
        })),
    };

    return processedData;
    } catch (error) {
        handleApiError(error);
    }
};

export const startLogEntry = async () => {
    try {
        const token = await getValidToken();
        const keycloakId = await getUserIdFromKeycloak();

        if (!keycloakId) {
            throw new Error('Не удалось получить ID пользователя из токена');
        }
        console.log("Смотрим ID который передаем", keycloakId);
        const response = await axios.post(
            `${API_URL}${LOG_ENTRY_PATH}/api/log_entries/start`,
            { keycloakId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 201) {
            return response.data; // { logEntryId, ... }
        }

        // Обработка специфичных ошибок (409 - конфликт)
        if (response.status === 409) {
            throw new Error(response.data.message || 'У вас уже есть незавершенная смена');
        }
        throw new Error(response.data.message || `Ошибка сервера: ${response.status}`);

    } catch (error) {
        handleApiError(error);
        throw error; // Пробрасываем ошибку для обработки в UI
    }
};

export const endLogEntry = async (message) => {
    try {
        const token = await getValidToken();
        const keycloakId = await getUserIdFromKeycloak();

        if (!keycloakId) {
            throw new Error('Не удалось получить ID пользователя из токена');
        }

        const response = await axios.put(
            `${API_URL}${LOG_ENTRY_PATH}/api/log_entries/end`,
            { keycloakId, message },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200 || response.status === 204) {
            return response.data; // { message, ... }
        }

        // Обработка ошибки 404 - нет активной смены
        if (response.status === 404) {
            throw new Error(response.data.message || 'У вас нет начатых смен');
        }
        throw new Error(response.data.message || `Ошибка сервера: ${response.status}`);

    } catch (error) {
        handleApiError(error);
        throw error; // Пробрасываем ошибку для обработки в UI
    }
};