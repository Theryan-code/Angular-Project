import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Dept } from '../department';
import { DeptService } from '../../department.service';
import { Employee } from 'src/app/employees/employees';
import { EmployeesService } from '../../employees.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.css']
})
export class EditDepartmentComponent implements OnInit {

  editDeptForm: FormGroup;
  empSelected:boolean = true;

  
  @Input() dept: Dept;
  @Output() closeOverlay = new EventEmitter;
  emps: Employee[];

  constructor(private deptService: DeptService, private EmpService: EmployeesService, private formBuilder: FormBuilder) 
  { }

  ngOnInit(): void {
    this.getDataFromServices();
    this.editDeptForm = this.formBuilder.group({
      name: ['',[Validators.required]],
      building: ['',[Validators.required]],
      employees: this.formBuilder.array([])
    });

    this.editDeptForm.valueChanges.subscribe(console.log);
  }

  get name(){
    return  this.editDeptForm.get('name') ;
  }

  get building(){
    return  this.editDeptForm.get('building') ;
  }

    /**
   * This method closes the overlay/popup and/or resets any values
   */
  close(): void {
    this.editDeptForm.reset([''])

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
    const checkArray= this.editDeptForm.get('employees') as FormArray;
    while(this.counter==0){
      for(var emp in this.dept.employeeID){
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
    const checkArray= this.editDeptForm.get('employees') as FormArray;

    if(e.target.checked){
      // add employee
      checkArray.push(new FormControl(parseInt(e.target.value)));
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
  saveDept(): void{

    // if the dept name has changed, get the new dept name, else keep the old one
    this.dept.name = this.name.value !== this.dept.name || this.name.value !== '' ? this.name.value:this.dept.name;

    // if the dept building has changed, get the new dept building, else keep the old one
    this.dept.building = this.building.value !== this.dept.building || this.building.value !== '' ? this.building.value:this.dept.building;

    // get the selected employees
    this.dept.employeeID = this.editDeptForm.get('employees').value.filter((emp)=>{return emp != null});

    console.log('dept :>> ', this.dept);

    this.close();

  }
     /**
   * This method gets the data from declared service
   */
  getDataFromServices(): void {
    this.EmpService.getEmployees().subscribe((employees) => (this.emps = employees));
  }
  
  

}
