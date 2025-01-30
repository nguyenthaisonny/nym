'use client'
import { EditableCell } from "@/constants/antd/table.constants"
import { OptionsColumn } from "@/types/antd/table"
import { sendRequest } from "@/utils/api"
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, EditFilled, EditOutlined, EditTwoTone, SearchOutlined } from "@ant-design/icons"
import { Button, Form, Input, InputNumber, InputRef, notification, Popconfirm, Space, Table, TableColumnsType, TableColumnType, TableProps, Typography } from "antd"
import form from "antd/es/form"
import {  FilterDropdownProps } from "antd/es/table/interface"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import Highlighter from 'react-highlight-words';
import BaseTable from "../ui/BaseTable"
import { columns } from '@/constants/user.constants';
import { useAppContext } from "@/library/contexts/app.context"


interface IUserTable {
  meta: MetaPagnigate,
  dataSource: ResultPagnigate[]
}

const UserTable = ({
    meta,
    dataSource,
}: IUserTable) => {
     const session = useSession()
     const {currentPage} = useAppContext()!;
     const {pageSize} = meta
    const [dataSourceTable, setDataSourceTable] = useState<ResultPagnigate[]>(dataSource)
    const handleOnSave = async (id: string, updatedData: any) => {
      const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
          method: 'PATCH',
          headers: {
              Authorization: `Bearer ${session?.data?.user?.access_token}`,
          },
          body: {
              _id: id,
              ...updatedData
          }
      });
      if (!res?.data) {
          notification.error({
              message: "Error Updating user",
              description: res.error,
          });
          return
      }
      fetchUsers(currentPage, pageSize);
      notification.success({
        message: "User updated successfully",
      });
    }
    const fetchUsers = async (current: number, pageSize: number) => {
      const updatedRes = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
             method: 'GET',
             headers: {
                 Authorization: `Bearer ${session?.data?.user?.access_token}`,
             },
             queryParams: {
                 current, 
                 pageSize
             },
             nextOption: {
                 next: { tag: ['list-users'] },
             },
         });
         if (!updatedRes?.data) {
            notification.error({
              message: "Error fetching updated user list",
              description: updatedRes.error,
            });
            return
          } 
         setDataSourceTable(updatedRes.data.results ?? []);
     }
    const handleOnDelete = async (id: string) => {
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
          return
        }
        fetchUsers(currentPage, pageSize);
        notification.success({
            message: "User deleted successfully",
        });
      };
    

    const handleOnChangePagination = async (e: any) => {
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
    return (
      <BaseTable
        meta={meta}
        dataSource={dataSourceTable}
        columns={columns}
        showActions
        handleChangePagination={handleOnChangePagination}
        handleSave={handleOnSave}
        handleDelete={handleOnDelete}
    />
    )
}

export default UserTable;