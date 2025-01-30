'use client'
import { EditableCell } from "@/constants/antd/table.constants"
import { useAppContext } from "@/library/contexts/app.context"
import { OptionsColumn } from "@/types/antd/table"
import { sendRequest } from "@/utils/api"
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, EditFilled, EditOutlined, EditTwoTone, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, InputNumber, InputRef, notification, Popconfirm, Space, Table, TableColumnsType, TableColumnType, TableProps, Typography } from "antd"
import form from "antd/es/form"
import {  FilterDropdownProps } from "antd/es/table/interface"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import Highlighter from 'react-highlight-words';


interface IDefaultColumn {
    title: string
    dataIndex: DataIndex,
    key: string
}
interface IBaseTable {
  meta: MetaPagnigate;
  dataSource: ResultPagnigate[];
  columns: OptionsColumn<ResultPagnigate>[] | IDefaultColumn[];
  showActions?: boolean;
  handleChangePagination?: (pagination: any) => Promise<void>;
  handleSave?: (id: string, updatedData: any) => Promise<void>;
  handleDelete?: (id: string) => Promise<void>;
}


const BaseTable = ({
    meta,
    dataSource,
    columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        hasSearch: true,
        editable: true
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        hasSearch: true
      },
    ],
    showActions = false,
    handleChangePagination = async () => {},
    handleSave = async () => {},
    handleDelete = async () => {}

}: IBaseTable) => {
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [editingKey, setEditingKey] = useState('');
    const {current, pageSize, pages, total} = meta
    const {currentPage, setCurrentPage} = useAppContext()!;

    const isEditing = (record: ResultPagnigate) => record._id === editingKey;

    const edit = (record: Partial<ResultPagnigate> & { _id: React.Key }) => {
        form.setFieldsValue({...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
      };
    
      const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ResultPagnigate> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <h1>{dataIndex}</h1>
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearchText((selectedKeys as string[])[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            if(record[dataIndex]) {
                return record[dataIndex]
                  .toString()
                  .toLowerCase()
                  .includes((value as string).toLowerCase())
            }
            return false
        },
        filterDropdownProps: {
          onOpenChange(open) {
            if (open) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
    const handleOnSave = async (id: string) => {
      const updatedData = (await form.validateFields()) as ResultPagnigate;
      await handleSave(id, updatedData);
      setEditingKey('');
    }
    const handleOnChangePagination = async (e: any) => {
      handleChangePagination(e);
      setCurrentPage(e.current)
    }
    const columnsTable: OptionsColumn<ResultPagnigate>[] = (showActions ? 
      [...columns, ({
          title: 'Actions',
          dataIndex: 'actions',
          render: (_: any, record: ResultPagnigate) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
                <Typography.Link onClick={() => handleOnSave(record._id)} style={{ marginInlineEnd: 8 }}>
                  Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link disabled={editingKey !== ''} >
                  <EditTwoTone style={{fontSize: "24px", marginRight: "8px"}} onClick={() => edit(record)}/>
                  <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                      <DeleteTwoTone style={{fontSize: "24px"}} twoToneColor={"#ff3333"}/>
                  </Popconfirm>
              </Typography.Link>
            );
          },
        })
      ] : 
      columns)

     const mergedColumns : any= columnsTable.map((col) => {
        if (!col.editable || !col.hasSearch) {
          return col;
        }
        return {
          ...col,
          onCell: (record: ResultPagnigate) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      }).map((col) => {
        if(!col.hasSearch) {
          return col
        }
        return {
          ...col,
          ...getColumnSearchProps(col.dataIndex)
        }
      })
      
    return (
        <Form form={form} component={false}>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button>Create User</Button>
            </div>
            <Table<ResultPagnigate>
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={dataSource}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    pageSize,
                    total,
                    current: currentPage
                }}
                onChange={handleOnChangePagination}
            />
        </Form>
    )
}

export default BaseTable;