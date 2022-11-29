import { Reclamo } from './../model/reclamo';
import { Usuario } from './../model/usuario';
import { DatabaseService } from './../services/database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registro!: FormGroup;

  public newUsuario: Usuario = {
    id: '',
    nombre: '',
    noCasa: '',
    telefono: '',
    correo: '',
    imageUrl: '',
    reclamos: []
  };

  public userMail = '';

  private operacion = 'new';

  constructor(private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.registro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      noCasa: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.operacion = sessionStorage.getItem('operacion');

    if (this.operacion == 'edit') {
      this.userMail = sessionStorage.getItem('userEmail');
      this.cargarDatosUsuario(this.userMail);
    }

  }

  get nombre() {
    return this.registro.get('nombre');
  }

  get email() {
    return this.registro.get('email');
  }

  get noCasa() {
    return this.registro.get('noCasa');
  }

  get telefono() {
    return this.registro.get('telefono');
  }

  get password() {
    return this.registro.get('password');
  }

  async registrar() {

    if (this.operacion == 'new') {
      const user = await this.authService.register(this.registro.value);
      if (user) {
        this.grabarUsuario(this.registro.value);
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else {
        this.showAlert('Ocurrio al grabar el registro', 'Intentalo nuevamente!');
      }
    } else {
      this.grabarUsuario(this.registro.value);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  async showAlert(header: any, message: any) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  grabarUsuario({ nombre, email, noCasa, telefono, password }) {

    if (this.operacion == 'new') {

      this.newUsuario.id = this.db.getID(12);
      this.newUsuario.nombre = nombre;
      this.newUsuario.noCasa = noCasa;
      this.newUsuario.telefono = telefono;
      this.newUsuario.correo = email;
      this.newUsuario.reclamos = [];

    } else {

      this.newUsuario.nombre = nombre;
      this.newUsuario.noCasa = noCasa;
      this.newUsuario.telefono = telefono;
      this.newUsuario.correo = email;

    }

    this.db.crearUsuario(email, this.newUsuario);

    //const doc = this.db.crearDocument(this.newUsuario, 'Inquilino')


  }

  cargarDatosUsuario(email: string) {

    this.db.obtenerUsuario(email).then(data => {
      this.newUsuario.id = data.id;
      this.newUsuario.correo = data.correo;
      this.newUsuario.nombre = data.nombre;
      this.newUsuario.noCasa = data.noCasa;
      this.newUsuario.telefono = data.telefono;
    });

  }

  regresar() {
    if (this.operacion == 'edit') {
      this.router.navigate(['/home']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

}



