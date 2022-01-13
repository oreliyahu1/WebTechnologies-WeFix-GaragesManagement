import { Garage } from './garage';
import { Manager } from './manager';

export class Employee{
    _id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    garage: Garage;
    manager: Manager;
    status: {type: string, enum : ['New Employee','Employee', 'Manager', 'Admin', 'None']};
    token?: string;
}