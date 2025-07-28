import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store.js";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import "./index.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937', // Tailwind's gray-800 for good contrast
            border: '1px solid #e5e7eb', // light border (gray-200)
            // borderRadius: '8px',
            padding: '12px 16px',
            // display: 'flex',
            // // alignItems: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            fontSize: '15px',
            fontWeight: '500',
            minWidth: '220px',
            maxWidth: '260',
            gap: '12px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', // green
              secondary: '#d1fae5', // light green bg
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red
              secondary: '#fee2e2', // light red bg
            },
          },
        }}
      />
      <App />
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>
);
