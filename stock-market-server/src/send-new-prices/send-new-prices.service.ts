import {Injectable} from '@nestjs/common';
import * as stocks from "../../data/stocks.json";
import * as settings from "../../data/marketSettings.json";
import * as data from "../../data/historical_data.json";
import * as fs from 'fs';
import {WebsocketGateway} from "../websocket/websocket.gateway";

@Injectable()
export class SendNewPricesService {
    constructor(private readonly websocket: WebsocketGateway) {
    }

    private timer: any;

    getPricesOfChoosenStocks(): string {
        let result: any[];
        let neededStocks: any[] = stocks.filter(s => settings.stocksToEmulate.includes(s.label));
        result = neededStocks.map((s) => {
            return {
                Name: s.label,
                Date: Date.now(),
                Open: s.curPrice
            }
        })
        return JSON.stringify(result);
    }

    getUpdatedPrices(index: number): string {
        let newStocks = stocks.filter(s => settings.stocksToEmulate.includes(s.label))
        let finalStocks = newStocks.map(s => {
            let tmpStocks = data.find(d => d.name === s.label).stocks;
            console.log(tmpStocks[index]);
            return {
                Name: s.label,
                Date: tmpStocks[index].Date,
                Open: tmpStocks[index].Open
            };
        })
        return JSON.stringify(finalStocks);
    }

    emulate(startDate: string): void {
        let date = new Date(startDate);
        let strDate = date.toISOString();
        let formDate = `${strDate.slice(5, 7)}/${strDate.slice(8, 10)}/${strDate.slice(0, 4)}`
        let index = data[0].stocks.findIndex(d => d.Date === formDate);
        if(index === -1){
            index = data[0].stocks.length - 1;
        }
        let stocks = JSON.parse(this.getUpdatedPrices(index));
        let prevStocks = []
        index--;
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
                if (stocks) {
                    console.log(stocks);
                    prevStocks = JSON.parse(this.getUpdatedPrices(index + 1));
                    stocks = JSON.parse(this.getUpdatedPrices(index--));
                    this.websocket.server.emit('HIST', data.map(d => {
                        let curDate = new Date(stocks[0]?.Date);
                        return {name: d.name, stocks: d.stocks.filter(s => {
                            let curD = new Date(s?.Date);
                            return (curD <= curDate && curD >= date);
                        })}
                    }));
                    this.websocket.server.emit('clientUpdatePrices', stocks);
                    this.websocket.server.emit('clientPrevPrices', prevStocks);
                    this.websocket.server.emit('STOCKS', stocks);
                }
            }, 1000 * parseInt(settings.speed)
        )
    }
}
