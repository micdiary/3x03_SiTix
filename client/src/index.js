import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";


export function disableReactDevTools() {
    // Check if the React Developer Tools global hook exists
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
        for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value === 'function' ? ()=>{} : null;
        }
    }
  
    for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        if (prop === "renderers") {
            // initialise this with an empty `Map`,
            // else it will throw an error in console
            
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] = new Map()
        } else {
            // Replace all of its properties with a no-op function or a null value
            // depending on their types
            
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] =
            typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] === "function"
            ? () => {}
            : null;
        }
    }
}

if (process.env.NODE_ENV === "production") disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

reportWebVitals();
