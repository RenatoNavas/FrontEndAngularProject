export class PageList<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  
    constructor() {
      this.items = [];
      this.page = 0;
      this.pageSize = 10;
      this.totalCount = 0;
      this.hasNextPage = false;
      this.hasPreviousPage = false;
    }
  }
  