import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '@environments/environment'
import { Response, Treatment, Garage} from '../_models'

@Injectable({ providedIn: 'root' })
export class TreatmentService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Treatment[]>(`${environment.apiUrl}/treatments`);
    }

    getById(id: number) {
        return this.http.get<Treatment>(`${environment.apiUrl}/treatments/${id}`);
    }

    ///////////////////////////////////
    getFullById(id: number) {
        return this.http.get<Treatment>(`${environment.apiUrl}/treatments/${id}/full`);
    }

    getGarageById(id: number) {
        return this.http.get<Garage>(`${environment.apiUrl}/treatments/${id}/garage`);
    }
    ///////////////////////////////////

    add(treatment: Treatment) {
        return this.http.post<Response>(`${environment.apiUrl}/treatments/add`, treatment);
    }

    update(treatment: Treatment) {
        return this.http.put<Response>(`${environment.apiUrl}/treatments/${treatment._id}`, treatment);
    }

    delete(id: number) {
        return this.http.delete<Response>(`${environment.apiUrl}/treatments/${id}`);
    }
}