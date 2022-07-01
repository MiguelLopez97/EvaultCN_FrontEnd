import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'fas fa-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/datos-generales', title: 'Datos generales', icon: 'far fa-building', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/facturas', title: 'Facturas', icon: 'far fa-file-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/agregar-factura', title: 'Agregar factura', icon: 'fas fa-file-upload', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/generar-carta', title: 'Generar carta', icon: 'fas fa-print', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/reportes', title: 'Reportes', icon: 'fas fa-clipboard-list', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
  { path: '/graficas', title: 'Gráficas', icon: 'fas fa-chart-line', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
];
