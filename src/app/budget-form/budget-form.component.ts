import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModuleType, Zone } from '../models/budget';
import { Router } from '@angular/router';
import { BudgetService } from '../services/budget.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/forms/typed-forms#formarray-dynamic-homogenous-collections
    - https://dev.to/chintanonweb/angular-reactive-forms-mastering-dynamic-form-validation-and-user-interaction-32pe
  */

  budgetForm: FormGroup;
  moduleTypes: ModuleType[] = [];
  zones = Object.values(Zone);
  totalBudget: number = 0; // Añadida la propiedad totalBudget

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private router: Router
  ) {
    this.budgetForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator]],
      items: this.fb.array([], Validators.minLength(5)),
    });
  }

  ngOnInit() {
    this.budgetService.getModuleTypes().subscribe((types) => {
      this.moduleTypes = types;
    });
  }

  get items() {
    return this.budgetForm.get('items') as FormArray;
  }

  addItem() {
    const itemForm = this.fb.group({
      zone: ['', Validators.required],
      moduleType: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]], // Añadido el campo quantity
    });
    this.items.push(itemForm);
  }

  // Añadido el método removeItem
  removeItem(index: number) {
    this.items.removeAt(index);
  }

  dateValidator(control: any) {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate <= today ? null : { futureDate: true };
  }

  // Método para calcular el presupuesto total
  calculateTotalBudget() {
    this.totalBudget = this.items.controls.reduce((total, item) => {
      const moduleTypeId = item.get('moduleType')?.value;
      const quantity = item.get('quantity')?.value || 0;
      const moduleType = this.moduleTypes.find((m) => m.id === moduleTypeId);
      return total + (moduleType?.price || 0) * quantity;
    }, 0);
  }

  onSubmit() {
    if (this.budgetForm.valid && this.items.length <= 5) {
      this.budgetService.createBudget(this.budgetForm.value).subscribe(() => {
        this.router.navigate(['/budgets']);
      });
    }
  }
}
