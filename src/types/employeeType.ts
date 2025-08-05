export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  departmentsId?: number;
}

export interface CreateEmployeeData {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  departmentsId?: number;
}

export interface UpdateEmployeeData extends CreateEmployeeData {
  id: string;
}

export interface departments {
  id: number;
  name: string;
  description: string;
  employees: { id: string; name: string }[];
  employeeCount?: number;
}

export interface DepartmentStats {
  [department: string]: {
    count: number;
    employees: Employee[];
  };
}
