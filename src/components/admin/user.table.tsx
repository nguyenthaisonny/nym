'use client'

import { sendRequest } from "@/utils/api"
import { Button, notification, } from "antd"
import { useState } from "react"
import BaseTable from "@/components/ui/BaseTable"
import { columns, createUserInputs } from '@/constants/user.constants';
import { useAppContext } from "@/library/contexts/app.context"
import CreateUserModal from "../modal/user/CreateUserModal"
import useUser from "@/hooks/useUser"

interface IUserTable {
  meta: MetaPagnigate,
  dataSource: ResultPagnigate[]
}

const UserTable = ({
    meta,
    dataSource,
}: IUserTable) => {
    const  {accessToken} = useUser()
    const {currentPage} = useAppContext()!;
    const {pageSize} = meta
    const [dataSourceTable, setDataSourceTable] = useState<ResultPagnigate[]>(dataSource)
    const [openCreateUserModal, setOpenCreateUserModal] = useState(false)
    const handleOnSave = async (id: string, updatedData: any) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                _id: id,
                ...updatedData
            }
        });
      if (!res?.data) {
          notification.error({
              message: "Error Updating user",
              description: res.message,
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
                 Authorization: `Bearer ${accessToken}`,
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
              Authorization: `Bearer ${accessToken}`,
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
                   Authorization: `Bearer ${accessToken}`
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
    const handleCreateUser = () => {
        setOpenCreateUserModal(true)
    }
    const handleSubmitUser = async (value: any) => {
        const { confirmPassword, ...dataSubmit} = value
        const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: {
                ...dataSubmit
            }
        });
      if (!res?.data) {
          notification.error({
              message: "Error Creating user",
              description: res.message,
          });
          return
      }
      fetchUsers(currentPage, pageSize);
      notification.success({
        message: "User created successfully",
      });
      setOpenCreateUserModal(false);
    }
    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button onClick={handleCreateUser}>Create User</Button>
            </div>
            <BaseTable
                meta={meta}
                dataSource={dataSourceTable}
                columns={columns}
                showActions
                handleChangePagination={handleOnChangePagination}
                handleSave={handleOnSave}
                handleDelete={handleOnDelete}
            />
            <CreateUserModal 
                isModalOpen={openCreateUserModal} 
                setIsModalOpen={setOpenCreateUserModal} 
                items={createUserInputs}
                onFinish={handleSubmitUser}
            />
        </>
    )
}

export default UserTable;