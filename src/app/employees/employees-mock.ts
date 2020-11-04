import { Employee } from './employees';
import { DEPARTMENTS } from '../departments/mock-departments';

export const EMPLOYEES: Employee[] = [
  {
    id: 1,
    first_name: 'Filip',
    last_name: 'Vangelov',
    birth_date: new Date('05-08-1999'),
    department_id: 1,
  },
  {
    id: 2,
    first_name: 'Lauren',
    last_name: 'van Loo',
    birth_date: new Date('02-06-1999'),
    department_id: 1,
  },
  {
    id: 3,
    first_name: 'Ryan',
    last_name: 'Theodore',
    birth_date: new Date('03-12-1999'),
    department_id: 2,
  },
];

