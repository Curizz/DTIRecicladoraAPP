import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AreasService } from '../areas.service';
import { ModalController } from '@ionic/angular';
import { AvisoDialogComponent } from 'src/app/avisos/aviso-dialog/aviso-dialog.component';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-areas-edit',
  templateUrl: './areas-edit.component.html',
  styleUrls: ['./areas-edit.component.scss'],
})
export class AreasEditComponent implements OnInit {
  formularioAreas: FormGroup;
  idRecibidoArea: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private areasService: AreasService,
    private modalController: ModalController,
    public toastController:ToastController,
    public alertController: AlertController
  ) {
    const correoSave = this.areasService.getCorreo();
    this.formularioAreas = this.formBuilder.group({
      NombreArea: [''],
      DescripcionArea: [''],
      EstadoArea: [''],
      UsuarioActualizador: [correoSave],
    });
    this.activeRoute.paramMap.subscribe((params) => {
      this.idRecibidoArea = params.get('id');
      console.log('ID Recibido:', this.idRecibidoArea);
      this.areasService.consultarArea(this.idRecibidoArea).subscribe(respuesta => {
        console.log('Respuesta del servicio:', respuesta);
        if (respuesta && typeof respuesta === 'object') {
          try {
            this.formularioAreas.setValue({
              NombreArea: respuesta.NombreArea || '',
              DescripcionArea: respuesta.DescripcionArea || '',
              EstadoArea: respuesta.EstadoArea || '',
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

  enviarDatosActualizar() {
    if (this.formularioAreas.valid) {
      console.log('Formulario:', this.formularioAreas.value);
      console.log('id rec', this.idRecibidoArea);
      console.log('Datos que se enviarán:', this.formularioAreas.value);

      this.areasService.actualizarArea(this.idRecibidoArea, this.formularioAreas.value).subscribe(
        (response) => {
          console.log('Respuesta del servidor:', response);
          if (response.success === 1) {
            console.log('La actualización fue exitosa');
            const areaActualizada = response.data;
            console.log('Datos del área actualizada:', areaActualizada);
            this.presentAlert1();
          } else {
            console.error('Error al actualizar la área:', response.error);
          }
        },
        (error) => {
          console.error('Error al actualizar la máquina con error:', error);
        }
      );
    }
  }

  CANCELAR() {
    this.router.navigateByUrl('/dashboard/areas/areas-list');
  }

  async mostratDialogoAviso(mensaje: string): Promise<void> {
  const modal = await this.modalController.create({
    component: AvisoDialogComponent,
    componentProps: {
      message: mensaje
    }
  });

  modal.onDidDismiss().then(() => {
    this.router.navigateByUrl('/dashboard/areas/areas-list').then(() => {
      // Recargar la página después de redirigir
      window.location.reload();
    });
  });

  return await modal.present();
}

  ngOnInit() { }


async presentAlert(){
  const toast = await this.toastController.create({
    message: 'Se actualizo el area',
    duration: 500,
    position: "middle"
  });
  toast.present()
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
