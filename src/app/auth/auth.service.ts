import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { usuario } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   //API: string = 'https://recicladora.arvispace.com/PhpAngular/'
   private isLoggedIn = false;
  private pageReloadedAfterLogin = false;
  API: string = 'http://localhost/PhpAngular/';

  constructor( private clientService:HttpClient) { }

  verUsuario(datosUsuario:usuario):Observable<any>{
    return this.clientService.post(this.API+"?login=",datosUsuario);
  }

  setLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  // Método para comprobar si se ha iniciado sesión
  isLoggedInUser() {
    return this.isLoggedIn;
  }

  // Método para establecer el estado de recarga de página después del inicio de sesión
  setPageReloadedAfterLogin(value: boolean) {
    this.pageReloadedAfterLogin = value;
  }

  // Método para comprobar si la página se ha recargado después del inicio de sesión
  isPageReloadedAfterLogin() {
    return this.pageReloadedAfterLogin;
  }
}
