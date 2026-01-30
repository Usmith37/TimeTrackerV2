// import React, { useState } from 'react';
// import axios from 'axios';
//
// const EmployeeRegistrationForm = () => {
//     const [employee, setEmployee] = useState({
//         surname: '',
//         name: '',
//         patronymic: '',
//         employeePost: '',
//         stuffId: '',
//         login: '',
//         password: ''
//     });
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState({ text: '', color: '' });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [passwordsMatch, setPasswordsMatch] = useState(false);
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEmployee(prev => ({ ...prev, [name]: value }));
//     };
//
//     const handleConfirmPasswordChange = (e) => {
//         const value = e.target.value;
//         setConfirmPassword(value);
//         // Проверяем совпадение паролей сразу при вводе
//         const match = employee.password === value;
//         setPasswordsMatch(match);
//         setMessage({
//             text: match ? 'Пароли совпадают' : 'Пароли не совпадают',
//             color: match ? 'green' : 'red'
//         });
//     };
//
//     const validateForm = () => {
//         // Проверка заполнения всех полей
//         for (const field in employee) {
//             if (!employee[field]) {
//                 setMessage({ text: 'Все поля должны быть заполнены', color: 'red' });
//                 return false;
//             }
//         }
//
//         if (!confirmPassword) {
//             setMessage({ text: 'Подтвердите пароль', color: 'red' });
//             return false;
//         }
//
//         if (!passwordsMatch) {
//             setMessage({ text: 'Пароли не совпадают', color: 'red' });
//             return false;
//         }
//         return true;
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         if (!validateForm()) return;
//
//         setIsSubmitting(true);
//         try {
//             const API_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;
//             const EMPLOYEE_PATH = process.env.REACT_APP_EMPLOYEE_PATH;
//             const response = await axios.post(`${API_URL}${EMPLOYEE_PATH}/api/employees`, employee, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//
//             setMessage({ text: 'Сотрудник успешно зарегистрирован!', color: 'green' });
//             // Очистка формы после успешной отправки
//             setEmployee({
//                 surname: '',
//                 name: '',
//                 patronymic: '',
//                 employeePost: '',
//                 stuffId: '',
//                 login: '',
//                 password: '',
//                 role: ''
//             });
//             setConfirmPassword('');
//             setPasswordsMatch(false);
//         } catch (error) {
//             console.error('Ошибка при отправке данных:', error);
//             setMessage({
//                 text: error.response?.data?.message || 'Произошла ошибка при регистрации',
//                 color: 'red'
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <div className="content">
//             <div className="registration-form">
//                 <h2>Регистрация нового сотрудника</h2>
//                 <form onSubmit={handleSubmit} autoComplete="off">
//                     <input
//                         type="text"
//                         placeholder="Фамилия"
//                         name="surname"
//                         value={employee.surname}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Имя"
//                         name="name"
//                         value={employee.name}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Отчество"
//                         name="patronymic"
//                         value={employee.patronymic}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Должность"
//                         name="employeePost"
//                         value={employee.employeePost}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Табельный номер"
//                         name="stuffId"
//                         value={employee.stuffId}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Логин"
//                         name="login"
//                         value={employee.login}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     />
//                     <input
//                         type="password"
//                         placeholder="Пароль"
//                         name="password"
//                         value={employee.password}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="new-password"
//                     />
//                     <input
//                         type="password"
//                         placeholder="Подтверждение пароля"
//                         value={confirmPassword}
//                         onChange={handleConfirmPasswordChange}
//                         required
//                         autoComplete="new-password"
//                     />
//                     <select
//                         name="role"
//                         value={employee.role}
//                         onChange={handleInputChange}
//                         required
//                         autoComplete="off"
//                     >
//                         <option value="">Выберите роль</option>
//                         <option value="ROLE_USER">USER</option>
//                         <option value="ROLE_ADMIN">ADMIN</option>
//                     </select>
//                     <span style={{color: message.color}}>{message.text}</span>
//                     <button type="submit" disabled={isSubmitting}>
//                         {isSubmitting ? 'Отправка...' : 'Зарегистрировать'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default EmployeeRegistrationForm;

import React, { useState } from 'react';
import { registerEmployee } from '../api/employeesApi';
import styles from './AddEmployeeForm.module.css';

const EmployeeRegistrationForm = () => {
    const [employee, setEmployee] = useState({
        surname: '',
        name: '',
        patronymic: '',
        employeePost: '',
        stuffId: '',
        login: '',
        password: '',
        role: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', color: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        const match = employee.password === value;
        setPasswordsMatch(match);
        setMessage({
            text: match ? 'Пароли совпадают' : 'Пароли не совпадают',
            color: match ? 'green' : 'red'
        });
    };

    const validateForm = () => {
        for (const field in employee) {
            if (!employee[field]) {
                setMessage({ text: 'Все поля должны быть заполнены', color: 'red' });
                return false;
            }
        }

        if (!confirmPassword) {
            setMessage({ text: 'Подтвердите пароль', color: 'red' });
            return false;
        }

        if (!passwordsMatch) {
            setMessage({ text: 'Пароли не совпадают', color: 'red' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await registerEmployee(employee);

            setMessage({ text: 'Сотрудник успешно зарегистрирован!', color: 'green' });
            setEmployee({
                surname: '',
                name: '',
                patronymic: '',
                employeePost: '',
                stuffId: '',
                login: '',
                password: '',
                role: ''
            });
            setConfirmPassword('');
            setPasswordsMatch(false);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            setMessage({
                text: error.response?.data?.message || 'Произошла ошибка при регистрации',
                color: 'red'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="content">
            <div className={styles["registration-form"]}>
                <h2>Регистрация нового сотрудника</h2>
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <input
                                        type="text"
                                        placeholder="Фамилия"
                                        name="surname"
                                        value={employee.surname}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Имя"
                                        name="name"
                                        value={employee.name}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Отчество"
                                        name="patronymic"
                                        value={employee.patronymic}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Должность"
                                        name="employeePost"
                                        value={employee.employeePost}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Табельный номер"
                                        name="stuffId"
                                        value={employee.stuffId}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Логин"
                                        name="login"
                                        value={employee.login}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        value={employee.password}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Подтверждение пароля"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        required
                                        autoComplete="new-password"
                                    />
                                    <select
                                        name="role"
                                        value={employee.role}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="off"
                                    >
                                        <option value="">Выберите роль</option>
                                        <option value="ROLE_USER">USER</option>
                                        <option value="ROLE_ADMIN">ADMIN</option>
                                    </select>
                                    <span style={{color: message.color}}>{message.text}</span>
                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Отправка...' : 'Зарегистрировать'}
                                    </button>
                                </form>
            </div>
        </div>
    );
};

export default EmployeeRegistrationForm;
