import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';
import { AuthInterceptor } from './auth.interceptor'; // Adjust the import path as necessary
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
//import { CustomDatetimePickerComponent } from '../app/custom-datetime-picker/custom-datetime-picker.component'; 
const routes: Routes = [
  { path: 'budget-planner', loadChildren: () => import('./budget-planner/budget-planner.module').then(m => m.BudgetPlannerModule) }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()), // Add this line
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    importProvidersFrom(
      ReactiveFormsModule,
      MatSnackBarModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatButtonModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatIconModule,
      NgxMaterialTimepickerModule
    //  CustomDatetimePickerComponent
    )
  ]
};
