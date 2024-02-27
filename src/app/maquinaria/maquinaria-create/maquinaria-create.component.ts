import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaquinasService } from '../maquinaria.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-maquinaria-create',
  templateUrl: './maquinaria-create.component.html',
  styleUrls: ['./maquinaria-create.component.scss'],
})
export class MaquinariaCreateComponent  implements OnInit {
  
  formularioMaquina: FormGroup;
  areas: any[] = [];
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private maquinasService: MaquinasService,
    public alertController: AlertController
   
  ) {const correoSave = this.maquinasService.getCorreo();
    const idFabrica = this.maquinasService.getIdFabrica();
    this.formularioMaquina = this.formBuilder.group({
      Numero: ['', [Validators.required]],
      Serie: [''],
      Modelo: ['', [Validators.required]],
      Descripcion: [''],
      Estado: ['', [Validators.required]],
      Area: [''],
      UsuarioCreador: [correoSave],
      idFabrica: [idFabrica]
    }); }

  ngOnInit() {
    this.maquinasService.getAreas().subscribe((data) => {
      this.areas = data;
    });

    console.log('AQUI ABAJO SE MOSTRARIA EL CORREO QUE SE TRAE DESDE EL LOCALSTORAGE');
    const correoSave = this.maquinasService.getCorreo();
    console.log('Correo desde el localStorage: ', correoSave);

    console.log('AQUI ABAJO SE MOSTRARIA EL NOMBRE QUE SE TRAE DESDE EL LOCALSTORAGE');
    const nombreSave = this.maquinasService.getNombre();
    console.log('Nombre desde el localStorage: ', nombreSave);
  }
  CANCELAR() {
    this.router.navigateByUrl('/dashboard/maquinarias/maquinarias-list');
  }

  enviarDatos(): void {
    if (this.formularioMaquina.valid) {
      console.log('Se presionó el botón');
      console.log(this.formularioMaquina.value);
      this.maquinasService.agregarMaquina(this.formularioMaquina.value).subscribe(
        (response) => {
          console.log('Respuesta del servidor', response);

          if (response.success === 1) {
            console.log('Registro exitoso');
            this.presentAlert1();
          } else {
            console.error('Error al registrar en la Base de Datos:', response.error);
            this.mostrarDialogError();
          }
        },
        (error) => {
          // Manejar errores del servicio aquí
          this.mostrarDialogError();
        }
      );
    }
  }

  mostratDialogoAviso(mensaje: string): void {
   
  }

  mostrarDialogError(): void {
   
  }

  async presentAlert1(){
    const alert = await this.alertController.create({
      header: "Aviso",
      message: "La maquina se registro correctamente",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard/maquinarias/maquinarias-list');
          setTimeout(() => {
            window.location.reload();
          }, 10); // Puedes ajustar el tiempo de espera según sea necesario
        }
      }]
    });
    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
