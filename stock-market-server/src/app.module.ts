import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksController } from './stocks/stocks.controller';
import { BrokersController } from './brokers/brokers.controller';
import { MarketController } from './market/market.controller';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { SendNewPricesService } from './send-new-prices/send-new-prices.service';
import { EmulateApiController } from './emulate-api/emulate-api.controller';
import { ApiController } from './api/api.controller';

@Module({
  imports: [],
  controllers: [AppController, StocksController, BrokersController, MarketController, EmulateApiController, ApiController],
  providers: [WebsocketGateway, AppService, SendNewPricesService],
})
export class AppModule {}
