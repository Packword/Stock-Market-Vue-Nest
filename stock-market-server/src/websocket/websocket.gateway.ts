import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import {Socket, Server} from "socket.io";
import {SendNewPricesService} from "../send-new-prices/send-new-prices.service";
import * as settings from '../../data/marketSettings.json'
import {forwardRef, Inject} from "@nestjs/common";

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(forwardRef(() => SendNewPricesService))
        private sendNewPricesService: SendNewPricesService) {
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('askServer')
    handleMessage(client: Socket, payload: any): void {
        //console.log("send");
        this.server.emit('clientUpdatePrices', JSON.parse(this.sendNewPricesService.getUpdatedPrices(0)))
    }

    afterInit(server: Server) {
        console.log('Init');
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }
}
