// types.ts
export interface Env {
    DB: D1Database;
  }
  
  export interface Patient {
    id?: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    email?: string;
    phone?: string;
    address?: string;
    medical_condition?: string;
    last_visit_date?: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }