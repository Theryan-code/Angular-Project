import { Injectable } from '@angular/core';
import { Task } from './tasks/task';
import { TASKS } from './tasks/mock-tasks';
import { Observable, of } from 'rxjs';
import { DeptService } from './department.service';

@Injectable({
  providedIn: 'root',
})

export class TaskService {


  constructor(private depService: DeptService) {}

  /**
   * This method adds a task to the data
   * @param Task Task
   */
  addTask(Task): Observable<any> {
    return of(TASKS.push(Task));
  }

  /**
   * This method generates a task id for a new task
   */
  generateTaskId():number{
    // if there are tasks
    // get the highest id in the list by creating a list of all the task ids with TASKS.map()
    // add 1 to the highest task id
    // if there are no tasks set the task id to 1
    const id:number = TASKS.length > 0 ? Math.max(...TASKS.map(hero => hero.id)) + 1: 1;
    return id;
  }


  /**
   * This method fetches all the tasks
   */
  getTasks(): Observable<Task[]> {
    return of(TASKS);
  }

  /**
   *
   * This method finds a task by its id
   * @param id task id
   */
  getTaskById(id: number) {
    // for each task in the list
    for (var i = 0; i < TASKS.length; i++) {
      // check if the task id equals the input id
      if (TASKS[i].id == id) {
        //return the task with the same id
        return TASKS[i];
      }
    }
  }

  /**
   * This method finds a task based on the task name
   * @param name task name
   */
  getTaskByName(name: string) {
    // for each task in the list
    for (var i = 0; i < TASKS.length; i++) {
      // check if the task id equals the input id
      if (TASKS[i].name.toLowerCase() == name.toLowerCase()) {
        // return the task with the same id
        return TASKS[i];
      }
    }
  }

  /**
   * This method deletes a task from the data.
   * @param task Task
   */
  deleteTask(task: Task) {
    // get the index of the task
    const index = TASKS.indexOf(task);
    // check if element isn't the last element in the list
    if (index !== -1) {
      // remove task from list
      TASKS.splice(index, 1);
    }
  }


  /**
   * This method returns a list of tasks that contain the search term
   * @param term the searh term
   */
  searchTasks(term: string): Observable<Task[]>{
    // check if search term exists by removing leading and trailing whitespaces and line terminator characters
    if(!term.trim()){
      // if the search term is empty
      return of([]);
    }

    // get all the tasks which contains the search term
    const matches = TASKS.filter(task => task.name.toLowerCase().includes(term.toLowerCase()))

    // return all matches
    return of(matches);

  }


  /**
   * This method prepares and returns the data for the calendar.
   */
  getCalendarInfo():any[]{
    // this will hold the information for the calendar
    let info=[];

    // different colors
    // const colors=["#a137b9","#2468f0",'#e6a845','#439e43'];

    // for every task
    for(var i = 0; i < TASKS.length; i++){
      // create a temporary dictionary to hold the data
      let temp={};

      // add the information to the dictionary
      temp['title']=TASKS[i].name;
      temp["description"]=TASKS[i].description;
      temp['start']=TASKS[i].duedate;
      temp['extendedProps']= {task:TASKS[i]};

      // add the task information to the info list
      info.push(temp);
    }
    // console.log(info);
    return info;
  }


  /**
   * This method returns the number of tasks per department.
   * The result will be used as data for the graphs in the dashboard component.
   */
  getNumberOfTasksPerDepartment(): {} {
    // temporary dictionary for storing number of tasks
    const dict = {};
    // temporary list for storing number of tasks
    const tasks = [];
    // store departments
    var depts = [];

    // create a list of tasks
    TASKS.forEach(
      (task) =>
      // check if the department is already in the the dictionary, if so increase the number of tasks by 1 else add the department and set to 1
        (dict[this.depService.getDeptById(task.departmentID).name] =
          this.depService.getDeptById(task.departmentID).name in dict
            ? dict[this.depService.getDeptById(task.departmentID).name] + 1
            : 1)
    );

    // for each department in the dictionary add the number of tasks to the list
    for (let key in dict) {
      tasks.push(dict[key]);
    }

    // create list of departments with tasks
    TASKS.forEach((task) =>
      depts.push(this.depService.getDeptById(task.departmentID).name)
    );

    // remove duplicate departments
    var departments = depts.filter((v, i, a) => a.indexOf(v) === i);

    // this list will store the number of tasks and departments in the correct way for the graph
    let deptTaskList = [];

    // for each value in the tasks list
    for (let value in tasks) {

      // create new dictionary
      let res = {};

      // for each department
      for (let name in departments) {

        // add the data to the dictionary
        res['value'] = tasks[value];
        res['name'] = departments[name];

        // add the results to the final list (deptTaskList)
        deptTaskList.push(res);

        // remove department from list so it won't be used again
        departments.shift();

        // stop the for loop and start over
        break;
      }
    }
    return deptTaskList;
  }

}
