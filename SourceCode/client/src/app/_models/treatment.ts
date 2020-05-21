import { Garage } from './garage';

export class Treatment {
    _id: number;
    garage: Garage;
    carid: number;
	status: {type: string, enum : ['Waiting','In process', 'Done']};
    details: string;
    cost: number;
	date: Date;
}