import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ChatComponent } from './components/chat/chat';
import { ServicesComponent } from './components/services/services';
import { ImageGeneratorComponent } from './components/image-generation/image-generation';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'chat', component: ChatComponent },
    { path: 'services', component: ServicesComponent},
    /*,
        children : 
        [  
            {path: 'image-generation', component: ImageGeneratorComponent }
        ],
    },
  */      
    {path: 'image-generation', component: ImageGeneratorComponent }
];

