import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const courseApi = createApi({
    reducerPath : "courseApi",
    baseQuery : fetchBaseQuery({baseUrl:"http://192.168.2.51:3000/api/v1"}),
    keepUnusedDataFor: 60,
    endpoints : (builder)=>({
        getSubjects : builder.mutation({
            query(body){
                return {
                    url :"/subjects",
                    method : "POST",
                    body
                }
            }
        }),
        getFacultyDept : builder.mutation({
            query(body){
                return {
                    url :"/getStaffDept",
                    method : "POST",
                    body
                }
            }
        }),
    })
})

export const {useGetSubjectsMutation,useGetFacultyDeptMutation} = courseApi