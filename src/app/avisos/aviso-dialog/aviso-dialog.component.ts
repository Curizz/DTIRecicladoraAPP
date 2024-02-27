import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-aviso-dialog',
  templateUrl: './aviso-dialog.component.html',
  styleUrls: ['./aviso-dialog.component.scss']
})
export class AvisoDialogComponent {

  @Input() message: string = '';

  constructor(private modalController: ModalController) {}

  confirm(confirm: boolean): void {
    this.modalController.dismiss(confirm);
  }
}
