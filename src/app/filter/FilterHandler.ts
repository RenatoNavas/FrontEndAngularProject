import { FilterMetadata } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

export class FilterHandler {
  private filters$ = new BehaviorSubject<Record<string, any>>({});

  asObservable() {
    return this.filters$.asObservable();
  }

  getFilter<T>(key: string) {
    return this.filters$.getValue()[key] as T;
  }
  getFilters(sanitize = true) {
    if (sanitize) return this.getSanitizedFilters();
    return this.filters$.getValue();
  }

  setFilters(query: Record<string, any>) {
    for (const key in query) {
      this.setFilter(key, query[key]);
    }
  }
  setFilter<T>(key: string, value: T) {
    const filters = this.filters$.getValue();
    filters[key] = value;
    this.filters$.next(filters);
  }

  setFiltersMetadata(metadata?: { [s: string]: FilterMetadata }) {
    if (!metadata) return;
    const convertedFilters = this.convertMetadataToFilters(metadata);
    this.setFilters(convertedFilters);
  }

  private convertMetadataToFilters(filters?: { [s: string]: FilterMetadata }): Record<string, any> {
    let query: Record<string, any> = {};
    if (!filters) return query;

    for (const key in filters) {
      query[key] = filters[key].value;
      if (query[key] instanceof Date) query[key] = query[key].toUTCString();
    }
    return query;
  }

  private getSanitizedFilters() {
    const filters = this.filters$.getValue();
    for (const key in filters) {
      if (filters[key] === undefined || filters[key] === null) {
        delete filters[key];
      }
    }
    return filters;
  }
}
