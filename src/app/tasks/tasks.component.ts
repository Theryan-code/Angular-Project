import {
  Component,
  OnInit,
} from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from './task';
import { Observable, Subject} from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})

export class TasksComponent implements OnInit {
  title = 'Tasks';
  viewTask: Task;
  editTask: Task;
  edit: boolean;
  addnewtask: boolean;
  tasks: Task[];
  viewDetails:boolean;
  editDetails:boolean;

  // search variables
  //matchedTasks is set as an observable
  matchedTasks$: Observable<Task[]>;
  // searchTerms is a RxJS subject that can be used to retrieve observable values and as observable to push values to.
  private searchTerms = new Subject<string>();

  constructor(private taskService: TaskService) {}

  /**
   * This method gets the all the tasks from the service
   */
  getTasksFromService(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  /**
   * fetch the data once component is created
  */
  ngOnInit(): void {
    this.getTasksFromService();
    this.viewDetails = false;
    this.editDetails = false;

    this.matchedTasks$ = this.searchTerms.pipe(
      // after each keytroke wait 10 ms before considering the search value
      debounceTime(10),

      // ensure that the search text changed
      distinctUntilChanged(),

      // switchmap calls the task search in the task service for each search value and returns only the latest observable
      switchMap((term: string) => this.taskService.searchTasks(term)),
    );
  }

  /**
   * this method toggles the task details
   * @param task the selected task
   */
  showTaskDetails(task: Task): void{
    this.viewTask = task;
    this.edit = false;
    this.viewDetails = true;
  }

  /**
   * This method close the task details
   */
  closeOverlay(): void {
      this.viewTask = null;
      this.editTask = null;
      this.addnewtask = false;
  }

  /**
   * this method is the togle for the add task form
   */
  addTask(): void {
    this.addnewtask = !this.addnewtask;
  }

  /**
   * this method is the toggle to edit the task
   * @param task the selected task
   */
  editTaskDetails(task: Task): void {
    this.editTask = task;
    // this.edit = true;
    // this.editDetails = true;
  }

  /**
   * This method removes the task from the data and it clears the search so that all the remaining tasks will be visible
   * @param task the selected task
   */
  deleteTask(task: Task): void {
    this.clearSearch();
    this.taskService.deleteTask(task);
  }

  /**
   * this methode pushes a search term into the observable stream
   * @param term the search value
   */
  search(term:string): void{
    // everytime the user types into the textbox searchTerms emits the search value into the searchTerms observable
    this.searchTerms.next(term);
  }

  /**
   * this method makes sure that the search is cleared by pushing an empty string into the observable stream
  */
  clearSearch(): void{
    this.searchTerms.next('');
  }
}
