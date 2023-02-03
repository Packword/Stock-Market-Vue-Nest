import {Controller, Get, Put, Body} from '@nestjs/common';
import * as brokersData from '../../data/brokers.json';
import {EmulateBrokerDto} from "./EmulateBrokerDto";
import * as settings from '../../data/marketSettings.json';
import {WebsocketGateway} from "../websocket/websocket.gateway";

@Controller('api')
export class ApiController {
    private brokers: EmulateBrokerDto[] = [];
    private startBrokers: any[];
    private readonly settings: any;

    constructor(private readonly websocket: WebsocketGateway) {
        this.settings = settings;
        this.startBrokers = brokersData.brokers;
        this.startBrokers.map(broker => {
            this.brokers.push({
                id: broker.id,
                name: broker.name,
                role: broker.role,
                curBalance: broker.balance,
                stocks: [
                    {
                        label: "AAPL",
                        purchasePrices: []
                    },
                    {
                        label: "SBUX",
                        purchasePrices: []
                    },
                    {
                        label: "MSFT",
                        purchasePrices: []
                    },
                    {
                        label: "CSCO",
                        purchasePrices: []
                    },
                    {
                        label: "QCOM",
                        purchasePrices: []
                    },
                    {
                        label: "AMZN",
                        purchasePrices: []
                    },
                    {
                        label: "TSLA",
                        purchasePrices: []
                    },
                    {
                        label: "AMD",
                        purchasePrices: []
                    },
                ],
                isLogin: false
            });
        });
    }

    @Get("brokers")
    getBrokers() {
        return JSON.stringify(this.brokers);
    }

    @Get("settings")
    getSettings() {
        return JSON.stringify(this.settings);
    }

    @Put("brokers")
    updateBroker(@Body() newBroker: EmulateBrokerDto) {
        console.log(newBroker);
        let brokerIndex = this.brokers.findIndex(broker => broker.id === newBroker.id);
        this.brokers[brokerIndex] = newBroker;
        this.websocket.server.emit("BROKERS", JSON.stringify(this.brokers));
        console.log(this.brokers);
    }
}
