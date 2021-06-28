export interface Column {
  width: number;
  content: string;
}

export interface Row {
  columns: Column[]
}

export interface WysiwygGrid {
  rows: Row[];
}
