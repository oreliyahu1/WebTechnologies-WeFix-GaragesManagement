import {Employee} from './employee'
import {Location} from './location'
import { Treatment } from './treatment';

export class Garage {
    _id: number;
    name: string;
    location: Location;
    manager: Employee;
    employees: Employee[];
    treatments : Treatment[];
}