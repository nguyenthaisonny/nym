import { ColumnType } from "antd/es/table/interface"

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: ResultPagnigate;
  index: number;
}

interface EditableColumn<T> extends ColumnType<T> {
    editable?: boolean
}
type DataIndex = keyof ResultPagnigate;
  