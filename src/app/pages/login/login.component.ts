import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { usuarioModel } from '../../Models/usuario.model';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  usuario: usuarioModel = new usuarioModel();;
  recordar = false;

  constructor(
    private auth: AuthService,
    private router: Router, ) { }

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }
  }

  login(form: NgForm) {

    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      title: 'Verificando',
      text: 'Espere por favor....',
      icon: 'info'
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(resp => {


      console.log(resp);
      Swal.close();

      if (this.recordar) {
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home');


    }, (err) => {

      Swal.fire({
        title: 'Error al iniciar',
        text: err.error.error.message,
        icon: 'error'
      });

    });
  }

}
