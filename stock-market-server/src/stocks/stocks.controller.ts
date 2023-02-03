import { Controller, Get } from '@nestjs/common';
import * as stocks from "../../data/stocks.json";
import * as hist from "../../data/historical_data.json";

@Controller('stocks')
export class StocksController {
    @Get()
    getAllStocks(): string {
        return JSON.stringify(stocks);
    }
    @Get('historicalData')
    getHistoricalData(): string {
        return JSON.stringify(hist)
    }

}
