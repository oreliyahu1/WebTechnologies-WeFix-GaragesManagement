import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isLoggin = this.userService.isLoggin();
        if((state.url == '/login') || (state.url == '/register') || (state.url == '/')){
            if (isLoggin) {
                this.router.navigate(['/panel']);
                return false; 
            }
            return true; 
        }else{
            if (!isLoggin){
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }
    }
}