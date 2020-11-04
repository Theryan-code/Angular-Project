import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Employee } from '../employees';
import { Dept } from '../../departments/department';
import { DeptService } from '../../department.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  constructor(private deptService: DeptService) { }

  @Input() employee: Employee;
  @Input() edit: boolean;
  @Output() closeOverlay = new EventEmitter;

  depts: Dept[];
  selectedDept = null;

  close() {
    // when clicking the close button or outside the popup the eventemitter emits a close event that toggles the visibility state
    this.closeOverlay.emit();
  }

  getDataFromServices() {
    this.deptService.getDepts().subscribe((depts) => (this.depts = depts));
  }

  getDeptName(id: number) {
    return this.deptService.getDeptById(id).name;
  }

  Save() {
    this.edit = null;
  }

  ngOnInit(): void {
    this.getDataFromServices();

  }
}
