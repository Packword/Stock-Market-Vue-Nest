import {Controller, Post} from '@nestjs/common';
import * as settings from '../../data/marketSettings.json'
import {SendNewPricesService} from "../send-new-prices/send-new-prices.service";

@Controller('emulate-api')
export class EmulateApiController {
    constructor(private sendNewPricesService: SendNewPricesService) {
    }

    @Post()
    startEmulate() {
        this.sendNewPricesService.emulate(settings.startDate)
    }
}
