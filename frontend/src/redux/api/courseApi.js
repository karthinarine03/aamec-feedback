import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const courseApi = createApi({
    reducerPath : "courseApi",
    baseQuery : fetchBaseQuery({baseUrl:` http://${window.location.hostname}:3000/api/v1`}),
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
        admin: builder.mutation({
            query: (body) => ({
            url: '/admin',
              method: 'POST',
              body
            })
          })
    })
})

export const {useGetSubjectsMutation,useGetFacultyDeptMutation,useAdminMutation} = courseApi