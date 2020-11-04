import { Injectable } from '@angular/core';
import { Dept } from './departments/department';
import { DEPARTMENTS } from './departments/mock-departments';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeptService {
  /**
   * This method adds a department to the data
   * @param Dept dept
   */
  addDepartment(Dept): Observable<any> {
    return of(DEPARTMENTS.push(Dept));
  }
 /**
   * This method gets all the departments
   */
  getDepts(): Observable<Dept[]> {
    return of(DEPARTMENTS);
  }
  /**
   *
   * This method gets a department by its id
   * @param id dept id
   */
  getDeptById(id: number) {
    // for each department in the list
    for (var i = 0; i < DEPARTMENTS.length; i++) {
      // check if the department id equals the input id
      if (DEPARTMENTS[i].id == id) {
        //return the department with the same id
        return DEPARTMENTS[i];
      }
    }
  }

  
    /**
   * This method generates a task id for a new task
   */
  generateDeptId():number{
    // if there are tasks
    // get the highest id in the list by creating a list of all the task ids with TASKS.map()
    // add 1 to the highest task id
    // if there are no tasks set the task id to 1
    const id:number = DEPARTMENTS.length > 0 ? Math.max(...DEPARTMENTS.map(hero => hero.id)) + 1: 1;
    return id;
  }

      /**
   * This method generates a task id for a new task
   */
  getCurrentDeptID():number{
    // if there are tasks
    // get the highest id in the list by creating a list of all the task ids with TASKS.map()
    // add 1 to the highest task id
    // if there are no tasks set the task id to 1
    const id:number = DEPARTMENTS.length > 0 ? Math.max(...DEPARTMENTS.map(hero => hero.id)) + 1: 1;
    return id;
  }
  
  /**
   * This method finds a department based on the department name
   * @param name dept name
   */
  public getDepartmentNames(): string[] {
     // for each department in the list
    let dep_names: string[] = [];
    for (var i = 0; i < DEPARTMENTS.length; i++) {
      // check if the department id equals the input id
      dep_names.push(DEPARTMENTS[i].name);
    }
     // return the department with the same id
    return dep_names;
  }

   /**
   * This method finds a department based on the department name
   * @param name dept name
   */
  getDeptByName(name: string) {
    // for each dept in the list
    for (var i = 0; i < DEPARTMENTS.length; i++) {
      // check if the dept id equals the input id
      if (DEPARTMENTS[i].name.toLowerCase() == name.toLowerCase()) {
        //return the dept with the same id
        return DEPARTMENTS[i];
      }
    }
  }

  
  /**
   * This method deletes a dept from the data.
   * @param dept Dept
   */
  deleteDept(dept: Dept) {
    // get the index of the dept
    const index = DEPARTMENTS.indexOf(dept);
    // check if element isn't the last element in the list
    if (index !== -1) {
      // remove dept from list
      DEPARTMENTS.splice(index, 1);
    }
  }


  /**
   * This method returns a list of depts that contain the search term
   * @param term the searh term
   */
  searchDepts(term: string): Observable<Dept[]>{
    // check if search term exists by removing leading and trailing whitespaces and line terminator characters
    if(!term.trim()){
      // if the search term is empty
      return of([]);
    }

    // get all the depts which contains the search term
    const matches = DEPARTMENTS.filter(dept => dept.name.toLowerCase().includes(term.toLowerCase()))

    // return all matches
    return of(matches);

  }


  getDept(id: number): Observable<Dept> {
    // TODO: send the message _after_ fetching the hero
    return of(DEPARTMENTS.find((hero) => hero.id === id));
  }

  constructor() {}
}
