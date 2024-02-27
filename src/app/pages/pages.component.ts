import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular'; 
import { MenuController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  // Visualizar de acuerdo al rol
  usuarioTienePermiso: boolean;
  usuarioTienePermisoSuper: boolean;
  //
  nombreUsuario: string | null = null;

  idUsuario: string | null = null;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    // Visualizar de acuerdo al rol
    this.usuarioTienePermiso = this.verificarPermisosDelUsuario();
    this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
  }

  editarAdmin(){
    this.idUsuario = localStorage.getItem("id_user");
    const idUser =localStorage.getItem("id_user");
    this.router.navigateByUrl(`dashboard/empleado/adminProfile/${idUser}`);
  }

   // Visualizar de acuerdo al rol
   private verificarPermisosDelUsuario(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    const puesto = localStorage.getItem("Puesto");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ((nombreUsuario === "Administrador") || (nombreUsuario === "SuperAdministrador")); // Ejemplo: el usuario con rol "admin" tiene permiso
  }

  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    const puesto = localStorage.getItem("Puesto");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ( (nombreUsuario === "SuperAdministrador")); // Ejemplo: el usuario con rol "admin" tiene permiso
  }


 
  async logout() {
    const alert = await this.alertController.create({
      header: "Cerrar sesión",
      message: "¿Estás seguro que deseas cerrar sesión?",
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            const loading = await this.loadingController.create({ 
              message: 'Cerrando sesión...'
            });
            await loading.present(); 
  
            // Simula una espera de 1 segundo antes de borrar los elementos del Local Storage
            await new Promise(resolve => setTimeout(resolve, 1000));
            localStorage.clear();
  
            // Para borrar los elementos del Local Storage
            localStorage.removeItem('token');
            localStorage.removeItem('id_user');
            localStorage.removeItem('NombreTipoUser');
            localStorage.removeItem('Nombre');
            localStorage.removeItem('Correo');
            localStorage.removeItem('NombreFabrica');
            localStorage.removeItem('idFabrica');
            localStorage.removeItem('NombreArea');
            localStorage.removeItem('idArea');
  
            console.log('Se eliminó el token');
  
            await loading.dismiss(); 
  
            // Navega de vuelta a la página de inicio de sesión
            this.router.navigate(['/login'], { replaceUrl: true });
          },
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log("Te quedaste")
          }
        }
      ]
    });
    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem("NombreTipoUser");
    console.log('NombreTipoUser', this.nombreUsuario);
  }

  // Método para cambiar la visibilidad del ion-menu (Ocultar y/o mostrar)
 /* toggleMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.toggle();
    }
  }*/
  toggleMenu() {
    this.menuController.toggle('first');
  }
  
}
