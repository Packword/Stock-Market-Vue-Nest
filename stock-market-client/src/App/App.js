import './App.css';
import PageNotFound from '../PageNotFound/PageNotFound'
import Header from "../Header/Header";
import Brokers from "../Brokers/Brokers";
import StockMarket from "../StockMarket/StockMarket";
import Stocks from "../Stocks/Stocks";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React, {useState} from "react";

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="brokers" element={<Brokers/>}/>
                <Route path="stocks" element={<Stocks/>}/>
                <Route path="stockmarket" element={<StockMarket/>}/>
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        </Router>
    );
}

export default App;
