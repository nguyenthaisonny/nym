'use client'
import { EditableCell } from "@/constants/antd/table.constants"
import { EditableColumn } from "@/types/antd/table"
import { sendRequest } from "@/utils/api"
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, EditFilled, EditOutlined, EditTwoTone, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, InputNumber, InputRef, notification, Popconfirm, Space, Table, TableColumnsType, TableColumnType, TableProps, Typography } from "antd"
import form from "antd/es/form"
import {  FilterDropdownProps } from "antd/es/table/interface"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import Highlighter from 'react-highlight-words';



const UserTable = ({
    meta,
    dataSource 
}: {
    meta: MetaPagnigate,
    dataSource: ResultPagnigate[]
}) => {
    const session = useSession()
    const [dataSourceTable, setDataSourceTable] = useState<ResultPagnigate[]>(dataSource)
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [editingKey, setEditingKey] = useState('');
    const {current, pageSize, pages, total} = meta

    const isEditing = (record: ResultPagnigate) => record._id === editingKey;

    const edit = (record: Partial<ResultPagnigate> & { _id: React.Key }) => {
        form.setFieldsValue({...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as ResultPagnigate;
            const {name, phone, address } = row
            
            const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${session?.data?.user?.access_token}`,
                },
                body: {
                    _id: key,
                    name,
                    phone,
                    address 
                }
            });
            console.log('update res', res);
            
            if (!res?.data) {
                notification.error({
                    message: "Error Updating user",
                    description: res.error,
                });
            } else {
                notification.success({
                    message: "User updated successfully",
                });
        
                // Fetch the updated user list
                const updatedRes = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${session?.data?.user?.access_token}`,
                    },
                    queryParams: {
                        current: 1, 
                        pageSize: 10,
                    },
                    nextOption: {
                        next: { tag: ['list-users'] },
                    },
                });
        
                if (updatedRes?.data) {
                    setDataSourceTable(updatedRes.data.results ?? []);
                } else {
                    notification.error({
                        message: "Error fetching updated user list",
                        description: updatedRes.error,
                    });
                }
            }
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
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
    
    const columns:  EditableColumn<ResultPagnigate>[] = [
        {
          title: 'Name',
          dataIndex: 'name',
          editable: true,
          key: 'name',
          ...getColumnSearchProps('name'),
      },
      {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          ...getColumnSearchProps('email')
      },
      {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
          ...getColumnSearchProps('role')
      },
      {
          title: 'Phone',
          dataIndex: 'phone',
          editable: true,
          key: 'phone',
          ...getColumnSearchProps('phone')
      },
      {
          title: 'Address',
          dataIndex: 'address',
          editable: true,
          key: 'address',
          ...getColumnSearchProps('address')
      },
      {
          title: 'Active',
          dataIndex: 'isActive',
          key: 'isActive',
          ...getColumnSearchProps('isActive')
      },
      {
        title: 'Actions',
        dataIndex: 'operation',
        render: (_: any, record: ResultPagnigate) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link onClick={() => save(record._id)} style={{ marginInlineEnd: 8 }}>
                Save
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingKey !== ''} >
                <EditTwoTone style={{fontSize: "24px", marginRight: "8px"}} onClick={() => edit(record)}/>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteUser(record._id)}>
                    <DeleteTwoTone style={{fontSize: "24px"}} twoToneColor={"#ff3333"}/>
                </Popconfirm>
            </Typography.Link>
          );
        },
      },
    ];
    const handleDeleteUser = async (id: string) => {
        setLoading(true);
        const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${session?.data?.user?.access_token}`,
            },
        });
    
        if (!res?.data) {
            notification.error({
                message: "Error deleting user",
                description: res.error,
            });
        } else {
            notification.success({
                message: "User deleted successfully",
            });
    
            const updatedRes = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${session?.data?.user?.access_token}`,
                },
                queryParams: {
                    current: 1, 
                    pageSize: 10,
                },
                nextOption: {
                    next: { tag: ['list-users'] },
                },
            });
    
            if (updatedRes?.data) {
                setDataSourceTable(updatedRes.data.results ?? []);
            } else {
                notification.error({
                    message: "Error fetching updated user list",
                    description: updatedRes.error,
                });
            }
        }
    
        setLoading(false);
    };
    

    const handleChangePagnigattion = async (e: any) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
                method: 'GET',
                headers: {
                   Authorization: `Bearer ${session?.data?.user?.access_token}`
                },
                queryParams: {
                    current: e.current,
                    pageSize: e.pageSize
                },
                nextOption: {
                    next: {tag: ['list-users']}
                }
            })
        setDataSourceTable(res?.data?.results ?? [])
    }

     const mergedColumns : any = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: ResultPagnigate) => ({
            record,
            inputType: col.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });
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
                dataSource={dataSourceTable}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    pageSize,
                    total
                }}
                onChange={handleChangePagnigattion}
            />
        </Form>
    )
}

export default UserTable;