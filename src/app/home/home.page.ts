import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Usuario } from '../model/usuario';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';
import { DatabaseService } from '../services/database.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public datosUsuario: Usuario = {
    id: '',
    nombre: '',
    noCasa: '',
    telefono: '',
    correo: '',
    imageUrl: '',
    reclamos: []
  };

  private correo = '';

  constructor(    private loadingController: LoadingController,
    private avatarService: AvatarService,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private db: DatabaseService) {

      this.correo = sessionStorage.getItem('userEmail');

      this.db.obtenerUsuario(this.correo).then(data => {
        this.datosUsuario = data;
      })
    }

    addElement(){
      this.router.navigate(['home/add'], {queryParams: {data: JSON.stringify(this.datosUsuario)}} );
    }

}
