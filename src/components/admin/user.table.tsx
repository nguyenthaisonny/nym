'use client'
import { sendRequest } from "@/utils/api"
import { Button, Table } from "antd"
import { useSession } from "next-auth/react"
import { useState } from "react"



const UserTable = ({
    meta,
    dataSource 
}: {
    meta: MetaPagnigate,
    dataSource: ResultPagnigate[]
}) => {
    const session = useSession()
    const [dataSourceTable, setDataSourceTable] = useState<ResultPagnigate[]>(dataSource)
    const {current, pageSize, pages, total} = meta
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
        },

    ];
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
    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button>Create User</Button>
            </div>
            <Table
                
                bordered
                dataSource={dataSourceTable}
                columns={columns}
                pagination={{
                    pageSize,
                    total
                }}
                onChange={handleChangePagnigattion}
            />
        </>
    )
}

export default UserTable;