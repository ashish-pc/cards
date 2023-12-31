import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import "./index.css"
import MedicineProvider from './context/MedicineProvider.jsx';
import { Provider } from "react-redux"
import store from './redux/store.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>

  // </React.StrictMode>

  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <MedicineProvider>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </MedicineProvider>
    </MantineProvider>
  </QueryClientProvider>
)
