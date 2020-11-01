import { Component, OnInit } from '@angular/core';
import { usuarioModel } from '../../Models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: usuarioModel = new usuarioModel();
  recordar = false;

  constructor(
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    

  }

  onSubmit(form: NgForm) {

    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      title: 'Verificando',
      text: 'Espere por favor....',
      icon: 'info'
    });
    Swal.showLoading();
  
    this.auth.nuevoUsuario(this.usuario).subscribe(resp => {
      
      console.log(resp);
      Swal.close();

      if(this.recordar){
        localStorage.setItem('email', this.usuario.email)
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
