import { Reclamo } from './../../model/reclamo';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public datosUsuario: Usuario = {
    id: '',
    nombre: '',
    noCasa: '',
    telefono: '',
    correo: '',
    imageUrl: '',
    reclamos: []
  };

  public datosReclamo: Reclamo = {
    id: '',
    fecha: '',
    foto: '',
    nota: ''
  }

  registro!: FormGroup;

  constructor(
    private loadingController: LoadingController,
    private fb: FormBuilder,
    private avatarService: AvatarService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private db: DatabaseService) { }

  ngOnInit() {

    this.registro = this.fb.group({
      nota: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.datosUsuario = JSON.parse(params['data']);
      console.log(this.datosUsuario);
    });
  }

  get nota() {
    return this.registro.get('nota');
  }

  async addImage() {

    if (this.nota.status.valueOf() == 'VALID') {

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera // Camera, Photos or Prompt!
      });

      if (image) {

        const loading = await this.loadingController.create();

        await loading.present();



        this.datosReclamo.id = this.db.getID(12);
        this.datosReclamo.fecha = this.db.formatDate(new Date);
        this.datosReclamo.foto = "";
        this.datosReclamo.nota = this.nota.value;

        //this.datosUsuario.reclamos.push(this.datosReclamo);

        const result = await this.avatarService.uploadImageReclamo(image, this.datosUsuario, this.datosReclamo.id);

        loading.dismiss();

        if (result == null) {
          const alert = await this.alertController.create({
            header: 'Fallo al subir imagen',
            message: 'Hubo un problema al subir su imagen.',
            buttons: ['OK']
          });
          await alert.present();
        } else {

          this.datosReclamo.foto = result;
          this.datosUsuario.reclamos.push(this.datosReclamo);
          this.db.actualizar(this.datosUsuario);

          this.router.navigate(['/home']);
        }


      }

    }
  }
}
