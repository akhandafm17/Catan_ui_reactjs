import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import {appRoutes} from "./routes";
import './styles.scss'
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AccountContextProvider} from "@library/context";
import SecurityContextProvider from "@library/context/SecurityContextProvider.tsx";
import {Theming} from "@library/theme";

axios.defaults.baseURL = (import.meta.env.VITE_BACKEND_HOST || 'http://localhost:8080');
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <AccountContextProvider>
            <SecurityContextProvider>
                <React.StrictMode>
                    <Theming>
                        <RouterProvider router={appRoutes}/>
                    </Theming>
                </React.StrictMode>
            </SecurityContextProvider>
        </AccountContextProvider>
    </QueryClientProvider>
)
