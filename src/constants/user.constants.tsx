'use client'
import { OptionsColumn } from "@/types/antd/table";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Popconfirm, Tag, Typography } from "antd";
import { RuleObject } from "antd/es/form";

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
  }
];

export const createUserInputs: itemInput[] = [
    {
        label: 'Name',
        name: 'name',
        rules: [
            {
                required: true,
                message: 'Please input your name!',
            },
        ],
    },
    {
        label: 'Email',
        name: 'email',
        rules: [
            {
                required: true,
                message: 'Please input your email!',
            },
            {
                type: 'email',
                message: 'The input is not a valid email!',
            },
        ],
    },
    {
        label: 'Password',
        name: 'password',
        type: 'password',
        rules: [
            {
                required: true,
                message: 'Please input your password!',
            },
        ],
    },
    {
        label: 'Confirm Password',
        name: 'confirmPassword',
        type: 'password',
        hasFeedback: true,
        rules: [
            {
                required: true,
                message: 'Please confirm your password!',
            },
            ({ getFieldValue }: { getFieldValue: any }) => ({
                validator(_: RuleObject, value: any) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(
                        new Error('The new password that you entered do not match!')
                    );
                },
            }),
        ],
    },
    {
        label: 'Phone',
        name: 'phone',
        rules: [
            {
                required: true,
                message: 'Please input your phone number!',
            },
            {
                pattern: /^\+?[1-9]\d{1,14}$/,
                message: 'Please enter a valid phone number with country code (e.g., +123456789)!',
            },
        ],
    },
    {
        label: 'Address',
        name: 'address',
        rules: [
            {
                required: true,
                message: 'Please input your address!',
            },
            {
                min: 10,
                message: 'Address must be at least 10 characters long!',
            },
        ],
    },
];
