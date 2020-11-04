import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { DeptService } from '../department.service';
import { EmployeesService } from '../employees.service';
import { Employee } from '../employees/employees';
import { Task } from '../tasks/task';
import { Dept } from '../departments/department';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
//import { map } from 'rxjs/operators';
//import { Subject, Observable, ObservedValueOf } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  //Get all the data needed for the graphs
  dapertments_name = this.deptService.getDepartmentNames();
  taks_per_department = this.tasksService.getNumberOfTasksPerDepartment();
  emps_per_department = this.employeeService.getNumberOfEmployeesPerDepartment();
  ngOnInit(): void {}

  theme: string;
  options = {
    title: {
      text: 'Department Information',
      subtext: "The chart on the left shows the number of tasks per department, on the right you can see the number of employees per department",
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: 'Department: {b} <br/>Number of {a}: {c} ({d}%)',
    },
    legend: {
      x: 'center',
      y: 'bottom',
      data: this.dapertments_name,
    },
    calculable: true,
    series: [
      {
        name: 'tasks',
        type: 'pie',
        center: ['25%', '50%'],
        radius: [30, 110],
        roseType: 'Tasks',
        data: this.taks_per_department,
      },
      {
        name: 'employees',
        type: 'pie',
        center: ['75%', '50%'],
        radius: [30, 110],
        roseType: 'Employees',
        data: this.emps_per_department,
      },
    ],
  };

  all;
  tasks: Task[];
  departments: Dept[];
  employees: Employee[];

  constructor(
    private deptService: DeptService,
    private tasksService: TaskService,
    private employeeService: EmployeesService
  ) {}

  getDepartments(): void {
    this.deptService
      .getDepts()
      .subscribe((departments) => (this.departments = departments.slice(1, 5)));
  }
}
