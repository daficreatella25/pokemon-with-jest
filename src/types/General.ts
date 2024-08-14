export interface withPagination<T> {
  count: number;
  next: string;
  results: T[];
}
