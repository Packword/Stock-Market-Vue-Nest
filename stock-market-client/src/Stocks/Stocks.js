import "./Stocks.css";
import {useEffect, useState} from "react";
import React from "react";
import {Chart, registerables } from "chart.js";


const Stocks = () => {
    Chart.register(...registerables);
    const [stocks, setStocks] = useState([]);
    let choosenStocks = JSON.parse(sessionStorage.getItem("choosenStocks"));
    if(!choosenStocks)
        choosenStocks = [];

    let histData;
    let getHistData = () => {
        fetch("http://localhost:3001/stocks/historicalData")
            .then(res => res.json())
            .then((result) => {
                histData = result;
            })
    }
    useEffect(() => {
        fetch("http://localhost:3001/stocks")
            .then(res => res.json())
            .then((result) => {
                setStocks(result);
            })
    }, []);

    let updateChoosenStocks = (label) => {
        if(choosenStocks.find(s => s === label))
            choosenStocks = choosenStocks.filter(s => s !== label)
        else
            choosenStocks.push(label)
        sessionStorage.setItem("choosenStocks", JSON.stringify(choosenStocks));
    }

    function showChart(label){
        const ctx = document.getElementById(label);
        ctx.style.display = ctx.style.display === "block" ? "none" : "block";
        let labelData = histData.find(d => d.name === label).stocks;
        const labels = labelData.map(s => {
            return s.Date;
        });
        const values = labelData.map(s => {
            return s.Open;
        });
        const data = {
            labels: labels,
            datasets: [{
                label: label,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: values,
            }]
        }
        const myChart = new Chart(ctx, {
            type: 'line',
            data
        })
    }

    let renderStocks = () => {
        let stockList = [];
        stocks.map(stock => {
            stockList.push(<>
                <div className="stock">
                    <div className="info">
                        <input type="checkbox" checked={choosenStocks.find(s => s === stock.label)}
                               onChange={() => updateChoosenStocks(stock.label)}/>
                        <h4>{stock.label}</h4>
                        {stock.name} <br/>
                        Price: {stock.startPrice}$
                    </div>

                    <button className="btn btn-primary" onClick={() => showChart(stock.label)}>Подробнее</button>
                </div>
                <canvas style={{display: "none"}} id={stock.label} width="400px" height="200px"></canvas>
                </>
            );
        })
        return stockList;
    }

    getHistData();
    return (
        <>
            <div className="all-stocks">
                {renderStocks()}
            </div>
        </>
    );
}

export default Stocks;