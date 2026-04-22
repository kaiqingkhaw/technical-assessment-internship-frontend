import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  submitted = false;
  messageFeedback = '';
  samplePosts: any[] = [];

  contactForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern("^[a-zA-Z][a-zA-Z '-]*$")
    ]],
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    message: ['', [
      Validators.required,
      Validators.minLength(10)
    ]]
  });

  ngOnInit(): void {
    this.loadSamplePosts();
  }

  get formControls() {
    return this.contactForm.controls;
  }

  onMessageInput(): void {
    const message = this.contactForm.get('message')?.value || '';

    if (message.length < 10) {
      this.messageFeedback = 'Message is too short.';
    } else if (message.length <= 30) {
      this.messageFeedback = 'Message length is acceptable.';
    } else {
      this.messageFeedback = 'Message is detailed.';
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    alert(
      'Form submitted successfully.\n\n' +
      'Name: ' + this.contactForm.value.name + '\n' +
      'Email: ' + this.contactForm.value.email + '\n' +
      'Message: ' + this.contactForm.value.message
    );

    // ✅ Professional UX improvement
    this.contactForm.reset();
    this.messageFeedback = '';
    this.submitted = false;
  }

  loadSamplePosts(): void {
    this.http.get<any[]>('/sample-posts.json').subscribe({
      next: (data) => {
        this.samplePosts = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading sample posts:', error);
      }
    });
  }
}