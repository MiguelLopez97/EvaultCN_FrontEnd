import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { ConfigService } from '../services/config.service';

import { CriptoService } from '../../services/cripto.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  currentLang = "en";
  toggleClass = "fas fa-expand";
  placement = "bottom-right";
  public isCollapsed = true;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  //Correo electrónico y NombreCompleto del usuario
  public cuentaDesencriptada: string;
  public fullNameDesencriptado: string;

  public config: any = {};

  constructor(
    private layoutService: LayoutService, 
    private configService:ConfigService,
    private _cripto: CriptoService,
    private _authService: AuthService,
    private _router: Router
  ) {
    //Desencriptación del correo electrónico tomado del localStorage
    this.cuentaDesencriptada = this._cripto.decrypt(localStorage.getItem('cuenta'));

    //Desencriptación del nombre completo tomado del localStorage
    this.fullNameDesencriptado = this._cripto.decrypt(localStorage.getItem('fullName'));
  }

  ngOnInit() {
    this.config = this.configService.templateConf;
  }

  ngAfterViewInit() {
    if(this.config.layout.dir) {
      const dir = this.config.layout.dir;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
    }
  }

  ToggleClass() {
    /*if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }*/

    if (this.toggleClass === "fas fa-expand") {
      this.toggleClass = "fas fa-compress";
    } else {
      this.toggleClass = "fas fa-expand";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

  //Método click para cerrar sesión
  salir() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }
}
