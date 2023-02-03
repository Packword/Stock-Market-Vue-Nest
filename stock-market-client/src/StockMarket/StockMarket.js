import "./StockMarket.css";
import React, {useEffect, useState} from "react";
import axios from "axios";
import io from "socket.io-client"

const StockMarket = () => {
    const [settings, setSettings] = useState({});
    const [stocks, setStocks] = useState([]);
    const [prevStocks, setPrevStocks] = useState([]);
    let choosenStocks = JSON.parse(sessionStorage.getItem("choosenStocks"));
    if (!choosenStocks)
        choosenStocks = [];
    let useUpdateData = () => {
        useEffect(() => {
            const socket = io('http://localhost:3001', {transports: ['websocket']})
            socket.connect();
            socket.on('clientUpdatePrices', setStocks)
            socket.on('clientPrevPrices', setPrevStocks)
            fetch("http://localhost:3001/market/settings")
                .then(res => res.json())
                .then((result) => {
                    setSettings(result);
                })
            return () => {
                socket.disconnect();
            }
        }, []);
    }

    let handleSettingsDate = (event) => {
        let tmpSettings = {
            startDate: event.target.value,
            speed: settings.speed,
            stocksToEmulate: settings.stocksToEmulate,
            isEmulating: false,
            curDate: event.target.value
        }
        setSettings(tmpSettings);
    }
    let handleSettingsSpeed = (event) => {
        let tmpSettings = {
            startDate: settings.startDate,
            speed: event.target.value < 0 ? 0 : event.target.value,
            stocksToEmulate: settings.stocksToEmulate,
            isEmulating: false,
            curDate: settings.curDate
        }
        setSettings(tmpSettings);
    }

    const stopEmulating = () => {
        let tmpSettings = {
            startDate: settings.startDate,
            speed: settings.speed < 1 ? 1 : settings.speed,
            stocksToEmulate: choosenStocks,
            isEmulating: false,
            curDate: settings.curDate
        }
        axios.put("http://localhost:3001/market/settings/", {
            startDate: settings.startDate,
            speed: settings.speed < 1 ? 1 : settings.speed,
            stocksToEmulate: choosenStocks,
            isEmulating: false,
            curDate: settings.curDate
        });

        setSettings(tmpSettings);
    }

    const startEmulating = () => {
        let tmpSettings = {
            startDate: settings.startDate,
            speed: settings.speed < 1 ? 1 : settings.speed,
            stocksToEmulate: choosenStocks,
            isEmulating: true,
            curDate: settings.curDate
        }
        axios.put("http://localhost:3001/market/settings/", {
            startDate: settings.startDate,
            speed: settings.speed < 1 ? 1 : settings.speed,
            stocksToEmulate: choosenStocks,
            isEmulating: true,
            curDate: settings.curDate
        });
        console.log("start");
        setTimeout(() => {
            axios.post("http://localhost:3001/emulate-api/");
            console.log("end");
        }, 5000);
        setSettings(tmpSettings);
    }

    const renderStocksTable = () => {
        const tableHead = stocks.map(s => {
            return <td>{s.Name}</td>
        })
        const tableBody = stocks.map(s => {
            return <td>{s.Open}</td>
        })
        const tableBodyPrev = prevStocks.map((ps, i) => {
            return <td>{ps.Open - stocks[i].Open}</td>
        })
        console.log(stocks);
        return <>
            {stocks[0]?.Date}
            <table>
                <thead>
                <tr>{tableHead}</tr>
                </thead>
                <tbody>
                <tr>{tableBody}</tr>
                <tr>{tableBodyPrev}</tr>
                </tbody>
            </table>
        </>
    }

    const renderStockMarket = () => {
        if (settings.isEmulating === false) {
            return <>
                <div className="beforeEmulate">
                    Дата начала торгов: <input onChange={event => handleSettingsDate(event)}
                                               className="form-control w-50"
                                               value={settings.startDate}
                                               min='2021-11-26'
                                               max='2022-11-23'
                                               type="date"/> <br/>
                    Скорость имитации торгов: <input onChange={event => handleSettingsSpeed(event)}
                                                     className="form-control w-50"
                                                     value={settings.speed}
                                                     type="number"/>
                    <button onClick={startEmulating} className="btn btn-dark btn-lg">Начать торги</button>
                </div>
            </>;

        } else {
            return <>
                <div className="emulate">
                    {renderStocksTable()}
                    <button onClick={stopEmulating} className="btn btn-primary">Остановить торги</button>
                </div>
            </>;
        }
    }
    useUpdateData()
    return (
        <>
            <div className="container">
                {renderStockMarket()}
            </div>
        </>
    );
}

export default StockMarket;
