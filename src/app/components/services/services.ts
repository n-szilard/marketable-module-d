
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [RouterModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class ServicesComponent {


  constructor(private router:Router){}

popUp(){
  let token = prompt("Add meg a tokent!")

  if(token=='13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6' || token=='b8ef2feea8a2bf982d637b5ff4be4771d2ef46f3564c5ecd7b'){

    this.router.navigate(['/chat'])

  }
  else{
    alert('Hibás token!')
  }

}

}
