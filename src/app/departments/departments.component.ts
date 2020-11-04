import { 
  Component, 
  OnInit,
} from '@angular/core';
import { Dept } from './department';
import { DeptService } from '../department.service';
import { Observable, Subject} from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {


  title = 'Departments';
  viewDept: Dept;
  editDept: Dept;
  edit: boolean;
  addnewdept: boolean;
  depts: Dept[];
  viewDetails:boolean;
  editDetails:boolean;

  // search variables
  //matchedDepts is set as an observable
  matchedDepts$: Observable<Dept[]>;
  // searchTerms is a RxJS subject that can be used to retrieve observable values and as observable to push values to.
  private searchTerms = new Subject<string>();

  constructor(private deptService: DeptService) {}

  /**
   * This method gets the all the Depts from the service
   */
  getDeptsFromService(): void {
    this.deptService.getDepts().subscribe((depts) => (this.depts = depts));
  }

  /**
   * fetch the data once component is created
  */
  ngOnInit(): void {
    this.getDeptsFromService();
    this.viewDetails = false;
    this.editDetails = false;

    this.matchedDepts$ = this.searchTerms.pipe(
      // after each keytroke wait 10 ms before considering the search value
      debounceTime(10),

      // ensure that the search text changed
      distinctUntilChanged(),

      // switchmap calls the dept search in the dept service for each search value and returns only the latest observable
      switchMap((term: string) => this.deptService.searchDepts(term)),
    );
  }

  /**
   * this method toggles the Dept details
   * @param dept the selected dept
   */
  showDeptDetails(dept: Dept): void{
    this.viewDept = dept;
    this.edit = false;
    this.viewDetails = true;
  }

  /**
   * This method close the Dept details
   */
  closeOverlay(): void {
      this.viewDept = null;
      this.editDept = null;
      this.addnewdept = false;
  }

  /**
   * this method is the togle for the add Dept form
   */
  addDept(): void {
    this.addnewdept = !this.addnewdept;
  }

  /**
   * this method is the toggle to edit the dept
   * @param dept the selected dept
   */
  editDeptDetails(dept: Dept): void {
    this.editDept = dept;
    // this.edit = true;
    // this.editDetails = true;
  }

  /**
   * This method removes the dept from the data and it clears the search so that all the remaining depts will be visible
   * @param dept the selected dept
   */
  deleteDept(dept: Dept): void {
    this.clearSearch();
    this.deptService.deleteDept(dept);
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
