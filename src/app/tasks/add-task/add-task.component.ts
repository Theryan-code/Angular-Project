import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../task.service';
import { Task } from '../task';
import { Dept } from '../../departments/department';
import { DeptService } from '../../department.service';
import { Employee } from 'src/app/employees/employees';
import { EmployeesService } from '../../employees.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})

export class AddTaskComponent implements OnInit {

  tasks: Task[];
  depts: Dept[];
  addTaskForm: FormGroup;
  empSelected:boolean = false;

  constructor(
    private taskService: TaskService,
    private deptService: DeptService,
    private EmpService: EmployeesService,
    private formBuilder: FormBuilder

  ) {}


  ngOnInit(): void {
    // get data
    this.getDataFromServices();
    // make the formgroup
    this.addTaskForm = this.formBuilder.group({
      name: ['',[Validators.required]],
      duedate: ['',[Validators.required]],
      department:['',[Validators.required]],
      description:['',[Validators.required]],
      employees: this.formBuilder.array([])
    });
    // check the value changes in the console
    // this.addTaskForm.valueChanges.subscribe(console.log);
  }

  /**
   * This method gets all the data from the services and stores it
   */
  getDataFromServices(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
    this.deptService.getDepts().subscribe((depts) => (this.depts = depts));
  }

  get name(){
    return this.addTaskForm.get('name');
  }

  get duedate(){
    return this.addTaskForm.get('duedate');
  }

  get employees(){
    return this.addTaskForm.get('employees') as FormArray;
  }

  get department(){
    return this.addTaskForm.get('department');
  }

  get description(){
    return this.addTaskForm.get('description');
  }

  /**
   * this method adds/deletes the (un)selected employees to the form employees array
   * @param e the checked event
   */
  onCheckboxChange(e){
    const checkArray= this.addTaskForm.get('employees') as FormArray;

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
   * This method adds a new task to the data
   */
  AddTask(): void {
    // assign the form data to the fields
    var data = {
      name: this.addTaskForm.get('name').value,
      id: this.taskService.generateTaskId(),
      description: this.addTaskForm.get('description').value,
      duedate: this.addTaskForm.get('duedate').value,
      departmentID: this.addTaskForm.get('department').value,
      employees: this.addTaskForm.get('employees').value.filter((emp)=>{return emp != null}),
    };
    console.log(data);
    // add the new task to the data
    this.taskService.addTask(data);
    // close the overlay
    this.close();
  }

  @Input() addnewtask: boolean;
  // the event emmitter is used to close the overlay
  @Output() closeOverlay = new EventEmitter;

  /**
   * This method resets the variables and closes the overlay/popup
   */
  close(): void {
    // reset the form values before closing the popup
    this.addTaskForm.reset();
    // when clicking the close button or outside the popup the eventemitter emits a close event that toggles the visibility state
    this.closeOverlay.emit(null);
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

}
