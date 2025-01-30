import { auth } from "@/auth";
import UserTable from "@/components/admin/user.table";
import { sendRequest } from "@/utils/api";
import { notification } from "antd";

const ManageUserPage = async ({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  })  => {

    const current = searchParams?.current ?? 1
    const pageSize = searchParams?.pageSize ?? 10
    const session = await auth();
    const res = await sendRequest<IBackendRes<IModelPaginate<ResultPagnigate>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: 'GET',
        headers: {
           Authorization: `Bearer ${session?.user?.access_token}`
        },
        queryParams: {
            current,
            pageSize
        },
        nextOption: {
            next: {tag: ['list-users']}
        }
    })
    if(!res?.data) {
        notification.error({
        message: "Error fetching users",
        description: res.error,
      });   
    }
    const dataSource = res?.data?.results.map((data, key) => ({...data, key})) 
    return (
        <div>
            <UserTable 
                meta={res?.data?.meta ?? { current: 1, pageSize: 10, pages: 0, total: 0 }}
                dataSource={dataSource ?? []}
            />
        </div>
    )
}

export default ManageUserPage;