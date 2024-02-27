import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ProveedorService } from '../proveedores.service';

@Component({
  selector: 'app-proveedores-edit',
  templateUrl: './proveedores-edit.component.html',
  styleUrls: ['./proveedores-edit.component.scss'],
})
export class ProveedoresEditComponent  implements OnInit {
  formularioProveedores: FormGroup;
  inventariosFabrica : any[]=[];
  elID:any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private proveedorService: ProveedorService,
    private activeRouter: ActivatedRoute
  ) { 
    const correoSave = this.proveedorService.getCorreo();
    this.formularioProveedores = this.formBuilder.group({
      NombreProveedor: [''],
      DireccionProveedor:[''],
      Telefono:[''],
      Correo:[''],
      RFCProveedor:[''],
      DescripcionProveedor:[''],
      EstatusProveedor: [''],
      idInventarioFabrica: [''],
      UsuarioActualizador: [correoSave],


    });
  }


  enviarDatos(): void{
    if (this.formularioProveedores.valid) {
      console.log('Id recibido: ', this.elID);
      console.log('Datos que se enviaran: ', this.formularioProveedores.value);

      this.proveedorService.editarProveedor(this.elID, this.formularioProveedores.value).subscribe(
        (respuesta)=> {
          console.log('Respuesta del servidor: ', respuesta);

          if (respuesta.success === 1) {
            console.log('La actualización fue exitosa');
            // Accede a los datos actualizados
            const proveedorActualizado = respuesta.data;
            console.log('Datos del proveedor actualizado: ', proveedorActualizado);
            //this.mostrarDialogoAviso();
            this.presentAlert1();
          } else {
            console.error('Error al actualizar el proveedor: ', respuesta.error);
            // Manejar errores del servicio aquí
          }

        },
        (error) => {
          console.error('Error al actualizar el proveedor con error: ', error);
        }
      );
    }
  }


  cancelar(){
    this.router.navigateByUrl('dashboard/proveedores/proveedores-list');
  }
  ngOnInit(): any {
      //Traemos el correo y nombre desde el servicio
      console.log('AQUI ABAJO SE MOSTRARIA EL CORREO QUE SE TRAE DESDE EL LOCALSTORAGE');
      const correoSave = this.proveedorService.getCorreo();
      console.log('Correo desde el localStorage: ', correoSave);

      console.log('AQUI ABAJO SE MOSTRARIA EL NOMBRE QUE SE TRAE DESDE EL LOCALSTORAGE');
      const nombreSave = this.proveedorService.getNombre();
      console.log('Nombre desde el localStorage: ', nombreSave);

         //Obtenemos el id y desde el servicio obtenemos los campos
         this.elID=this.activeRouter.snapshot.paramMap.get('id');
         console.log('OBTENEMOS EL ID: ', this.elID);
         this.proveedorService.obtenerProveedor(this.elID).subscribe(
           respuesta => {
             console.log('Respuesta del servicio',respuesta);
   
             this.formularioProveedores.setValue({
               NombreProveedor: respuesta.NombreProveedor,
               // ProductoProveedor: respuesta.ProductoProveedor,
               DireccionProveedor: respuesta.DireccionProveedor,
               Telefono: respuesta.Telefono,
               Correo: respuesta.Correo,
               RFCProveedor: respuesta.RFCProveedor,
               DescripcionProveedor: respuesta.DescripcionProveedor,
               EstatusProveedor:respuesta.EstatusProveedor,
               idInventarioFabrica: respuesta.idInventarioFabrica.toString(),
               UsuarioActualizador: respuesta.UsuarioActualizador || correoSave,
             });
   
           }, error => {
             console.error('ERROR DE LA SOLICITUD: ',error);
           }
         );
   
   
          //
        this.proveedorService.selectInventarioFabrica().subscribe((data)=>{
         this.inventariosFabrica=data;
       })
  }


  async presentAlert1(){
    const alert = await this.alertController.create({
      header: "Actualizacion",
      message: "Se actualizo correctamente el proveedor",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.router.navigateByUrl('/dashboard/proveedores/proveedores-list');
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
