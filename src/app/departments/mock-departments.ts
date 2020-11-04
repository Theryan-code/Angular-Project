import { Dept } from './department';
import { EMPLOYEES } from '../employees/employees-mock';

export const DEPARTMENTS: Dept[] = [
  {
    id: 1,
    name: 'R & D',
    building: 'R1',
    employeeID: [1, 2, 3],
  },
  {
    id: 2,
    name: 'IT',
    building: 'R2',
    employeeID: [1, 2, 3],
  },
  {
    id: 3,
    name: 'Business',
    building: 'R3',
    employeeID: [ 1, 2, 3],
  },
  {
    id: 4,
    name: 'Sales',
    building: 'R4',
    employeeID: [1, 2, 3],
  },
];
