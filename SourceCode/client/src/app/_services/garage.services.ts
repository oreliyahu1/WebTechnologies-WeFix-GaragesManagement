import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '@environments/environment'
import {Garage, GarageReport, Response, Employee, Treatment, Manager} from '../_models'

@Injectable({ providedIn: 'root' })
export class GarageService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Garage[]>(`${environment.apiUrl}/garages`);
    }

    getById(id: number) {
        return this.http.get<Garage>(`${environment.apiUrl}/garages/${id}`);
    }

    ///////////////////////////////////
    getFullById(id: number) {
        return this.http.get<Manager>(`${environment.apiUrl}/garages/${id}/full`);
    }

    getManagerById(id: number) {
        return this.http.get<Manager>(`${environment.apiUrl}/garages/${id}/manager`);
    }

    getEmployeesById(id: number) {
        return this.http.get<Employee[]>(`${environment.apiUrl}/garages/${id}/employees`);
    }

    getTreatmentsById(id: number) {
        return this.http.get<Treatment[]>(`${environment.apiUrl}/garages/${id}/treatments`);
    }

    getReportById(id: number) {
        return this.http.get<GarageReport[]>(`${environment.apiUrl}/garages/${id}/report`);
    }

    getAllReports() {
        return this.http.get<GarageReport[]>(`${environment.apiUrl}/garages/report`);
    }
    ///////////////////////////////////

    add(garage: Garage) {
        return this.http.post<Response>(`${environment.apiUrl}/garages/add`, garage);
    }

    update(garage: Garage) {
        return this.http.put<Response>(`${environment.apiUrl}/garages/${garage._id}`, garage);
    }

    delete(id: number) {
        return this.http.delete<Response>(`${environment.apiUrl}/garages/${id}`);
    }
}