import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl, Validators} from '@angular/forms';
import  { Router,ActivatedRoute } from '@angular/router';
import { GastosService } from '../gastos.service'; 
import { AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Estado } from '../estado';
@Component({
  selector: 'app-gastos-edit',
  templateUrl: './gastos-edit.component.html',
  styleUrls: ['./gastos-edit.component.scss'],
})
export class GastosEditComponent {

  formularioEditarGastos : FormGroup = this.formBuilder.group({
    Concepto: ['', [Validators.required]],
    Descripcion: ['', [Validators.required]],
    Periodo: ['', [Validators.required]],
    Monto:['', [Validators.required, this.noNegativoValidator]],
    Tipo:['', [Validators.required]],
    Maquina: [''],
    TipoServicio:[''],
    Estado:[''],
    UsuarioActualizador:[this.gastosService.getCorreo()]
  });
  Estado:any;
  maquina: any[]=[];
  idGasto: any; // ID del registro a editar
  areaNombre:  string | null = '';
  servicio: any[]=[];
  usuarioAdmin:boolean=false;
  usuarioSupervisor:boolean=false;
  usuarioSuper:boolean=false;
  idTemporal="";
  public maquinaVisible: boolean | null = null;
  public tipoServicioVisible: boolean | null = null;
  public isMaquinaErrorVisible: boolean = false;
  public isTipoServicioErrorVisible: boolean = false;
  recargarpagina: boolean=false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private formBuilder: FormBuilder,
    private gastosService: GastosService,
    private alertController: AlertController 
  ) 
  {
   
   }

  private verificarPuestoUser(): boolean{
    const puesto = localStorage.getItem("Puesto");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ((puesto === "Encargado de Área") ); 
  }

  private verificarPermisosDelUsuarioSuper(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ( (nombreUsuario === "SuperAdministrador" )); // Ejemplo: el usuario con rol "admin" tiene permiso
  }

  private verificarPermisosDeladmin(): boolean {
    const nombreUsuario = localStorage.getItem("NombreTipoUser");
    // Realiza la lógica para determinar si el usuario tiene permiso basado en su rol
    return ( (nombreUsuario === "Administrador")); // Ejemplo: el usuario con rol "admin" tiene permiso
  }



  enviarDatos(){
    console.log('Datos que se enviaran',this.formularioEditarGastos.value);
    const estadogasto =this.formularioEditarGastos.get('Estado')?.value;
    console.log('Estado del gasto:', estadogasto);
    if(estadogasto === 'Aprobada'){

      this.mostrarDialogError1('No se puede actualizar el gasto porque ya fue aprobada');
    }
    else if(estadogasto === 'En proceso'){

      this.mostrarDialogError1('No se puede actualizar el gasto porque esta en proceso de aprobación');
    }
    else{
     
      if(this.formularioEditarGastos.valid){
        console.log('este es el formulario', this.formularioEditarGastos.value);
        console.log('este es el id a actualizar',this.idGasto);
        this.gastosService.actualizargasto(this.idGasto,this.formularioEditarGastos.value).subscribe(
          (response)=>{
            console.log('Respuesta del servidor: ', response);
            if (response.success === 1) {
             console.log('Se actualizo correctamente');
             const controlActualizado = response.data;
             console.log('Datos del gasto actualizado: ', controlActualizado);
             this.mostrarDialogoAviso(response.data);
            } else {
             console.error('Error al actualizar el gasto: ', response.error);
            }
          },
          (error) => {
            // Manejar errores del servicio aquí7
            console.error('Error al actualizar el gasto: ', error);
          }
        );
      }
    }
  }

  CANCELAR(){
    this.router.navigateByUrl('dashboard/gastos/gastos-list');
  }
 
  async mostrarDialogError1(message:string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }


  ionViewWillEnter() {
    this.usuarioSupervisor = this.verificarPuestoUser();
    this.usuarioSuper = this.verificarPermisosDelUsuarioSuper();
    this.usuarioAdmin = this.verificarPermisosDeladmin();
    const idArea = this.gastosService.getidArea();
    this.areaNombre = localStorage.getItem("NombreArea");
  
    // Mostrar alert de carga
    const loadingAlert = this.alertController.create({
      message: 'Cargando...', // Mensaje de carga
    });
    loadingAlert.then(alert => alert.present()); // Mostrar alerta de carga
  
    if (this.usuarioSupervisor) {
      this.gastosService.getMaquinas(idArea).subscribe((data) => {
        this.maquina = data; 
      });
    } else if (this.usuarioAdmin || this.usuarioSuper) {
      this.gastosService.getmaquinaria().subscribe((data) => {
        this.maquina = data;
      });
    } else {
      const idArea1 = localStorage.getItem("idArea");
      this.gastosService.getMaquinas(idArea1).subscribe((data) => {
        this.maquina = data;
      });
    }
  
    const correoSave = this.gastosService.getCorreo();
    this.activatedRoute.paramMap.subscribe((params) => {   
      this.idGasto = params.get('id');
    });
  
    this.gastosService.consultargasto(this.idGasto).subscribe(respuesta => {
      if (respuesta && typeof respuesta === 'object') {
        try {
          this.llenarServicios(respuesta.Maquina, respuesta, correoSave); // Llenar el select de servicio después
  
          // Asignar valores al formulario
          this.formularioEditarGastos.setValue({
            Concepto: respuesta.Concepto,
            Descripcion: respuesta.Descripcion,
            Periodo: respuesta.Periodo,
            Monto: respuesta.Monto,
            Tipo: respuesta.Tipo,
            Maquina: respuesta.Maquina ? respuesta.Maquina.toString() : '',
            Estado: respuesta.Estado,
            TipoServicio: respuesta.TipoServicioGasto ? respuesta.TipoServicioGasto.toString() : '',
            UsuarioActualizador: respuesta.UsuarioActualizador || correoSave
          });
  
          // Cerrar alerta de carga
          loadingAlert.then(alert => alert.dismiss());
        } catch (error) {
          console.error('Error:', error);
          // En caso de error, también cerrar la alerta de carga
          loadingAlert.then(alert => alert.dismiss());
        }
      }
    });
  }
  
  getColorClass(estado: string): string {
    switch (estado) {
      case 'Aprobada':
        return 'aprobada';
      case 'Rechazada':
        return 'rechazada';
      case 'En proceso':
        return 'en-proceso';
      default:
        return '';
    }
  }
  
  ionViewDidEnter(): void {
    

  }

  //cada vez que se mueva el select se va llenar el select
  llenardatos(event: any) {
    console.log('Evento:', event);
    this.idTemporal = event.detail.value;
    console.log('idTemporal:', this.idTemporal);
    this.actualizarVisibilidadmaquina();
    this.gastosService.getservicioMaquina(this.idTemporal).subscribe((data: any) => {
      if (data !== 201) {
        console.log(data);
        // Limpiar el array de servicios antes de agregar nuevos elementos
        this.servicio = [];
        data.forEach((element: any) => {
          this.servicio.push({
            idServicio: element.idServicio,
            NombreServicio: element.NombreServicio
          });
        });
        // Después de obtener los datos, selecciona el servicio en el formulario si es necesario
        if (this.servicio.length > 0) {
          const tipoServicioControl = this.formularioEditarGastos.get('TipoServicio');
          if (tipoServicioControl) {
            tipoServicioControl.setValue(this.servicio[0].idServicio); // Aquí puedes establecer el valor predeterminado según tus necesidades
          }
        }
      }
    }, (err) => {
      console.log('Error al obtener datos de la máquina:',err);
    });
  }

  llenarServicios(maquinaid:any,respuesta:any,correoSave:any){
    this.idTemporal = maquinaid;
    console.log('ID temporal:', this.idTemporal); // Agregar registro de consola
    this.actualizarVisibilidadmaquina();
    this.gastosService.getservicioMaquina(this.idTemporal).subscribe((data: any) => {
      if (data !== 201) {
        console.log('Datos del servicio:', data); // Agregar registro de consola
        // Limpiar el array de servicios antes de agregar nuevos elementos
        this.servicio = [];
        data.forEach((element: any) => {
          this.servicio.push({
            idServicio: element.idServicio,
            NombreServicio: element.NombreServicio
          });
        });
     
      }
    }, (err) => {
      console.log('Error al obtener datos de la máquina:', err);
    });
  }


// Método para seleccionar el tipo de servicio en el formulario
seleccionarTipoServicio(tipoServicioId: number): void {
  const tipoServicioControl = this.formularioEditarGastos.get('TipoServicio');
  if (tipoServicioControl) {
    tipoServicioControl.setValue(tipoServicioId);
  }
}


  noNegativoValidator(control: AbstractControl) {
    const value = control.value;
  
    if (value < 0) {
      return {
        noNegativo: true
      };
    }
  
    return null;
  }

  public isMaquinaDisabled(): boolean {
    const maquinaControl = this.formularioEditarGastos.get('Maquina') as FormControl;
    const tipoControl = this.formularioEditarGastos.get('Tipo') as FormControl;
  
    // Verificar las condiciones para deshabilitar el campo dinámicamente
    return !(tipoControl?.value === 'Gasto Maquinaria' || tipoControl?.value === 'Gasto Servicios');
  }

  maquinaRequeridaValidator(control: AbstractControl) {
    const maquinaValue = control.value;
  
    // Verificar si el valor es nulo o cadena vacía
    if (maquinaValue !== null && maquinaValue !== '') {
      return null;  // No hay error si el campo tiene un valor
    }
    
    // Devuelve el error solo si Maquina no es null ni una cadena no vacía
    return {
      maquinaRequerida: true
    };
  }

  public isMaquinaVisible(): boolean {
    const tipoControl = this.formularioEditarGastos.get('Tipo') as FormControl;
   
  
    // Verificar las condiciones para mostrar el campo dinámicamente
    const isVisible = tipoControl?.value === 'Gasto Maquinaria' || tipoControl?.value === 'Gasto Servicios';
  
    return isVisible;
  }

  public isTipoServicioVisible(): boolean | null {
    const tipoControl = this.formularioEditarGastos.get('Tipo') as FormControl;
    const maquinaControl = this.formularioEditarGastos.get('Maquina') as FormControl;
    const isTipoServiciosSelected = tipoControl?.value === 'Gasto Servicios';
    const isMaquinaSelected = maquinaControl?.value !== null && maquinaControl?.value !== '';
    return isTipoServiciosSelected && isMaquinaSelected ? true : null;
  }
 
  
  public actualizarVisibilidad(): void {
    this.tipoServicioVisible = this.isTipoServicioVisible();
    // Si el tipo de servicio no es visible, restablecer el formulario
    if (!this.tipoServicioVisible) {
      this.formularioEditarGastos.get('TipoServicio')?.reset();
    }
  }

  public actualizarVisibilidadmaquina(): void {
    this.maquinaVisible = this.isMaquinaVisible();
  
    // Si el tipo de servicio no es visible o Maquina no es visible, establecer el valor de Maquina en null
    if (!this.maquinaVisible) {
      this.formularioEditarGastos.get('Maquina')?.reset();
    }
  }


  async UPDATEAPROBAR() {
    console.log('Se presionó el botón de aprobar');
    const idGastoEstado = this.idGasto;
    const Aprobador = this.gastosService.getCorreo();
    const estado: Estado = {
      idGasto: idGastoEstado,
      estado: 'Aprobada',
      usuarioAprobador: Aprobador
    };
  
    const confirmationAlert = await this.alertController.create({
      header: 'Confirmar aprobación',
      message: '¿Estás seguro de que deseas aprobar este gasto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Aprobación cancelada');
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {
            // Mostrar el alert de carga
            const loadingAlert = await this.alertController.create({
              message: 'Cargando...',
              translucent: true
            });
            await loadingAlert.present();
            // Llamar al servicio para aprobar la solicitud
            this.gastosService.aprobarorechazarSoli(estado).subscribe(
              async response => {
                console.log('Respuesta del servidor:', response); 
                // Cerrar el alert de carga
                await loadingAlert.dismiss();
                if (response && response.success) {
                  if (response.success === 1) {
                    console.log('Estado del gasto actualizado correctamente');
                    this.mostrarDialogoAviso(response.mensaje);
                  } else if (response.success === 2) {
                    console.log('El gasto ya ha sido aprobado o rechazado');
                    this.mostrarDialogError('Esta acción no se puede realizar porque. ' + response.mensaje);
                  } else {
                    console.log('Hubo un problema, no se pudo actualizar el estado');
                    this.mostrarDialogError(response.mensaje);
                  }
                } else {
                  console.log('Respuesta desconocida:', response);
                  this.mostrarDialogError('Respuesta desconocida del servidor');
                }
              },
              async error => {
                console.error('Error en la solicitud:', error);
    
                // Cerrar el alert de carga
                await loadingAlert.dismiss();
    
                this.mostrarDialogError('Hubo un error en el gasto al servidor');
              }
            );
          }
        }
      ]
    });
  
    await confirmationAlert.present();
  }
  
  async UPDATERECHAZAR() {
    console.log('Se presionó el botón de rechazar');
    const idGastoEstado = this.idGasto;
    const Aprobador = this.gastosService.getCorreo();
    const estado: Estado = {
      idGasto: idGastoEstado,
      estado: 'Rechazada',
      usuarioAprobador: Aprobador
    };

    const confirmationAlert = await this.alertController.create({
      header: 'Confirmar rechazo',
      message: '¿Estás seguro de que deseas rechazar este gasto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Rechazo cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            // Mostrar el alert de carga
            this.presentLoadingAlert();
            // Llamar al servicio para aprobar o rechazar la solicitud
            this.gastosService.aprobarorechazarSoli(estado).subscribe(
              async response => {
                console.log('Respuesta del servidor:', response);
                // Cerrar el alert de carga
                await this.dismissLoadingAlert();
                if (response && response.success) {
                  if (response.success === 1) {
                    console.log('Estado del gasto actualizado correctamente');
                    this.mostrarDialogoAviso(response.mensaje);
                  } else if (response.success === 2) {
                    console.log('El gasto ya ha sido aprobada o rechazada');
                    this.mostrarDialogError('Esta acción no se puede realizar porque. ' + response.mensaje);
                  } else {
                    console.log('Hubo un problema, no se pudo actualizar el estado');
                    this.mostrarDialogError(response.mensaje);
                  }
                } else {
                  console.log('Respuesta desconocida:', response);
                  this.mostrarDialogError('Respuesta desconocida del servidor');
                }
              },
              async error => {
                console.error('Error en el gasto:', error);
                // Cerrar el alert de carga
                await this.dismissLoadingAlert();
                this.mostrarDialogError('Hubo un error en el gasto al servidor');
              }
            );
          }
        }
      ]
    });

    await confirmationAlert.present();
  }

  
  async presentLoadingAlert() {
    const loadingAlert = await this.alertController.create({
      message: 'Cargando...',
      translucent: true
    });
    await loadingAlert.present();
  }

  async dismissLoadingAlert() {
    await this.alertController.dismiss();
  }

  async mostrarDialogoAviso(mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard/gastos/gastos-list');
          setTimeout(() => {
            window.location.reload();
          }, 10); // Puedes ajustar el tiempo de espera según sea necesario
        }
      }]
    });
    await alert.present();
  }

  async mostrarDialogError(mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}