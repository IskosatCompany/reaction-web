export interface TableActionsColumn<T = unknown> {
  icon: string;
  color?: string;
  callback?: (row: T) => void;
  isDisabled?: (row: T) => boolean;
  isHidden?: (row: T) => boolean;
  tooltip?: (row: T) => string;
}
