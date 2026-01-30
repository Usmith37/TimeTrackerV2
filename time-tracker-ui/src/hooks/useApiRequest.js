import { useState } from 'react';

export const useApiRequest = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const executeRequest = async (apiCall) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await apiCall();
            setSuccess(result); // Можно адаптировать под нужный формат
            return result;
        } catch (error) {
            setError(error.message);
            throw error; // Пробрасываем ошибку, если нужно обработать её дополнительно
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, success, executeRequest, setError };
};