'use client'
import { OptionsColumn } from "@/types/antd/table";

export const columns: OptionsColumn<ResultPagnigate>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      hasSearch: true,
  },
  {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      hasSearch: true,
  },
  {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      hasSearch: true,
  },
  {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      editable: true,
      hasSearch: true,
  },
  {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
      hasSearch: true,
  },
  {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      hasSearch: true,
  },
];