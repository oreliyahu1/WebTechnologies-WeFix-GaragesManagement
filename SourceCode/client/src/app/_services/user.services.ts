import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import {Employee, Response} from '../_models'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    currentUserSubject: BehaviorSubject<Employee>;
    currentUser: Observable<Employee>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Employee>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    isLoggin() : boolean{
        return this.currentUserValue != null;
    }

    get currentUserValue(): Employee {
        return this.currentUserSubject.value;
    }

    getUserPermission() : string{
        if(this.isLoggin())
          return String(this.currentUserValue.status);
        return '';
    }

    signup(e : Employee) {
        return this.http.post<Response>(`${environment.apiUrl}/users/signup`, e);
    }

    forgotPassword(e : Employee) {
        return this.http.post<Response>(`${environment.apiUrl}/users/forgotpassword`, e);
    }

    login(e : Employee) {
        return this.http.post<Response>(`${environment.apiUrl}/users/login`, e)
        .pipe(map(response => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if(response.data){
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                this.currentUserSubject.next(response.data);
            }
            return response;
        }));
    }

    refreshData() {
        return this.http.get<Employee>(`${environment.apiUrl}/employees/${this.currentUserValue._id}`).pipe(map(response => {
            if(response){
                response.token = this.currentUserValue.token;
                localStorage.setItem('currentUser', JSON.stringify(response));
                this.currentUserSubject.next(response);
            }
        }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return this.http.post<Response>(`${environment.apiUrl}/users/logout`, '');
    }
}