import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'app/components/login/login.component';
import { RegistroComponent } from 'app/components/registro/registro.component'

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...
export const CONTENT_ROUTES: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent}
];