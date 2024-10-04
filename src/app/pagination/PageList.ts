export class PageList<T> {
    items: T[] = [];
    totalCount: number = 0;
    page: number = 1;
    pageSize: number = 10;
    hasNextPage: boolean = false;
    hasPreviousPage: boolean = false;
  }
  