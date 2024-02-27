import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  // Visualizar de acuerdo al rol
  usuarioTienePermiso: boolean;
  usuarioSupervisor: boolean;
  
  private primeraCarga = true;
  constructor(
    private router: Router,
    private menuController: MenuController,
    private authService: AuthService
  ) {
    // Visualizar de acuerdo al rol
    this.usuarioTienePermiso = this.verificarPermisosDelUsuario();
    this.usuarioSupervisor = this.verificarPuestoUser();
  }

  // Visualizar de acuerdo al rol
  private verificarPermisosDelUsuario(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return (nombreUsuario === "Administrador" || nombreUsuario === "SuperAdministrador");
  }

  private verificarPuestoUser(): boolean{
    const puesto = localStorage.getItem("Puesto");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return puesto === "Encargado de Área";
  }
  ionViewWillEnter() {
    this.menuController.enable(true, 'menu1');
  }
  ionViewDidEnter() {
    // Comprueba si se ha iniciado sesión y si la página se ha recargado después del inicio de sesión
    if (this.authService.isLoggedInUser() && !this.authService.isPageReloadedAfterLogin()) {
      // Realiza cualquier acción que necesites hacer después de la primera carga
      // Por ejemplo, recargar datos, inicializar componentes, etc.

      // Establece la bandera de recarga de página después del inicio de sesión en true
      this.authService.setPageReloadedAfterLogin(true);

      // Recarga la página una vez después del inicio de sesión
      window.location.reload();
    }
  }

}
