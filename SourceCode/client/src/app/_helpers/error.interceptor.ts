import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '@app/_services';
import { SharedService } from '@app/shared/shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private userService: UserService, private sharedService : SharedService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status == 401) {
                // auto logout if 401 response returned from api
                this.userService.logout();
                location.reload(true);
            } else {
                this.sharedService.sendAlertEvent({ response: 'Error', msg: 'Check your internet connection' });
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}