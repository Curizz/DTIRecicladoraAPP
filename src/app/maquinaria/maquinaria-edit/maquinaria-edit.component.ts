import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MaquinasService } from '../maquinaria.service';
import { ModalController } from '@ionic/angular';
import { AvisoDialogComponent } from 'src/app/avisos/aviso-dialog/aviso-dialog.component';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-maquinaria-edit',
  templateUrl: './maquinaria-edit.component.html',
  styleUrls: ['./maquinaria-edit.component.scss'],
})
export class MaquinariaEditComponent  implements OnInit {
  areas: any[]=[];
  formularioMaquina2: FormGroup;
  idRecibido:any;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private maquinaservice: MaquinasService,
    private modalController: ModalController,
    public toastController:ToastController,
    public alertController: AlertController
  ) { 
    this.maquinaservice.getAreas().subscribe((data) => {
      this.areas = data;
    });
    const correoSave = this.maquinaservice.getCorreo();
    this.formularioMaquina2 = this.formBuilder.group({
      Numero: [''],
      Serie: [''],
      Modelo: [''],
      Descripcion: [''],
      Estado: [''],
      Area: [''],
      UsuarioActualizador: [correoSave],
    });
    this.activeRoute.paramMap.subscribe((params) => {
      this.idRecibido = params.get('id');
      console.log('ID Recibido:', this.idRecibido);
      this.maquinaservice.consultarmaquina(this.idRecibido).subscribe(respuesta => {
        console.log('Respuesta del servicio:', respuesta);
        if (respuesta && typeof respuesta === 'object') {
          try {
            this.formularioMaquina2.setValue({
              Serie: respuesta.Serie || '',
              Numero: respuesta.Numero || '',
              Modelo: respuesta.Modelo || '',
              Descripcion: respuesta.Descripcion || '',
              Estado: respuesta.Estado || '',
              Area: respuesta.Area.toString(),
              UsuarioActualizador: respuesta.UsuarioActualizador || correoSave
            });
          } catch (error) {
            console.error('Error al asignar los datos JSON:', error);
          }
        } else {
          console.error('No se encontraron datos válidos para el ID proporcionado.');
        }
      });
    });
  }

  ngOnInit() {}

  CANCELAR() {
    this.router.navigateByUrl('/dashboard/maquinarias/maquinarias-list');
  }

  enviarDatos() {
    if (this.formularioMaquina2.valid) {
      console.log('Formulario:', this.formularioMaquina2.value);
      console.log('id rec', this.idRecibido);
      console.log('Datos que se enviarán:', this.formularioMaquina2.value);

     this.maquinaservice.actualizarMaquina(this.idRecibido, this.formularioMaquina2.value).subscribe(
    (response) => {
        console.log('Respuesta del servidor:', response);

        if (response.success === 1) {
            console.log('La actualización fue exitosa');
            // Accede a los datos actualizados
            const maquinaActualizada = response.data;
            console.log('Datos de la máquina actualizada:', maquinaActualizada);

            this.presentAlert1();
        } else {
            console.error('Error al actualizar la máquina:', response.error);
            // Manejar errores del servicio aquí
        }
    },
    (error) => {
        console.error('Error al actualizar la máquina con error:', error);
    }
);

    }
    
  }
  
async presentAlert1(){
  const alert = await this.alertController.create({
    header: "Actualizacion",
    message: "Se actualizo correctamente el área",
    buttons: [{
      text: 'Aceptar',
      handler: () => {
        this.router.navigateByUrl('/dashboard/areas/areas-list');
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
