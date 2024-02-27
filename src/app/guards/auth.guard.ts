import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Se obtiene el token para saber si inició sesión
    const token = localStorage.getItem('token');

    // Si inició sesión, se permite el acceso
    if (token) {
      return true;
    } else {
      // Si no inició sesión, se redirige al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
