import "./Brokers.css";
import React, {useEffect, useState} from "react";
import axios from "axios";

function Brokers() {
    const [brokers, setBrokers] = useState([]);
    const [newName, setName] = useState('');
    const [newBalance, setBalance] = useState(0);

    useEffect(() => {
        fetch("http://localhost:3001/brokers")
            .then(res => res.json())
            .then((result) => {
                setBrokers(result);
            })
    }, []);

    let handleUpdateBalance = (id, event) => {
        const nextBrokers = brokers.map((b) => {
            if (b.id === id) {
                b.balance = event.target.value;
            }
            return b;
        })
        setBrokers(nextBrokers);
    }

    let handleNewName = event => {
        setName(event.target.value);
    }

    let handleNewBalance = event => {
        setBalance(event.target.value);
    }

    let updateDB = () => {
        axios.put("http://localhost:3001/brokers", {brokers: brokers});
    }

    let addBroker = () => {
        axios.post("http://localhost:3001/brokers", {name: newName, balance: newBalance})
            .then((res) => {
                setBrokers(res.data);
                setName('');
                setBalance(0);
            })
    }

    let deleteBroker = (id) => {
        axios.delete("http://localhost:3001/brokers/" + id)
            .then((res) => {
                console.log(res.data);
                setBrokers(res.data);
            })
    }

    let renderBrokers = () => {
        let brokersList = [];
        brokers.map(broker => {
            brokersList.push(<div className="broker">
                <div className="info">
                    <h4>{broker.name}</h4>
                    Начальные деньги: <br/><input type="number"
                                                  className="form-control w-25"
                                                  placeholder="Стартовый баланс" value={broker.balance}
                                                  onInput={event => handleUpdateBalance(broker.id, event)}/>
                    <button className="btn btn-secondary" onClick={updateDB}>Сохранить</button>
                </div>
                <div className="actions">
                    <button className="btn btn-danger" onClick={ () => deleteBroker(broker.id)}>Удалить</button>
                </div>
            </div>);
        })
        return brokersList;
    }


    return (<>
        <div className="broker-add">
            <div className="add-info">
                <input type="name" className="form-control" value={newName} onChange={handleNewName}
                       placeholder="Имя..."/>
                <input type="number" className="form-control" value={newBalance} onChange={handleNewBalance}
                       placeholder="Стартовый баланс"/>
                <button className="btn btn-primary" onClick={addBroker}>Добавить</button>
            </div>
        </div>
        {renderBrokers()}
    </>);
}

export default Brokers;
