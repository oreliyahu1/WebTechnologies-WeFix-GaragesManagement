import {Garage} from './garage'

export class GarageReport extends Garage {
    report: { _id: Date, cost: number, count: number}[];
}