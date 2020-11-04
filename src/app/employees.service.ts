import { Injectable } from '@angular/core';
import { Employee } from './employees/employees';
import { EMPLOYEES } from './employees/employees-mock';
import { Observable, of, Subject } from 'rxjs';
import { TASKS } from './tasks/mock-tasks';
import { DeptService } from './department.service';
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {

  constructor(private depService: DeptService) { }

  //Returns a list of all employees
  getEmployees(): Observable<Employee[]> {
    return of(EMPLOYEES);
  }
  //Add new data to list Employees
  addEmployee(Employee): Observable<any> {
    return of(EMPLOYEES.push(Employee));
  }
  //Return a employee with specific ID
  getEmployeeById(id: number) {
    for (var i = 0; i < EMPLOYEES.length; i++) {
      if (EMPLOYEES[i].id == id) {
        return EMPLOYEES[i];
      }
    }
  }
  //Return employees with specific department id
  getEmployeesByDep(): Observable<Employee[]> {
    const dict = {};
    const subject = new Subject<any>();
    this.getEmployees().subscribe((employees) => {
      employees.forEach((employee) => {
        const dep = employee.department_id;
        if (!(dep in dict)) {
          dict[dep] = 1;
        } else {
          dict[dep]++;
        }
      });
      subject.next(dict);
    });
    return subject.asObservable();
  }
  // Remove employee from list Employees
  deleteEmployee(employee: Employee) {
    const index = EMPLOYEES.indexOf(employee);
    if (index !== -1) {
      EMPLOYEES.splice(index, 1);
    }
  }
  //Return an employee with specific name
  getEmployeeByName(name: string) {
    // for each EMPLOYEE in the list
    for (var i = 0; i < EMPLOYEES.length; i++) {
      // check if the task id equals the input id
      if (EMPLOYEES[i].first_name.toLowerCase() == name.toLowerCase()) {
        //return the EMPLOYEE with the same id
        return EMPLOYEES[i];
      }
    }
  }
  // Get all employees first names in a list
  public getEmployeesNames(): string[] {
    let emp_names: string[] = [];
    for (var i = 0; i < EMPLOYEES.length; i++) {
      emp_names.push(EMPLOYEES[i].first_name);
    }
    return emp_names;
  }
  // Return the number of employees per department 
  getNumberOfEmployeesPerDepartment(): {} {
    // temp dictionary for storing number of employees
    const dict = {};
    // temp list for storing number of employees
    const temp = [];
    // temp list for storing departments
    var emps = [];
    let t: { value: number; name: string } = { value: null, name: String() };

    // create a list of employees
    EMPLOYEES.forEach(
      (emp) =>
        (dict[this.depService.getDeptById(emp.department_id).name] =
          this.depService.getDeptById(emp.department_id).name in dict
            ? dict[this.depService.getDeptById(emp.department_id).name] + 1
            : 1)
    );

    // add number of employees to temp list
    for (let key in dict) {
      temp.push(dict[key]);
    }

    //  function to remove duplicates
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    // create list of departments with tasks
    EMPLOYEES.forEach((emp) =>
      emps.push(this.depService.getDeptById(emp.department_id).name)
    );
    // filter unique employees
    var employees = emps.filter((v, i, a) => a.indexOf(v) === i);

    // check values
    // console.log(temp, departments);

    // list for storing number and employee dictionaries
    let empsTaskList = [];

    // for each value in the tasks list
    for (let value in temp) {
      // create new dict
      let res = {};
      // for each department
      for (let name in employees) {
        // add data to dict
        res['value'] = temp[value];
        res['name'] = employees[name];
        // add the dict to the deptTaskList
        empsTaskList.push(res);
        // remove department from list so it won't be used again
        employees.shift();

        // checking values
        // console.log(deptTaskList, res, temp, departments);

        break;
      }
    }
    // console.log(deptTaskList);

    return empsTaskList;
  }

  // Search employees by their first name
  searchEmployees(term: string): Observable<Employee[]> {
    // check if search term exists by removing leading and trailing whitespaces and line terminator characters
    if (!term.trim()) {
      // if the search term is empty
      return of([]);
    }

    // get all the tasks which contains the search term
    const matches = EMPLOYEES.filter(employee => employee.first_name.toLowerCase().includes(term.toLowerCase()))

    // return all matches
    return of(matches);

  }


}
