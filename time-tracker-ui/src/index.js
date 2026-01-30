import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
            onLoad: 'none', // НЕ инициализировать автоматически
            checkLoginIframe: false,
        }}
        onEvent={(event, error) => {
            if (event === 'onAuthError') {
                console.error('Ошибка аутентификации', error);
            }
            if (event === 'onInitError') {
                console.error('Ошибка инициализации', error);
            }
        }}
    >
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <App />
        </BrowserRouter>
    </ReactKeycloakProvider>
);
