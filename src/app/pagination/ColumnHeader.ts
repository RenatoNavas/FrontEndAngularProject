export interface ColumnHeader {
    field: string;
    header: string;
    type?: 'select' | 'multiselect' | 'text';
    filter?: boolean;
    filterMatchMode?: string;
    options?: any[];
    optionLabel?: string;
    optionValue?: string;
    class?: string | string[] | { [klass: string]: any };
    style?: { [klass: string]: any };
    hidden?: () => boolean;
    hiddenFilter?: () => boolean;
  }
  