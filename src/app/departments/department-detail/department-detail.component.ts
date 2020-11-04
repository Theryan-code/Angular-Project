import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Dept } from '../department';
import { Employee } from '../../employees/employees';
import { EmployeesService } from '../../employees.service';
import { DeptService } from '../../department.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css']
})
export class DepartmentDetailComponent implements OnInit {

  selectedDept = null;
  employeeOptions: {} = {};

  constructor(private EmpService: EmployeesService, private deptService: DeptService, private route: ActivatedRoute, private location: Location) {
    
   }

   @Input() dept: Dept;
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
    * This method returns which employees are assigned to the dept
    * @param id empoyee id list
    */
   getEmployeesByDept(id: number) {
     // temp list for storing the employees
     let deptEmps: Employee[] = [];
     // get the selected department
     console.log(id);
     const tempDept = this.deptService.getDeptById(id);
     console.log(tempDept.employeeID);
     //for each emp in the dep 
     for(const id of tempDept.employeeID){

      deptEmps.push(this.EmpService.getEmployeeById(id));
    }
     
     return deptEmps;
   }
}
