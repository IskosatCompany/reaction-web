export interface TableActionsColumn<T = unknown> {
  icon: string;
  callback: (row: T) => void;
  isDisabled?: (row: T) => boolean;
  tooltip?: string;
}
