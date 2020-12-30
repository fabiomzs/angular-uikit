import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { Security } from 'src/app/utils/security.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit {
  public form: FormGroup;
  public busy = false;

  constructor(private router: Router, private service: DataService, private fb: FormBuilder) { 
    this.form = this.fb.group({
      username: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required,
        CustomValidator.isCpf()
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });
  }

  ngOnInit(): void {
    const token = Security.getToken();
    if(token){
      this.busy = true;
      console.log('Autenticanto...');
      this.service.refreshToken().subscribe((data: any) => {
        this.setUser(data.customer, data.token);
        this.busy = false;
      }, (error) => {
        localStorage.clear();
        this.busy = false;
      });
    }
  }

  submit() {
    //token:
    //variavel global
    //session storage
    //local storage
    this.busy = true;
    this.service.authenticate(this.form.value).subscribe((data: any) => {
      console.log(data);
      this.setUser(data.customer, data.token);
      this.busy = false;
    }, (error) => {
      console.log(error);
      this.busy = false;
    });
  }

  setUser(user, token) {
    Security.set(user, token);
    this.router.navigate(['/'])
  }

}
