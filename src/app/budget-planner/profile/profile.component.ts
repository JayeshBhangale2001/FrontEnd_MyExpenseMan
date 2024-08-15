import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfile } from '../../models/user-profile.model';
import { UserProfileService } from '../../services/user-profile.service';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SideNavComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contact: ['', Validators.required],
    });

    // Fetch and populate the form with the logged-in user's profile data
    this.userProfileService.getUserProfileForLoggedInUser().subscribe((profile) => {
      this.profileForm.patchValue(profile);
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const userProfile: UserProfile = this.profileForm.value;
      this.userProfileService.updateUserProfileForLoggedInUser(userProfile).subscribe(
        (response) => {
          console.log('User Profile Updated:', response);
          this.openSnackBar('Profile updated successfully!', 'Close');
        },
        (error) => {
          console.error('Error updating profile:', error);
          this.openSnackBar('Failed to update profile.', 'Close');
        }
      );
    } else {
      this.openSnackBar('Please fill in all fields correctly!', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
