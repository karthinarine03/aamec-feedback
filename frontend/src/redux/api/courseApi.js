import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const courseApi = createApi({
    reducerPath : "courseApi",
    baseQuery : fetchBaseQuery({baseUrl:` http://${window.location.hostname}:3000/api/v1`}),
    tagTypes : ["Admin"],
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
        admin: builder.query({
            query: ({dept,semester}) => ({
            url: `/admin?dept=${dept}&semester=${semester}`,
              method: 'GET',
            }),
            providesTags : ["Admin"],
        }),

        updataCourse : builder.mutation({
            query:(body)=>({
                url : "/admin/updateCourse",
                method : 'PUT',
                body
            }),
            invalidatesTags : ["Admin"],
        }),

        addCourse : builder.mutation({
            query : (body) => ({
                url: "/admin/addCourse",
                method: "POST",
                body
            }),
            invalidatesTags : ["Admin"],
        }),

        deleteCourse : builder.mutation ({
            query : (body)=>({
                url : "/admin/deleteCourse",
                method : "DELETE",
                body
            }),
            invalidatesTags : ["Admin"],
        })
    })
})

export const {useGetSubjectsMutation,useGetFacultyDeptMutation,useAdminQuery,useUpdataCourseMutation, useAddCourseMutation ,useDeleteCourseMutation} = courseApi