/**
 * Универсальный обработчик ошибок API-запросов
 * @param {Error} error - Объект ошибки Axios
 * @throws {Error} Кастомная ошибка с понятным сообщением
 */
export const handleApiError = (error) => {
    // Ошибка с ответом от сервера (4xx, 5xx)
    if (error.response) {
        const { status, data } = error.response;
        console.error('Ошибка сервера:', {
            status,
            data,
            url: error.config?.url
        });

        // const errorMessage = data?.message || `HTTP ошибка ${status}`;
        // throw new Error(errorMessage);

        // Специфичные обработки для разных статусов
        switch (status) {
            case 401:
                return new Error('Неавторизованный доступ. Пожалуйста, войдите снова');
            case 403:
                return new Error('Доступ запрещен');
            case 404:
                return new Error('Ресурс не найден');
            case 500:
                return new Error('Внутренняя ошибка сервера');
            default:
                const errorMessage = data?.message || `HTTP ошибка ${status}`;
                return new Error(errorMessage);
        }
    }

    // Запрос был сделан, но ответ не получен
    if (error.request) {
        console.error('Нет ответа от сервера:', {
            request: error.request,
            url: error.config?.url
        });
        return new Error('Сервер не отвечает. Проверьте подключение к сети');
    }

    // Ошибка при настройке запроса
    console.error('Ошибка при настройке запроса:', error.message);
    return new Error('Не удалось отправить запрос');
};

/**
 * Обертка для API-запросов с автоматической обработкой ошибок
 * @param {Promise} requestPromise - Promise с API-запросом
 * @returns {Promise} - Результат запроса или обработанная ошибка
 */
export const withErrorHandling = async (requestPromise) => {
    try {
        const response = await requestPromise;
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};