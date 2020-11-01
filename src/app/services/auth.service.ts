import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { usuarioModel } from "../Models/usuario.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyDwIHQHzMKhT0mAEio3hArMPUB9VHoTWEM";

  private userToken: string;

  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem("token");
  }

  login(usuario: usuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }

  nuevoUsuario(usuario: usuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signUp?key=${this.apiKey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }

  guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }

    return this.userToken;
  }

  estaAunteticado(): boolean {
    const expira = Number(localStorage.getItem("expira"));
    const expiraData = new Date();
    expiraData.setTime(expira);

    if (expiraData > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
