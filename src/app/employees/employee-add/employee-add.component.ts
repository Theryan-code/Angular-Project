import { Component, OnInit, Input } from '@angular/core';
import { EMPLOYEES } from '../employees-mock';
import { Employee } from '../employees';
import { Dept } from '../../departments/department';
import { DeptService } from '../../department.service';
import { EmployeesService } from '../../employees.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit {

  constructor(
    private deptService: DeptService,
    private employeeService: EmployeesService
  ) { }

  employees: Employee[];
  depts: Dept[];
  selectedDept = null;
  // fit data from the service component 
  getDataFromServices(): void {
    this.deptService.getDepts().subscribe((depts) => (this.depts = depts));
    this.employeeService.getEmployees().subscribe((employees) => (this.employees = employees));
  }

  newEmployee: Employee = new Employee();
  @Input() addnewemployee: boolean;

  // Add new employee 
  AddEmployee() {
    if (this.newEmployee) {
      if (this.newEmployee.first_name && this.newEmployee.id && this.newEmployee.last_name && this.newEmployee.birth_date) {
        var data = {
          id: this.newEmployee.id,
          first_name: this.newEmployee.first_name,
          last_name: this.newEmployee.last_name,
          birth_date: this.newEmployee.birth_date,
          department_id: this.selectedDept.id,
        };
        this.employeeService.addEmployee(data);

        this.newEmployee.first_name = null;
        this.newEmployee.last_name = null;
        this.newEmployee.id = null;
        this.newEmployee.birth_date = null;
        
      }
    }  
  }

  ngOnInit(): void {
    this.getDataFromServices();
  }
}
