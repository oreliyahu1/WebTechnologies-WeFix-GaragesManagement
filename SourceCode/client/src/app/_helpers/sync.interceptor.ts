import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { UserService } from '@app/_services';
import { SharedService } from '@app/shared/shared.service';

@Injectable()
export class SyncInterceptor implements HttpInterceptor {

    constructor(private userService: UserService, private http: HttpClient, private sharedService : SharedService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.headers.has('None') || !this.userService.isLoggin()){
            return next.handle(request);
        }
    
        this.http.get<Variable>(`${environment.apiUrl}/sync/${this.userService.currentUserValue._id}`, { headers: new HttpHeaders({ 'None': 'true'})})
		.pipe(first())
		.subscribe(
			data => {
                if(data['update']){
                    this.userService.refreshData().subscribe(()=>{
                        this.sharedService.sendLoginState(this.userService.getUserPermission());
                    });
                }
        });
        
        return next.handle(request);
    }
}