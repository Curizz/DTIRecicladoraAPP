import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProduccionEmpleadoService } from '../produccion-empleado.service';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-produccion-empleado-edit',
  templateUrl: './produccion-empleado-edit.component.html',
  styleUrls: ['./produccion-empleado-edit.component.scss'],
})
export class ProduccionEmpleadoEditComponent  implements OnInit {

  formularioProduccionAreaDetails: FormGroup;
  maquinarias: any[] = [];
  inventariosSalida: any[] = [];
  productosEntrada: any[]=[];
  idDetails:any;
  idAreaSeleccionada: any;

  areaNombre: string | null = '';
  usuarioTienePermisoAdmin: boolean= false;
  usuario: string | null = '';
  usuarioNombre: string | null= '';
  usuarioCorreo: string | null= '';
  areas: any[]=[];
  elID:any;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private produccionEmpleadoService: ProduccionEmpleadoService,
    public toastController:ToastController,
    public alertController: AlertController
  ) { 
    const idUserSave = this.produccionEmpleadoService.getId();
    const nombreSave = this.produccionEmpleadoService.getNombre();
    const correoSave = this.produccionEmpleadoService.getCorreo();
    this.formularioProduccionAreaDetails = this.formBuilder.group({
      FechaFin: ['',Validators['required']],
      idInventarioFabrica: [''],
      HoraInicio: [''],
      idMaquinaria: ['ValorPorDefecto'],
      UnidadesInsumo: [''],
      idProductosalida: [''],
      KgProduccion: [''],
      HoraFin:[''],
      UsuarioActualizador : [correoSave],
       /*HoraFin: [''],
      Turno: [''],
     
      KgProduccion: [''],
      idMaquinaria: ['ValorPorDefecto'],
      idArea: [''],
      nombreArea: [''],
      turnousuario:[''],
      idInventarioFabrica: [''],
      idProductosalida: [''],
      UsuarioCreador:[''],
      idUsuario : [''],
      // idEmpleado: [''],
      
     */
    })

  }


  CANCELAR(){
    this.router.navigateByUrl('/dashboard/produccion-empleado/produccionEmpleado-list');
  }
  ngOnInit(): void {
     // console.log('AQUI ABAJO SE MOSTRARIA EL CORREO QUE SE TRAE DESDE EL LOCALSTORAGE');
     const correoSave = this.produccionEmpleadoService.getCorreo();
     console.log('Correo desde el localStorage: ', correoSave);

     // console.log('AQUI ABAJO SE MOSTRARIA EL NOMBRE QUE SE TRAE DESDE EL LOCALSTORAGE');
     const nombreSave = this.produccionEmpleadoService.getNombre();
     console.log('Nombre desde el localStorage: ', nombreSave);

     // console.log('AQUI ABAJO SE MOSTRARIA EL ID QUE SE TRAE DESDE EL LOCALSTORAGE');
     const idUserSave = this.produccionEmpleadoService.getId();
     console.log('ID desde el localStorage: ', idUserSave);
     this.idDetails=this.activatedRoute.snapshot.paramMap.get('id');
     console.log('Obtenemos el ID de la produccion: ', this.idDetails);

     this.produccionEmpleadoService.verDetallesProduccionArea(this.idDetails).subscribe(respuesta =>
      {
      console.log('Respuesta de procedimiento', respuesta);

      if( respuesta && typeof respuesta === 'object'){
        try{
          this.formularioProduccionAreaDetails.setValue({
            FechaFin: respuesta.FechaFin,
            HoraInicio: respuesta.HoraInicio,
            idInventarioFabrica: respuesta.idInventarioFabrica.toString(),
            UnidadesInsumo: respuesta.UnidadesInsumo,
            idProductosalida: respuesta.idProductosalida.toString(),
            KgProduccion: respuesta.KgProduccion,
            HoraFin: respuesta.HoraFin,
            UsuarioActualizador: respuesta.UsuarioActualizador || correoSave,
            idMaquinaria: ['0']
          });
          this.idAreaSeleccionada = respuesta.idArea.toString();
          this.produccionEmpleadoService.getMaquinas(this.idAreaSeleccionada).subscribe(
            (data1) => {
              this.maquinarias = data1;
              console.log('Maquinarias:', this.maquinarias);
              // Asegúrate de que haya máquinas
              if (this.maquinarias && this.maquinarias.length > 0) {
                // Encuentra la máquina correspondiente en la lista y obtén su ID
                const maquinaSeleccionada = this.maquinarias.find(m => m.idMaquinaria === respuesta.idMaquinaria);  
                // Si encontramos la máquina, actualiza el valor de idMaquinaria
                if (maquinaSeleccionada) {
                  this.formularioProduccionAreaDetails.patchValue({
                    idMaquinaria: maquinaSeleccionada.idMaquinaria,
                  });
                } else {
                  console.warn('No se encontró la máquina correspondiente en la lista.');
                }
              }
          },
          (error) => {
            console.error('Error al obtener las máquinas:', error);
          }
        );
        } catch (error) {
          console.error('Error al deserializar los datos JSON:', error);
        }
      } else {
        console.error('No se encontraron datos válidos para el ID proporcionado.');
        // Aquí puedes mostrar un mensaje de error al usuario o redirigir a una página de error.
      }
    }
    , error => {
      console.log('ERRRO DE LA SOLICITUD: ', error);
    }
  );

  this.usuario = localStorage.getItem("id_user");
  console.log('ID del usuario logueado: ', this.usuario);

 /* this.usuarioNombre = localStorage.getItem("Nombre");
  console.log('Nombre', this.usuarioNombre);*/

  this.usuarioCorreo = localStorage.getItem("Correo");
  console.log('Correo del usuario logueado: ', this.usuarioCorreo);

  /*  this.produccionEmpleadoService.getMaquinas(this.idAreaSeleccionada).subscribe((data1)=>{
      this.maquinarias =data1
    }
    );*/

 /* this.produccionEmpleadoService.selectMaquinaria().subscribe((data)=>{
    this.maquinarias=data;
  });*/

  this.produccionEmpleadoService.selectAreas().subscribe((data)=>{
    this.areas=data;
  });

   //
   this.produccionEmpleadoService.selectInventarioSalida().subscribe((data)=>{
    this.inventariosSalida=data;
  })

  // Obtenemos los nombres de los registros de la tabla productos
  this.produccionEmpleadoService.selectProductoEntrada().subscribe((data)=>{
    this.productosEntrada=data;
  })
}



enviarDatosActualizar(){
  if(this.formularioProduccionAreaDetails.valid){
  console.log('Datos que se enviaran: ', this.formularioProduccionAreaDetails.value);
  this.produccionEmpleadoService.actualizarProduccionAreaproceso(this.idDetails, this.formularioProduccionAreaDetails.value).subscribe(

  )
  }
  else{
    this.presentAlert1();
  }
}

async presentAlert1() {
  const alert = await this.alertController.create({
    header: 'ERROR',
    message: 'Debe de llenar todos los campos',
    buttons: [{
      text: 'Aceptar',
    }],
    cssClass: 'error-header'
  });
  await alert.present();
  let result = await alert.onDidDismiss();
  console.log(result);
}


}
