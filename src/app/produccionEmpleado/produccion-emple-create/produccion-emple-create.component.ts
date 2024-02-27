import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProduccionEmpleadoService } from '../produccion-empleado.service';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-produccion-emple-create',
  templateUrl: './produccion-emple-create.component.html',
  styleUrls: ['./produccion-emple-create.component.scss'],
})
export class ProduccionEmpleCreateComponent  implements OnInit {
  areaNombre: string | null ='';
  usuarioId: string | null='';
  usuarioNombre: string | null='';
  usuarioCorreo: string | null='';
  maquinarias: any[]=[];
  areas: any[]=[];
  inventariosSalida: any[]=[];
  productosEntrada: any[]=[]; //Obtenemos los datos de la tabla productos
  formularioProduccionArea: FormGroup;
  turnousuario: any[]=[];
  readonlyValues: { usuarioNombre: string | null; usuarioCorreo: string | null; } = { usuarioNombre: null, usuarioCorreo: null };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private produccionEmpleadoService: ProduccionEmpleadoService,
    public alertController:AlertController
  ) { 
    const idUserSave = this.produccionEmpleadoService.getId();
    const nombreSave = this.produccionEmpleadoService.getNombre();
    const correoSave = this.produccionEmpleadoService.getCorreo();
    const idAreaUser = this.produccionEmpleadoService.getidArea();
    const usuarioFabrica = this.produccionEmpleadoService.getidFabrica();
    this.formularioProduccionArea = this.formBuilder.group({
      FechaFin:['',Validators.required],
      HoraInicio: [''],
      HoraFin: [''],
      Turno: [''],
      UnidadesInsumo: [''],
      KgProduccion: [''],
      idMaquinaria: [''],
      idArea: [idAreaUser || ''],
      idInventarioFabrica: [''],
      idProductosalida: [''],
      idUsuario: [idUserSave],
      UsuarioCreador : [correoSave],
      idFabrica:[usuarioFabrica]});
  }

  ngOnInit():void {
    this.areaNombre = localStorage.getItem("NombreArea");
    console.log('ID: ', this.areaNombre);
    const idArea = this.produccionEmpleadoService.getidArea();
    // TRAEMOS EL ID
    console.log('AQUI MOSTRARIAMOS EL ID TRAIDO DESDE EL SERVICE');
    const idUserSave = this.produccionEmpleadoService.getId();
    console.log('ID del Usuario desde el service: ', idUserSave);

    const usuarioId = this.usuarioId = localStorage.getItem("id_user");
    console.log('ID: ', this.usuarioId);

    // TRAEMOS EL NOMBRE
    console.log('AQUI MOSTRARIAMOS EL NOMBRE TRAIDO DESDE EL SERVICE');
    const nombreUserSave = this.produccionEmpleadoService.getNombre();
    console.log('Nombre del Usuario desde el service: ', nombreUserSave);

    this.usuarioNombre = localStorage.getItem("Nombre");
    console.log('Nombre', this.usuarioNombre);

    // TRAEMOS EL CORREO
    console.log('AQUI MOSTRARIAMOS EL COOREO TRAIDO DESDE EL SERVICE');
    const correoUserSave = this.produccionEmpleadoService.getCorreo();
    console.log('Correo del Usuario desde el service: ', correoUserSave);

    this.usuarioCorreo = localStorage.getItem("Correo");
    console.log('Correo', this.usuarioCorreo);

    //Aqui es lo de maquinas sin filtro
    /*this.produccionEmpleadoService.selectMaquinaria().subscribe((data)=>{
      this.maquinarias=data;
    });*/

    this.produccionEmpleadoService.getMaquinas(idArea).subscribe((data2)=>{
      this.maquinarias = data2
    });

    this.produccionEmpleadoService.getTurno(usuarioId).subscribe((data1)=>{
      this.turnousuario = data1;
      console.log('turno', this.turnousuario);
      this.formularioProduccionArea.patchValue({
        Turno: this.turnousuario[0]?.Turno || ''
      });
    });

    //
    this.produccionEmpleadoService.selectAreas().subscribe((data)=>{
      this.areas=data;
    });

    //
    this.produccionEmpleadoService.selectInventarioSalida1(idArea).subscribe((data)=>{
      this.inventariosSalida=data;
    })

    // Obtenemos los nombres de los registros de la tabla productos
    this.produccionEmpleadoService.selectProductoEntrada().subscribe((data)=>{
      this.productosEntrada=data;
    })
  }

    enviarDatos(){
      if (this.formularioProduccionArea.valid) {
      const formData = this.formularioProduccionArea.value;
      console.log('El formulario es ')
      console.log('Valores del formulario:', formData);}
      else{
        console.log('El formulario no es valido')
      }
      console.log('Se presionó el botón de registrar');
      console.log(this.formularioProduccionArea.value);
      this.produccionEmpleadoService.agregarProduccionArea(this.formularioProduccionArea.value).subscribe(
        (response) => {
          console.log('Respuesta exitosa:', response);
          if (response && response.success) {
            if (response.success === 1) {
              console.log('Producción insertada correctamente');
              this.presentAlert1();
            } else if (response.success === 2) {
              console.log('Insumos insuficientes');
              this.alertInsumo();
              // Realiza acciones específicas para insumos insuficientes
            } else {
              console.log('Operación no exitosa:', response.mensaje);
         //     this.mostrarDialogError('Hubo un problema, no se pudo registrar');
            }
          } else {
            console.log('Respuesta desconocida:', response);
          }
        },
        (error) => {
          console.log('Hubo un error al insertar');
          console.log(this.formularioProduccionArea.value);
          console.log('Error en la solicitud:', error);
          //this.mostrarDialogError('Error en la Base de Datos Contacte a Sistemas');
        }
      );
    }
    CANCELAR(){
      // Guardar valores readonly antes de resetear el formulario
    const { usuarioNombre, usuarioCorreo } = this.readonlyValues;

    // Resetear el formulario
    this.formularioProduccionArea.reset();

    // Establecer los valores readonly nuevamente
    this.readonlyValues = { usuarioNombre, usuarioCorreo };

      this.router.navigateByUrl('dashboard/produccion-empleado/produccionEmpleado-list');
      
    }




    async presentAlert1(){
      const alert = await this.alertController.create({
        header: "Actualizacion",
        message: "Se registro correctamente la produccion",
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('dashboard/produccion-empleado/produccionEmpleado-list');
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

    async alertInsumo(){
      const alert = await this.alertController.create({
        header: "Aviso",
        message: "No cuenta con insumos suficientes",
        buttons: [{
          text: 'Aceptar'
        }]
      });
      
      await alert.present();
      
      let result = await alert.onDidDismiss();
      console.log(result);
    }
    
}
