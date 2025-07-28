import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const studentApi = createApi({
    reducerPath : "studentApi",
    baseQuery : fetchBaseQuery({baseUrl:` http://${window.location.hostname}:3000/api/v1`}),
    keepUnusedDataFor: 60,
    tagTypes : ["Review"],
    endpoints : (builder)=>({
        registerStudent : builder.mutation({
            query(body){
                return {
                    url :"/addRating",
                    method : "POST",
                    body,
                    headers: {
                        "Content-Type": "application/json",
                      }
                }
            }
        }),
        addSubjectReview : builder.mutation({
            query({id,body}){
                return {
                    url :`/updatefeedback/${id}`,
                    method : "PUT",
                    body
                }
            },
            invalidatesTags : ["Review"]
            
        }),
        getStudents: builder.query({
            query: (id) => ({
            url: `/getStudent/${id}`,
            method: 'GET'
        }),
        providesTags : ["Review"]
        })
    })
})

export const {useRegisterStudentMutation, useAddSubjectReviewMutation,useGetStudentsQuery} = studentApi