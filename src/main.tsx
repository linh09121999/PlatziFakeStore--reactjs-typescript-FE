import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { GlobalProvider } from "./context/GlobalContext";


const initializeApp = async (): Promise<void> => {
  try {

    const container = document.getElementById('root');
    if (!container) {
      throw new Error("Không tìm thấy phần tử có id 'root'");
    }

    const root = createRoot(container);

    root.render(
      <StrictMode>
        <GlobalProvider>
        <App />
        </GlobalProvider>
      </StrictMode>
    );
  } catch (error) {
    console.error("Lỗi khi load config:", error);
  }
}

initializeApp()
