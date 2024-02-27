import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    const puesto = localStorage.getItem("Puesto");

    if ((nombreUsuario === "Administrador") || (nombreUsuario === "SuperAdministrador") || (puesto === "Encargado de Área")) {
      return true;
    } else {
      alert("No tienes permisos para visualizar esa pantalla");
      this.router.navigate(['/dashboard/tablero']);
      return false;
    }
  }
}
