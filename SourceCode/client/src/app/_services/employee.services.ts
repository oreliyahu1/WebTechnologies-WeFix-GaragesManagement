import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '@environments/environment'
import {Employee, Response, Manager, Garage} from '../_models'

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
    }

    getAllFull() {
        return this.http.get<Employee[]>(`${environment.apiUrl}/employees/full`);
    }

    getById(id: number) {
        return this.http.get<Employee>(`${environment.apiUrl}/employees/${id}`);
    }

    ///////////////////////////////////
    getFullById(id: number) {
        return this.http.get<Employee>(`${environment.apiUrl}/employees/${id}/full`);
    }

    getManagerById(id: number) {
        return this.http.get<Manager>(`${environment.apiUrl}/employees/${id}/manager`);
    }

    getGarageById(id: number) {
        return this.http.get<Garage>(`${environment.apiUrl}/employees/${id}/garage`);
    }
    ///////////////////////////////////

    update(emp: Employee) {
        return this.http.put<Response>(`${environment.apiUrl}/employees/${emp._id}`, emp);
    }

    /*
    delete(id: number) {
        return this.http.delete<Response>(`${environment.apiUrl}/employees/${id}`);
    }
    */
}