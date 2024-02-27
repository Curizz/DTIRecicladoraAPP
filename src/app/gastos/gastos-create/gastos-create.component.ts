import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { GastosService } from '../gastos.service';
import { AlertController } from '@ionic/angular';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-gastos-create',
  templateUrl: './gastos-create.component.html',
  styleUrls: ['./gastos-create.component.scss'],
})
export class GastosCreateComponent  implements OnInit {

  formularioGastos: FormGroup = this.formBuilder.group({
    Concepto: ['', [Validators.required]],
    Descripcion: ['', [Validators.required]],
    Periodo: ['', [Validators.required]],
    Monto:['', [Validators.required, this.noNegativoValidator]],
   
    Tipo:['', [Validators.required]],
    Area: [this.gastosService.getidArea() || ''],
    Maquina: [''],
    UsuarioCreador:[this.gastosService.getCorreo()],
    Fabrica: [this.gastosService.getidFabrica()],
    areaNombre:[this.gastosService.getArea()],
    TipoServicio:[''],
    idUsuario:[this.gastosService.getidUsuario()]
  });
  areaNombre:  string | null='';
  empresas: any[]=[];
  areas:   any[]=[];
  maquina: any[]=[];
  servicio: any[]=[];
  idTemporal="";
  usuarioSupervisor:boolean=false;
  usuarioSuper:boolean=false;
  usuarioAdmin:boolean=false;
  public isMaquinaErrorVisible: boolean = false;
  public isTipoServicioErrorVisible: boolean = false;
  public tipoServicioVisible: boolean | null = null;
  public maquinaVisible: boolean | null = null;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private gastosService: GastosService,
    public alertController: AlertController
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

  CANCELAR(){
    this.router.navigateByUrl('dashboard/gastos/gastos-list');
  }

  enviarDatos(): void{
    console.log('Enviando datos...');
    this.actualizarVisibilidadmaquina(); //
    if(this.isMaquinaVisible()){
      console.log('Es visilble');
      const maquinaControl = this.formularioGastos.get('Maquina');
      if (maquinaControl) {
        maquinaControl.setValidators([this.maquinaRequeridaValidator]);
        maquinaControl.updateValueAndValidity();
      }
    
    if (this.formularioGastos.valid) {
      console.log('Se presionó el botón');
      console.log('Formulario válido');
      console.log(this.formularioGastos.value);
      this.gastosService.agregargasto(this.formularioGastos.value).subscribe(
        (response) => {
         console.log('Respuesta del servidor: ', response);

        if (response.success === 1) {
          console.log('Se registro correctamente');
          this.mostratDialogoAviso();
        } else {
          console.error('Error al registrar en la Base de Datos', response.error);
          this.mostrarDialogError();
        }
        },
        (error) => {
          // Manejar errores del servicio aquí
          this.mostrarDialogError();
        }
      );
    }else{
      console.log('Formulario no válido');
      console.log(this.formularioGastos.value);
      this.mostrarAlertaCamposFaltantes();
    }
  }
  else
    {
      console.log('no es visible');
      if (this.formularioGastos.valid) {
        console.log('Se presionó el botón');
        console.log('Formulario válido');
        console.log(this.formularioGastos.value);
        this.gastosService.agregargasto(this.formularioGastos.value).subscribe(
          (response) => {
           console.log('Respuesta del servidor: ', response);
          if (response.success === 1) {
            console.log('Se registro correctamente');
            this.mostratDialogoAviso();
          } else {
            console.error('Error al registrar en la Base de Datos', response.error);
            this.mostrarDialogError();
          }
          },
          (error) => {
            // Manejar errores del servicio aquí
            this.mostrarDialogError();
          }
        );
      }else{
        console.log('Formulario no válido');
        console.log('No se pudieron cargar los datos...')
        console.log(this.formularioGastos.value);
        this.mostrarAlertaCamposFaltantes();
      }
    }
  }


  mostrarAlertaCamposFaltantes() {
    let camposFaltantes = 'Los siguientes campos son obligatorios:';
  
    // Iterar sobre los controles del formulario para encontrar los campos obligatorios faltantes
    Object.keys(this.formularioGastos.controls).forEach(controlName => {
      const control = this.formularioGastos.get(controlName);
  
      // Verificar si el control es obligatorio y está vacío
      if (control?.errors?.hasOwnProperty('required')) {
        camposFaltantes += `\n ${controlName}`;
      }
    });
  
    // Mostrar el alerta con los campos faltantes
    this.mostrarAlerta('Campos obligatorios', camposFaltantes);
  }
  

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }

  async mostratDialogoAviso() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Se registró correctamente en la Base de Datos',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('/dashboard/gastos/gastos-list');
            setTimeout(() => {
              window.location.reload();
            }, 5); // Puedes ajustar el tiempo de espera según sea necesario
          }
        }
      ]
    });
  
    await alert.present();
  }

  async mostrarDialogError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un error al registrar en la Base de Datos',
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }

  ngOnInit(): void {

    this.usuarioSupervisor = this.verificarPuestoUser();
    this.usuarioSuper = this.verificarPermisosDelUsuarioSuper();
    this.usuarioAdmin = this.verificarPermisosDeladmin();
    this.areaNombre = localStorage.getItem("NombreArea");
    const idFabrica = this.gastosService.getidFabrica();
    const correoSave2 = this.gastosService.getCorreo();
    const idAreaUser = this.gastosService.getidArea();
    const areaname = this.gastosService.getArea();
    const idUsuario = this.gastosService.getidUsuario();
    this.formularioGastos = this.formBuilder.group({
      Concepto: ['', [Validators.required]],
      Descripcion: ['', [Validators.required]],
      Periodo: ['', [Validators.required]],
      Monto:['', [Validators.required, this.noNegativoValidator]],
      Tipo:['', [Validators.required]],
      Area: [idAreaUser || ''],
      Maquina: [''],
      UsuarioCreador:[correoSave2],
      Fabrica: [idFabrica],
      areaNombre:[areaname],
      TipoServicio:[''],
      idUsuario:[idUsuario],
     
    });
    
    console.log('ID: ', this.areaNombre);
    console.log('AQUI ABAJO SE MOSTRARIA EL idArea QUE SE TRAE DESDE EL LOCALSTORAGE');
    const idArea = this.gastosService.getidArea();
    console.log('El areas desde el localStorage: ', idArea);

    this.gastosService.getAreas().subscribe((data) => {
      this.areas = data;
      //this.formularioGastos.get('Area')?.disable();
    });
    
     // TRAEMOS EL CORREO DESDE EL SERVICIO
    console.log('AQUI ABAJO SE MOSTRARIA EL CORREO QUE SE TRAE DESDE EL LOCALSTORAGE');
    const correoSave = this.gastosService.getCorreo();
    console.log('Correo desde el localStorage: ', correoSave);
    console.log('AQUI ABAJO SE MOSTRARIA EL NOMBRE QUE SE TRAE DESDE EL LOCALSTORAGE');
    const nombreSave = this.gastosService.getNombre();
    console.log('Nombre desde el localStorage: ', nombreSave);

    this.areaNombre = localStorage.getItem("NombreArea");
    console.log('ID: ', this.areaNombre);
    console.log('area desde el localStorage: ', idArea);

    
    // Verifica que usuarioSupervisor tenga el valor correcto
    console.log('Valor de usuarioSupervisor:', this.usuarioSupervisor);

    
    this.gastosService.getEmpresas().subscribe((data2) => {
      this.empresas = data2;
    });

    this.gastosService.getServicio().subscribe((data2) =>{
      this.servicio = data2;
    });
    
  
    if (this.usuarioSupervisor) {
      // Encargado de Área
      this.gastosService.getMaquinas(idArea).subscribe((data2) => {
        this.maquina = data2;
        console.log('Aqui se ponen las maquinas');
      });
    } else if (this.usuarioAdmin || this.usuarioSuper) {
      // Administrador o SuperAdministrador
      this.gastosService.getmaquinaria().subscribe((data1) => {
        this.maquina = data1;
        console.log('Aqui se ponen las maquinas 2');
      });
    }

    this.formularioGastos.get('Tipo')?.valueChanges.subscribe(() => {
      this.actualizarVisibilidadmaquina();
    });

    this.formularioGastos.get('Tipo')?.valueChanges.subscribe(() => {
      // Restablecer los valores de los controles dependientes
      this.formularioGastos.get('Maquina')?.reset(); // Reiniciar el valor de Maquina
      this.formularioGastos.get('TipoServicio')?.reset(); // Reiniciar el valor de TipoServicio
      this.servicio = []; // Limpiar el array de servicios
    });

  }

  validarPrecio(control: AbstractControl): { [key: string]: any } | null {
    const precio = control.value;
    const precioRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!precioRegex.test(precio)) {
      return { 'invalidPrecio': true };
    }
    return null;
  }

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
                console.log(element.Peso);
                console.log(element.Fecha);

                // Agregar cada elemento al array de servicios
                this.servicio.push({
                    idServicio: element.idServicio,
                    NombreServicio: element.NombreServicio
                });
            });
        }
    }, (err) => {
        console.log('Error al obtener datos de la máquina:',err);
    });
}


  // Validador personalizado para valores no negativos
  noNegativoValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    if (value !== null && value !== undefined && value < 0) {
      return {
        noNegativo: true
      };
    }

    return null;
  }

  public isMaquinaDisabled(): boolean {
    const maquinaControl = this.formularioGastos.get('Maquina') as FormControl;
    const tipoControl = this.formularioGastos.get('Tipo') as FormControl;
  
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
    const tipoControl = this.formularioGastos.get('Tipo') as FormControl;
    const maquinaControl = this.formularioGastos.get('Maquina') as FormControl;
  
    // Verificar las condiciones para mostrar el campo dinámicamente
    const isVisible = tipoControl?.value === 'Gasto Maquinaria' || tipoControl?.value === 'Gasto Servicios';
  
    return isVisible;
  }

  public isTipoServicioVisible(): boolean | null {
    const tipoControl = this.formularioGastos.get('Tipo') as FormControl;
    const maquinaControl = this.formularioGastos.get('Maquina') as FormControl;
  
    const isTipoServiciosSelected = tipoControl?.value === 'Gasto Servicios';
    const isMaquinaSelected = maquinaControl?.value !== null && maquinaControl?.value !== '';
  
    return isTipoServiciosSelected && isMaquinaSelected ? true : null;
  }
 
  
public actualizarVisibilidad(): void {
  this.tipoServicioVisible = this.isTipoServicioVisible();
  // Si el tipo de servicio no es visible, restablecer el formulario
  if (!this.tipoServicioVisible) {
    this.formularioGastos.get('TipoServicio')?.reset();
  }
}
  public actualizarVisibilidadmaquina(): void {
    this.maquinaVisible = this.isMaquinaVisible();
  
    // Si el tipo de servicio no es visible o Maquina no es visible, establecer el valor de Maquina en null
    if (!this.maquinaVisible) {
      this.formularioGastos.get('Maquina')?.reset();
    }
  }
}
