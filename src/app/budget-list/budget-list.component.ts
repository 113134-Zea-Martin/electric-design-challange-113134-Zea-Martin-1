import { Component, OnInit } from '@angular/core';
import { Budget } from '../models/budget';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/components/lifecycle#
    - https://angular.dev/guide/http/making-requests#http-observables
    - https://angular.dev/guide/http/setup#providing-httpclient-through-dependency-injection
    - https://angular.dev/guide/http/making-requests#setting-request-headers
    - https://angular.dev/guide/http/making-requests#handling-request-failure
    - https://angular.dev/guide/http/making-requests#best-practices (async pipe)
    - https://angular.dev/guide/testing/components-scenarios#example-17 (async pipe)
  */

    budgets: Budget[] = [];

    constructor(private budgetService: BudgetService) {}
  
    ngOnInit() {
      this.budgetService.getBudgets().subscribe(budgets => {
        this.budgets = budgets;
      });
    }

}
