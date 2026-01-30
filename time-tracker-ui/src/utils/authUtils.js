import keycloak from '../keycloak';

/**
 * Получает и возвращает валидный токен Keycloak.
 * Обновляет токен, если он протух.
 * @returns {Promise<string>} Токен без префикса "Bearer "
 * @throws {Error} Если токен не получен или не обновлён
 */
export const getValidToken = async () => {
    try {
        // Обновляем токен, если он протух
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
            console.log("Токен обновлён:", keycloak.token);
        }

        if (!keycloak.token) {
            throw new Error("Токен не получен");
        }

        return keycloak.token;
    } catch (err) {
        console.error("Ошибка обновления токена:", err);
        throw new Error("Не удалось получить валидный токен");
    }
};

/**
 * Получает ID пользователя из токена
 * @returns {Promise<string|null>} ID пользователя или null при ошибке
 */
export const getUserIdFromKeycloak = async () => {
    try {
        await keycloak.updateToken(30);

        if (!keycloak.tokenParsed) {
            console.error('Токен не распознан');
            return null;
        }

        if (!keycloak.tokenParsed.sub) {
            console.error('ID пользователя не найден в токене');
            return null;
        }

        return keycloak.tokenParsed.sub;
    } catch (error) {
        console.error('Ошибка получения ID пользователя:', error);
        return null;
    }
};
