import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validator, Validators} from '@angular/forms';
// @ts-ignore
import {ServicesService} from '../services/services.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
 /*loginForm: FormGroup;
 invalidLogin = false;
 message: any;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private apiService: ServicesService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
      });
  }


  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    };

    this.apiService.login(loginData).subscribe((data: any) => {
          // console.log(data)
      this.message = data.message;

      if (data.token) {
        window.localStorage.setItem('token' , data.token);
        // this.router.navigate(['view'])
      } else {
        this.invalidLogin = true;
        alert(data.message);
      }
    });

  }*/
}
