import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
//import { AuthService } from './auth.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private _authService: AuthService,
    private _router : Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //return this.authService.isAuthenticated();
    
    //console.log('Guard Hecho');
    //return this._usuarioService.estaAutenticado();
    if(this._authService.estaAutenticado()){
      return true;
    }
    else 
    {
    this._router.navigate(['/login']);
    return false;
    }
  }
}
