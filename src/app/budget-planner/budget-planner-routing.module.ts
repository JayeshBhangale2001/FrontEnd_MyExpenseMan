import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SipCalculatorComponent } from './sip-calculator/sip-calculator.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseComponent } from './expense/expense.component';
import { HistoryComponent } from './history/history.component';
import { IncomeComponent } from './income/income.component';
import { InvestmentComponent } from './investment/investment.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TodoComponent } from './todo/todo.component';
import { UserDefinedListsComponent } from './user-defined-list/user-defined-list.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'side-nav', component: SideNavComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'todo', component: TodoComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'accounts', component: AccountComponent },
  { path: 'user-defined-list', component: UserDefinedListsComponent },
  { path: 'sip-calculator', component: SipCalculatorComponent },  // Changed path to lowercase
  { path: 'investment', component: InvestmentComponent },  
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetPlannerRoutingModule { }
