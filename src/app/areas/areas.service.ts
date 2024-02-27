import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Areas } from './areas';
import { areasList } from './areasList';

@Injectable({
    providedIn: 'root'
  })
  export class AreasService {
    //API: string = 'https://recicladora.arvispace.com/PhpAngular/areas/'
  
     API: string = 'http://localhost/PhpAngular/areas/';

    private correo: string;
    private nombre: string;
    private tipoUsuario: string;
    private fabrica: string;

    constructor( private clientService:HttpClient) { 
        this.correo = '';
        this.nombre='';
        this.tipoUsuario='';
        this.fabrica='';

    }
  
    getAreas(){
      return this.clientService.get<any[]>(this.API+"?selectArea=1");
    }

    listarAreas(): Observable<areasList[]> {
        return this.clientService.get<areasList[]>(this.API+"?obtenerAreas=1");
  }

  //Se agrego el servicio para agregar una nueva area |---------------------------------------------------------|
  agregarArea(datosArea:Areas):Observable<any>{
    return this.clientService.post(this.API+"?insertarAreasPro=1",datosArea);
  }
    
     //Eliminar Area procedimiento
  eliminarArea(id: any, usuarioEliminador: any): Observable<any> {
    return this.clientService.delete(`${this.API}?borrarArea=${id}&UsuarioEliminador=${usuarioEliminador}`);
  }
  
   // OBTENEMOS EL CORREO DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
   getCorreo(): string {
    return this.correo = localStorage.getItem("Correo") || '';
  }

  // OBTENEMOS EL NOMBRE DEL LOCALSTORAGE  A LA LISTA DE LOS REGISTROS
  getNombre(): string {
    return this.nombre = localStorage.getItem("Nombre") || '';
  }

  getTipoUsuario(): string {
    return this.tipoUsuario = localStorage.getItem("NombreTipoUser") || '';
  }
  getidFabrica(): string{
    return this.fabrica = localStorage.getItem("idFabrica") || '';
  }
  consultarArea(id: any):Observable<any>{
    return this.clientService.get(this.API + "?consultarArea=" + id);
  }

  actualizarArea(id: any, datosArea: Areas): Observable<any> {
    return this.clientService.post(this.API + "?actualizarAreas=" + id, datosArea);
  }

}