import { Task } from './task';

export const TASKS: Task[] = [
  {
    id: 1,
    name: 'Create Project',
    description: 'Lorem ipsum dolor sit amet',
    duedate: new Date('09-22-2020'),
    departmentID: 1,
    employees: [1, 2],
  },
  {
    id: 2,
    name: 'Define Project',
    description: 'Lorem ipsum dolor sit amet',
    duedate: new Date('10-14-2020'),
    departmentID: 2,
    employees: [1],
  },
  {
    id: 3,
    name: 'Create Business Plan',
    description: 'create a business plan for the company',
    duedate: new Date('10-07-2020'),
    departmentID: 3,
    employees: [1, 3],
  },
  {
    id: 4,
    name: 'Make sales forecast',
    description: 'The sales department should make a sales forecast for 2021',
    duedate: new Date('10-08-2020'),
    departmentID: 4,
    employees: [3],
  },
  {
    id: 5,
    name: 'Make sales plan',
    description:
      'The sales department should make a sales plan that sets out our sales targets and tactics',
    duedate: new Date('01-12-2021'),
    departmentID: 4,
    employees: [1, 2],
  },
  {
    id: 6,
    name: 'Do something',
    description: 'Department 3 needs to do something',
    duedate: new Date('10-08-2020'),
    departmentID: 3,
    employees: [3],
  },
  {
    id: 7,
    name: 'Finish setup',
    description: 'Department 1 needs to do something',
    duedate: new Date('10-08-2020'),
    departmentID: 1,
    employees: [3],
  },

];
