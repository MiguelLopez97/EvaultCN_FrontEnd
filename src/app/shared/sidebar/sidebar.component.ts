import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from "@angular/core";

import { ROUTES } from './sidebar-routes.config';
import { Router, ActivatedRoute } from "@angular/router";
import { customAnimations } from "../animations/custom-animations";
import { ConfigService } from '../services/config.service';

import { CriptoService } from '../../services/cripto.service';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  animations: customAnimations
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('toggleIcon') toggleIcon: ElementRef;
  public menuItems: any[];
  depth: number;
  activeTitle: string;
  activeTitles: string[] = [];
  expanded: boolean;
  nav_collapsed_open = false;
  logoUrl = 'assets/img/logo_tecnikal.png';
  public config: any = {};

  public idEmpresaDesencriptado: number;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private cripto: CriptoService
  ) {
    this.idEmpresaDesencriptado = this.cripto.decrypt(localStorage.getItem('idEmpresa'));
    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }
  }

  ngOnInit() {
    this.config = this.configService.templateConf;
    this.menuItems = ROUTES;
  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (this.config.layout.sidebar.collapsed != undefined) {
        if (this.config.layout.sidebar.collapsed === true) {
          this.expanded = false;
          this.renderer.addClass(this.toggleIcon.nativeElement, 'fa-toggle-off');
          this.renderer.removeClass(this.toggleIcon.nativeElement, 'fa-toggle-on');
          this.nav_collapsed_open = true;
        }
        else if (this.config.layout.sidebar.collapsed === false) {
          this.expanded = true;
          this.renderer.removeClass(this.toggleIcon.nativeElement, 'fa-toggle-off');
          this.renderer.addClass(this.toggleIcon.nativeElement, 'fa-toggle-on');
          this.nav_collapsed_open = false;
        }
      }
    }, 0);
  }

  toggleSlideInOut() {
    this.expanded = !this.expanded;
  }

  handleToggle(titles) {
    this.activeTitles = titles;
  }

  // NGX Wizard - skip url change
  ngxWizardFunction(path: string) {
    if (path.indexOf("forms/ngx") !== -1)
      this.router.navigate(["forms/ngx/wizard"], { skipLocationChange: false });
  }
}
