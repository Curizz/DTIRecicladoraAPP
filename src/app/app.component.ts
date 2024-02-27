import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  usuarioTienePermisoAdmin:boolean = false;
  usuarioTienePermisoSuper:boolean = false;
  usuarioEsSuperAdministrador: boolean =false;
  checkingLocalStorage: boolean = true;

  constructor(
    public router: Router,
    public toastController: ToastController,
    public alertController: AlertController,
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public menu: MenuController
  ) {}

  ngOnInit() {
    this.verificarLocalStorage();
  }

  verificarLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      setTimeout(() => {
        this.usuarioTienePermisoAdmin = this.verificarPermisosDelUsuario();
        this.usuarioTienePermisoSuper = this.verificarPermisosDelUsuarioSuper();
        this.usuarioEsSuperAdministrador = this.verificarPermisosDelSuperUsuario();
        this.checkingLocalStorage = false;
        this.menu.enable(true); // Habilitar el menú después de verificar el localStorage
      }, 1000); // Esperar 1 segundo antes de verificar
    } else {
      this.checkingLocalStorage = false;
    }
  }

  verificarPermisosDelUsuario(): boolean {
    const nombreUsuario = localStorage.getItem('NombreTipoUser');
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return (nombreUsuario === 'Administrador' || nombreUsuario === 'SuperAdministrador') ; // Ejemplo: el usuario con rol "admin" tiene permiso
  }
  
  verificarPermisosDelUsuarioSuper(): boolean {
    const puesto = localStorage.getItem('Puesto');
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return (puesto === 'Encargado de Área'); // Ejemplo: el usuario con rol "admin" tiene permiso
  }

  verificarPermisosDelSuperUsuario(): boolean{
    const nombreUser = localStorage.getItem('NombreTipoUser');
    return (nombreUser === 'SuperAdministrador');
  }

  async alertaCerrar() {
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
}
