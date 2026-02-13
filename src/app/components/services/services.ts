
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Footer } from '../footer/footer'

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

  popUp() {
    let token = prompt("Add meg a tokent!")
    if (token == null) {
      return;
    }

    this.api.startConversation(token, 'string').subscribe({
      next: (res) => {
        alert('jo')
        console.log(res);
      },
      error: (error) => {
        alert('nemjo');
        console.log(error);
      }
    })

  }

}
