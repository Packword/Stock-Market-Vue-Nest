import {EmulateStockDto} from "./EmulateStockDto";

export class EmulateBrokerDto{
    id: string;
    name: string;
    role: string;
    curBalance: number;
    stocks: EmulateStockDto[];
    isLogin: boolean;
}