import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Budget, Zone } from '../models/budget';
import { BudgetService } from '../services/budget.service';

@Component({
  selector: 'app-budget-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.css',
})
export class BudgetViewComponent implements OnInit {
  // ADDITIONAL DOCS: same as BudgetListComponent

  budget: Budget | null = null;

  constructor(
    private route: ActivatedRoute,
    private budgetService: BudgetService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.budgetService.getBudget(id).subscribe(budget => {
        this.budget = budget;
      });
    }
  }

  getZones(): Zone[] {
    if (!this.budget) return [];
    return [...new Set(this.budget.items.map(item => item.zone))];
  }

  getItemsByZone(zone: Zone) {
    return this.budget?.items.filter(item => item.zone === zone) || [];
  }

  calculateBoxes(): number {
    if (!this.budget) return 0;
    let totalSlots = this.budget.items.reduce((sum, item) => 
      sum + item.moduleType.slots, 0);
    return Math.ceil(totalSlots / 3);
  }

  calculateTotal(): number {
    if (!this.budget) return 0;
    return this.budget.items.reduce((sum, item) => 
      sum + item.moduleType.price, 0);
  }
}
