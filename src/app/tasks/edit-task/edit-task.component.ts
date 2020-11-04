import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Task } from '../task';
import { DeptService } from '../../department.service';
import { Employee } from 'src/app/employees/employees';
import { EmployeesService } from '../../employees.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  editTaskForm: FormGroup;
  empSelected:boolean = true;

  @Input() task: Task;
  @Output() closeOverlay = new EventEmitter;
  constructor(private deptService: DeptService, private EmpService: EmployeesService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
      this.editTaskForm = this.formBuilder.group({
        name: ['',[Validators.required]],
        duedate: ['',[Validators.required]],
        description:['',[Validators.required]],
        employees: this.formBuilder.array([])
      });

      this.editTaskForm.valueChanges.subscribe(console.log);
  }

  get name(){
    return  this.editTaskForm.get('name') ;
  }

  get duedate(){
    return  this.editTaskForm.get('duedate') ;
  }

  get description(){
    return  this.editTaskForm.get('description') ;
  }

  /**
   * This method closes the overlay/popup and/or resets any values
   */
  close(): void {
    this.editTaskForm.reset([''])

    // when clicking the close button or outside the popup the eventemitter emits a close event that toggles the visibility state
    this.closeOverlay.emit();
  }

  /**
   * This method returns all employees in the selected deparment
   * @param id department id
   */
  getEmployeesByDept(id: number): Employee[] {
    const tempDept = this.deptService.getDeptById(id);
    let deptEmployees: Employee[] = [];
    for (const id of tempDept.employeeID) {
      deptEmployees.push(this.EmpService.getEmployeeById(id));
    }
    return deptEmployees;
  }

  counter:number = 0;
  /**
   * this method adds the initially selected employees to the formarray
   */
  getInitialEmps(): void{
    const checkArray= this.editTaskForm.get('employees') as FormArray;
    while(this.counter==0){
      for(var emp in this.task.employees){
        checkArray.push(new FormControl(parseInt(emp)+1))
      }
      this.counter++;
      // break;
    }
  }

  /**
   * this method adds/deletes the (un)selected employees to the form employees array
   * @param e the checked event
   */
  onCheckboxChange(e): void{
    const checkArray= this.editTaskForm.get('employees') as FormArray;

    if(e.target.checked){
      // add employee
      checkArray.push(new FormControl(e.target.value));
      this.empSelected = true;
    } else{
      // remove employee from the array if its unselected
      let i:number = 0;
      checkArray.controls.forEach((item:FormControl)=>{
        if(item.value == e.target.value){
          checkArray.removeAt(i);
        }
        i++;
      });
    }

    // when no employees are selected set the empSelected to false so that error message will show up
    if(checkArray.length==0){
      this.empSelected=false;
    }
    console.log(this.empSelected)
  }

  /**
   * this method returns de department name of the given department id
   * @param id the department id
   */
  getDeptName(id): string{
    return this.deptService.getDeptById(id).name;
  }

  /**
   * this method saves the changes
   */
  saveTask(): void{

    // if the task name has changed, get the new task name, else keep the old one
    this.task.name = this.name.value !== this.task.name || this.name.value !== '' ? this.name.value:this.task.name;

    // if the task description has changed, get the new task description, else keep the old one
    this.task.description = this.description.value !== this.task.description || this.description.value !== '' ? this.description.value:this.task.description;

    // if the due date has changed, get the new due date, else keep the old one
    this.task.duedate = this.duedate.value !== this.task.duedate || this.duedate.value !== '' ? this.duedate.value : this.task.duedate;

    // get the selected employees
    this.task.employees = this.editTaskForm.get('employees').value.filter((emp)=>{return emp != null});

    console.log('task :>> ', this.task);

    this.close();

  }

}

