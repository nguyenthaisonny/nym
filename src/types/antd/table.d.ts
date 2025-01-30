import { ColumnType } from "antd/es/table/interface"

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: ResultPagnigate;
  index: number;
}

interface OptionsColumn<T> extends ColumnType<T> {
    editable?: boolean
    hasSearch?: boolean
    dataIndex: DataIndex,
}
type DataIndex = keyof ResultPagnigate;
  