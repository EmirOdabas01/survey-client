export interface ValidationError {
  key: string;
  value: string[];
}

export type ValidationErrors = ValidationError[];
