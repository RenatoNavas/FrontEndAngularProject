import { FilterHandler } from '../filter/FilterHandler';
import { ColumnHeader } from '../pagination/ColumnHeader';
import { PageList } from '../pagination/PageList';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { BehaviorSubject } from 'rxjs';

export class PaginatorHandler<T> {
  columns: ColumnHeader[] = [];
  page: PageList<T> = new PageList<T>();
  private started = false;
  private $loading = new BehaviorSubject<boolean>(false);
  private filterHandler = new FilterHandler();

  pageCount = 0;
  rows = 10;
  rowsPerPage = [10, 25, 50];
  loading = false;

  constructor(private handler: (query: Record<string, any>) => Promise<PageList<T>>) {}

  async init() {
    setTimeout(async () => {
      try {
        this.started = true;
        const page = this.filterHandler.getFilter<number | string | undefined>('page');
        this.pageCount = page ? (Number(page) - 1) * this.rows : 0;

        await this.next({ first: this.pageCount, rows: this.rows });
      } catch (error) {
        this.started = false;
      }
    }, 0);
  }

  reload() {
    this.next({ first: this.pageCount, rows: this.rows });
  }
  async next(event: LazyLoadEvent) {
    if (!this.started) return;
    this.pageCount = event.first || 0;

    let nextPage = event.first ? event.first / this.rows + 1 : 1;
    let hasNext = event.first !== undefined && (event.first === 0 || event.first >= this.rows);

    if (event.rows && event.rows !== this.rows) {
      this.rows = event.rows;
    }

    if (hasNext) {
      this.filterHandler.setFilter<number>('page', nextPage);
      this.filterHandler.setFilter<number>('pageSize', this.rows);
      try {
        this.loading = true;
        this.$loading.next(true);
        this.filterHandler.setFiltersMetadata(event.filters);
        const query = this.filterHandler.getFilters();
        this.page = await this.handler(query);
      } finally {
        this.loading = false;
        this.$loading.next(false);
      }
    }
  }

  get filters(): Record<string, any> {
    return this.filterHandler.getFilters();
  }

  set filters(value: Record<string, any>) {
    this.filterHandler.setFilters(value);
  }

  async onPage(event: { rows: number; first: number }) {
    this.rows = event.rows;
  }

  setFilters(query: Record<string, any>) {
    this.filterHandler.setFilters(query);
  }

  getFilters() {
    return this.filterHandler.getFilters();
  }

  onFilter(value: any, field: string, filterMatchMode?: string, dt?: Table) {
    this.filterHandler.setFilter(field, value);
    dt?.filter(value, field, filterMatchMode ? filterMatchMode : 'contains');
  }

  setPage(list: PageList<T>) {
    this.page = list;
  }

  observeFilters() {
    return this.filterHandler.asObservable();
  }

  get loading$() {
    return this.$loading.asObservable();
  }
  setColumns(columns: ColumnHeader[]) {
    this.columns = columns;
  }
}
