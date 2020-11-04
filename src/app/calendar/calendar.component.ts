import { Component, OnInit} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { TaskService } from '../task.service';
import { DeptService } from '../department.service'
import { Task } from '../tasks/task';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  // get all the data to display in the calendar
  events = this.taskService.getCalendarInfo();
  selectedTask:string;
  viewTask: Task;

  constructor(
    private taskService:TaskService, private deptService:DeptService
    ) { }

  ngOnInit(): void {}

  /**
   * This method close the task details
   */
  closeOverlay(): void {
    this.viewTask = null;
  }

  test(){
    return "this is a test"
  }

  // this sets the calendar options
  calendarOptions: CalendarOptions = {
    // show the calendar as month
    initialView: 'dayGridMonth',
    // assign the events
    events: this.events,
    eventClick: function(info){
      this.viewTask = info.event.extendedProps.task
      Swal.fire({
        title: this.viewTask.name,
        html: this.viewTask.description + "<br><br> Department ID: " + this.viewTask.departmentID + "<br><br>" + this.viewTask.employees.length + " employee" + (this.viewTask.employees.length > 1 ? "s are" : ' is')+ " assigned to this task" + "<hr> For more information go to Tasks",
        icon:"info",
      });
    },
    // no time
    displayEventTime:false,
    // with time
    // displayEventTime:true,
    // eventTimeFormat:{
    //   hour: 'numeric',
    //   minute: '2-digit',
    //   meridiem: false
    // },
    // default event color
    eventColor: 'rgb(51,122,183)',
    // calendar height 85% of the viewport height
    height:'85vh',
  }

};




