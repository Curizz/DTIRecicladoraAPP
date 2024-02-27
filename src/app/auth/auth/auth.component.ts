import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoadingController } from '@ionic/angular';
//import { MatDialog } from '@angular/material/dialog';
//import { AvisoLoginComponent } from '../aviso-login/aviso-login.component';
import { ToastController } from '@ionic/angular';
import { AlertController, NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {

  formularioLogin: FormGroup;

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private menu: MenuController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    public alertController: AlertController,
    public navCtrl: NavController
  ) {
    this.formularioLogin = this.formBuilder.group({
      Correo: ['', Validators.required],
      Pass: ['', Validators.required],
    });
  }

  async enviarDatos() {
    if (this.formularioLogin.valid) {
      console.log('Se presionó el botón');
      console.log(this.formularioLogin.value);

      try {
        const loading = await this.loadingController.create({
          message: 'Iniciando Sesión...',
          translucent: true,
          spinner: 'bubbles', // puedes elegir el tipo de spinner que desees
          cssClass: 'spinner-verde' 
        });
        await loading.present();
  
        const response = await this.authService.verUsuario(this.formularioLogin.value).toPromise();
        await loading.dismiss();

        if (response.hasOwnProperty('error')) {
          console.log('Error: ' + response.error);
          const alert = await this.alertController.create({
            header: "Error",
            message: "Usuario o Contraseña incorrectos favor de verificar",
            buttons: ["OK"]
          });
          await alert.present()
          let result = await alert.onDidDismiss();
          console.log(result);

        } else {
          this.formularioLogin.reset();
          console.log('Se logueó correctamente');
          localStorage.setItem('token', Math.random().toString());
         
          localStorage.setItem("id_user", response.idUsuario);
          localStorage.setItem("Nombre", response.Nombre);
          localStorage.setItem("Correo", response.Correo);
          localStorage.setItem("NombreTipoUser", response.NombreTipoUser);
          localStorage.setItem("NombreArea", response.NombreArea);
          localStorage.setItem("idArea", response.idArea);
          localStorage.setItem("NombreFabrica", response.NombreFabrica);
          localStorage.setItem("idFabrica", response.idFabrica);
          localStorage.setItem("Puesto", response.Puesto);
          localStorage.setItem("idAsignacion", response.idAsignacion);
          this.authService.setLoggedIn(true);
          this.router.navigateByUrl('/dashboard/tablero');
          
        }
      } catch (error) {
        const alert = await this.alertController.create({
          header: "Error",
          message: "No se pudo iniciar Sesion ya que ocurrio un error dentro del servidor favor de ingresar mas tarde",
          buttons: ["OK"]
        });
        await alert.present()
        let result = await alert.onDidDismiss();
        console.log(result);
      }
    }
  }

  // async mostrarToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000,
  //     color: 'danger'
  //   });
  //   toast.present();
  // }
  ionViewDidEnter() {
    this.menu.enable(false);

  }

}
