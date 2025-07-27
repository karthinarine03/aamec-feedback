import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const courseApi = createApi({
    reducerPath : "courseApi",
    baseQuery : fetchBaseQuery({baseUrl:" http://192.168.189.134:3000/api/v1"}),
    keepUnusedDataFor: 60,
    endpoints : (builder)=>({
        getSubjects : builder.mutation({
            query(body){
                return {
                    url :"/subjects",
                    method : "POST",
                    body,
                    headers: {
                        "Content-Type": "application/json",
                      }
                }
            }
        }),
        getFacultyDept : builder.mutation({
            query(body){
                return {
                    url :"/getStaffDept",
                    method : "POST",
                    body,
                    headers: {
                        "Content-Type": "application/json",
                      }
                }
            }
        }),
    })
})

export const {useGetSubjectsMutation,useGetFacultyDeptMutation} = courseApi