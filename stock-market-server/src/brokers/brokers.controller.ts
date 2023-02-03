import {Controller, Get, Put, Body, Post, Delete, Param} from '@nestjs/common';
import * as brokers from "../../data/brokers.json";
import * as fs from "fs";
import {UpdateBrokersDto} from "./UpdateBrokersDto";
import {CreateBrokerDto} from "./CreateBrokerDto";
import {BrokerDto} from "./BrokerDto";

@Controller('brokers')
export class BrokersController {
    @Get()
    getAllBrokers(): string {
        return JSON.stringify(brokers.brokers);
    }


    @Put()
    updateBrokers(
        @Body() updateBrokersDto: UpdateBrokersDto) {
        let brokersToUpdate: string = JSON.stringify(updateBrokersDto);
        fs.writeFileSync("data/brokers.json", brokersToUpdate);
    }

    @Post()
    addBroker(
        @Body() createBrokerDto: CreateBrokerDto
    ): string {
        let brokerDto: BrokerDto = {
            id: JSON.stringify(parseInt(brokers.brokers[brokers.brokers.length - 1].id) + 1),
            name: createBrokerDto.name,
            role: "user",
            balance: createBrokerDto.balance
        }

        let newBrokers = {
            brokers: brokers.brokers
        };
        newBrokers.brokers.push(brokerDto);
        fs.writeFileSync("data/brokers.json", JSON.stringify(newBrokers));
        return JSON.stringify(brokers.brokers);
    }

    @Delete(':id')
    deleteBroker(@Param('id') id: string){
        let newBrokers = {
            brokers: brokers.brokers
        };
        newBrokers.brokers = newBrokers.brokers.filter((b:any) => b.id !== id);
        fs.writeFileSync("data/brokers.json", JSON.stringify(newBrokers));
        return JSON.stringify(newBrokers.brokers);
    }
}
