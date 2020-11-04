import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Task } from '../task';
import { DeptService } from '../../department.service';
import { Employee } from 'src/app/employees/employees';
import { EmployeesService } from '../../employees.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})

export class TaskDetailComponent implements OnInit {

  selectedDept = null;
  employeeOptions: {} = {};

  constructor(
    private deptService: DeptService,
    private EmpService: EmployeesService,
  ) {}

  @Input() task: Task;
  // the event emmitter is used to close the overlay
  @Output() closeOverlay = new EventEmitter;

  /**
   * This method closes the overlay/popup and/or resets any values
   */
  close() {
    // when clicking the close button or outside the popup the eventemitter emits a close event that toggles the visibility state
    this.closeOverlay.emit();
  }

  ngOnInit(): void {}

  /**
   * This method gets the deparment name based on the name
   * @param id deparment id
   */
  getDeptName(id: number) {
    return this.deptService.getDeptById(id).name;
  }

  /**
   * This method returns which employees are assigned to the task
   * @param id empoyee id list
   */
  getEmployeesByTask(id: number[]) {
    let taskEmps: Employee[] = [];
    for (let empID of id) {
      taskEmps.push(this.EmpService.getEmployeeById(empID));
    }
    return taskEmps;
  }
}
