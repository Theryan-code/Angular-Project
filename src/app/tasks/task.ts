export class Task {
  id: number;
  name: string;
  description: string;
  duedate: Date;
  departmentID: number;
  employees: number[] = [];
}
