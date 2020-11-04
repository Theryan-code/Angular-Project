import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dept } from '../department';
import { Employee } from '../../employees/employees';
import { DeptService } from '../../department.service';
import { EmployeesService } from '../../employees.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {

  depts: Dept[];
  emps: Employee[];
  addDeptForm: FormGroup;
  empSelected:boolean = false;

  constructor(
    private deptService: DeptService,
    private EmpService: EmployeesService,
    private formBuilder: FormBuilder
    ) 
    { }

    
  /**
   * fetch the data on initialization
  */
  ngOnInit(): void {
    // get data
    this.getDataFromServices();
   // make the formgroup
    this.addDeptForm = this.formBuilder.group({
      name: ['',[Validators.required]],
      building: ['',[Validators.required]],
      employees: this.formBuilder.array([])
    });
        // check the value changes in the console
        this.addDeptForm.valueChanges.subscribe(console.log);
  }

  /**
   * This method gets the data from declared service
   */
  getDataFromServices(): void {
    this.deptService.getDepts().subscribe((depts) => (this.depts = depts));
    this.EmpService.getEmployees().subscribe((employees) => (this.emps = employees));
  }

  get name(){
    return this.addDeptForm.get('name');
  }

  get building(){
    return this.addDeptForm.get('building');
  }

  get employees(){
     return this.addDeptForm.get('employees') as FormArray;
   }

  /**
   * this method adds/deletes the (un)selected employees to the form employees array
   * @param e the checked event
   */
  onCheckboxChange(e){
    const checkArray= this.addDeptForm.get('employees') as FormArray;

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
    alert(this.empSelected)
  }

  /**
   * This method adds a new department to the data
   */
  AddDept(): void {
        // assign the form data to the fields
        var data = {
          id: this.deptService.generateDeptId(),
          name: this.addDeptForm.get('name').value,
          building: this.addDeptForm.get('building').value,
          employeeID: this.addDeptForm.get('employees').value.filter((emp)=>{return emp != null}),
        };
        console.log(data);
        // add the new task to the data
        this.deptService.addDepartment(data);
        // close the overlay
        this.close();
  }

  
  @Input() addnewdept: boolean;
  // the event emmitter is used to close the overlay
  @Output() closeOverlay = new EventEmitter;



    /**
   * This method resets the variables and closes the overlay/popup
   */
  close(): void {
    // reset the form values before closing the popup
    this.addDeptForm.reset();
    // when clicking the close button or outside the popup the eventemitter emits a close event that toggles the visibility state
    this.closeOverlay.emit(null);
  }

     /**
   * This method returns all employees in the selected deparment
   * @param id department id
   */
  // getEmployeesByDept(): Employee[] {
  //   const tempDept = this.deptService.getDeptById(4);
  //   let deptEmployees: Employee[] = [];
  //   for (const id of tempDept.employeeID) {
  //     deptEmployees.push(this.EmpService.getEmployeeById(id));
  //   }
  //   return deptEmployees;
  // }
  //     /**
  //  * This method will tell the serve which employees is currently selected
  //  * @param emp employee id
  //  * @param event checkbox event
  //  */
  // updateEmpChoice(emp: number, event) {
  //   // this is for telling the server the option is checked or not check
  //   this.employeeOptions[emp] = event.target.checked;
  // }


}
