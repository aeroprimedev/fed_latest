import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(true);
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Home />
        </Router>
      </Provider>
    </div >
  );
}

export default App;
