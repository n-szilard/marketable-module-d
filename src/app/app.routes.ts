import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ChatComponent } from './components/chat/chat';
import { ServicesComponent } from './components/services/services';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'services', component: ServicesComponent }
];
