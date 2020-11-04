import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { EMPLOYEES } from './employees-mock';
import { Employee } from './employees';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeesService } from '../employees.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DeptService } from '../department.service';
import { TaskService } from '../task.service';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {

  title = 'Employees';
  edit: boolean;
  addnewemployee: boolean;
  employees = EMPLOYEES;
  employee: Employee[];
  selectedEmployee: Employee;
  viewDetails: boolean;
  editDetails: boolean;
  viewEmployee: Employee;
  editEmployee: Employee;
  

  private searchTerms = new Subject<string>();
  matchedEmployees$: Observable<Employee[]>;

  constructor(private employeeService: EmployeesService) { }

  getEmployeesFromService(): void {
    this.employeeService.getEmployees().subscribe((employees) => (this.employees = employees));
  }
 

  ngOnInit(): void {
    this.getEmployeesFromService();
    this.viewDetails = false;
    this.editDetails = false;

    this.matchedEmployees$ = this.searchTerms.pipe(
      // after each keytroke wait 10 ms before considering the search value
      debounceTime(10),

      // ensure that the search text changed
      distinctUntilChanged(),

      // switchmap calls the employee search in the employee service for each search value and returns only the latest observable
      switchMap((term: string) => this.employeeService.searchEmployees(term)),
    );
  }

  
  showEmployeeDetails(employee: Employee): void {
    this.viewEmployee = employee;
    this.edit = false;
    this.viewDetails = true;
  }
 
  closeOverlay(): void {
    this.viewEmployee = null;
    this.editEmployee = null;
    this.addnewemployee = false;
  }
  
  getEmployees(): void {
    this.employeeService
      .getEmployees()
      .subscribe((employees) => (this.employees = employees));
  }
  // View the select employee (details)
  View(employee: Employee) {
    if (!this.selectedEmployee) {
      this.selectedEmployee = employee;
      this.edit = false;
    } else {
      this.selectedEmployee = null;
    }
  }
  // Add new employee to employees
  addEmployee() {
    this.addnewemployee = !this.addnewemployee;
  }
  // Edit selected employee's eddit option
  Edit(emp: Employee) {
    if (!this.selectedEmployee) {
      this.selectedEmployee = emp;
      this.edit = true;
    } else {
      this.selectedEmployee = null;
    }
  }
  // Remove employee from list employees
  Delete(employee: Employee) {
    const index = this.employees.indexOf(employee);
    if (index !== -1) {
      this.employees.splice(index, 1);
    }
    this.edit = null;
  }

  //@Input() placeholder: string = 'Search Employee by Name or ID';
  //@Output() setValue: EventEmitter<string> = new EventEmitter();
  //private _searchSubject: Subject<string> = new Subject();

  ////Method for displaying search results
  //public updateSearch(searchTextValue: string) {
  //  this._searchSubject.next(searchTextValue);
  //  console.log(searchTextValue);
  //  try {
  //    // try to find employee by id (number)
  //    console.log(
  //      this.employeeService.getEmployeeById(parseInt(searchTextValue))
  //        .first_name
  //    );
  //    this.View(
  //      this.employeeService.getEmployeeById(parseInt(searchTextValue))
  //    );
  //    // this.searching = !this.searching;
  //  } catch (TypeError) {
  //    // if value is not a number
  //    try {
  //      // try to find employee by name
  //      console.log(this.employeeService.getEmployeeByName(searchTextValue).id);
  //      this.View(this.employeeService.getEmployeeByName(searchTextValue));
  //      // this.searching = !this.searching;
  //    } catch (error) {
  //      // nothing found => do not select anything and reset placeholder
  //      this.placeholder = this.placeholder;
  //      // this.searching = !this.searching;
  //      this.selectedEmployee = null;
  //    }
  //  }
  //}

  //private _setSearchSubscription() {
  //  this._searchSubject
  //    .pipe(debounceTime(500))
  //    .subscribe((searchValue: string) => {
  //      this.setValue.emit(searchValue);
  //      // console.log(searchValue);
  //    });
  //}

  //ngOnDestroy() {
  //  this._searchSubject.unsubscribe();
  //}

  search(term: string): void {
    // everytime the user types into the textbox searchTerms emits the search value into the searchTerms observable
    this.searchTerms.next(term);
  }

  clearSearch(): void {
    this.searchTerms.next('');
  }

}
