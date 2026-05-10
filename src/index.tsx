import './index.css'

import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from "react-dom/client";

import App from './App'
import { initializeUmami } from './analytics/umami';
// import reportWebVitals from './reportWebVitals'
import { store } from './store/store'

initializeUmami();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)
