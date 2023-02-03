import {Body, Controller, Get, Put} from '@nestjs/common';
import {SettingsDto} from "./SettingsDto";
import * as fs from "fs"
import * as settings from "../../data/marketSettings.json"
import * as stocks from "../../data/stocks.json"
import {SendNewPricesService} from "../send-new-prices/send-new-prices.service";
import {WebsocketGateway} from "../websocket/websocket.gateway";

@Controller('market')
export class MarketController {
    constructor(private sendNewPricesService: SendNewPricesService, private websocket: WebsocketGateway) {}
    @Get("settings")
    getSettings(): string{
        return JSON.stringify(settings);
    }

    @Get("prices")
    getPrices(): string{
        //console.log("send");
        return this.sendNewPricesService.getPricesOfChoosenStocks();
    }

    @Put("settings")
    updateSettings(@Body() settingsDto: SettingsDto){
        this.websocket.server.emit('SETTINGS', settingsDto);
        fs.writeFileSync("data/marketSettings.json", JSON.stringify(settingsDto));
    }
}
