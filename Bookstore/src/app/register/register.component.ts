import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService){
      this.registerForm = this.fb.group({
          email:['', [Validators.required, Validators.email]],
          username: ['', Validators.required],
          hashedPassword: ['', Validators.required],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          phoneNumber: ['', Validators.required]
      });
  }

  register(){
    if(this.registerForm.invalid) return;

    const data = this.registerForm.value;

    this.authService.register(data).subscribe({
      next: (res: any) =>  {
        console.log('Registration success: ', res);
      },
      error: (err: any) => {
        console.error('Registration error', err);
      }
    })
  }
}
