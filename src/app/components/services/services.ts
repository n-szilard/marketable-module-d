
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Footer } from '../footer/footer';
import { AIType } from '../../interfaces/AITypeEnum';

@Component({
  selector: 'app-services',
  imports: [RouterModule, Footer],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class ServicesComponent {


  constructor(
    private router: Router,
    private api: ApiService
  ) { }
  public TypeEnum = AIType;


  checkToken(type: AIType) {
    let token = prompt("Add meg a tokent!")
    if (token == null) {
      return;
    }


    this.api.startConversation(token, 'string').subscribe({
      next: (res) => {
        alert('jo')
        switch (type) {
          case AIType.Chat:
            break;
          case AIType.ImageGen:
            break;
          case AIType.ImageRec:
            this.router.navigate(['/imagerecognition'], {
              state: {
                token: token
              }
            })
            break;
        }
      },
      error: (error) => {
        alert('nemjo');
        console.log(error);
      }
    })

  }

}
