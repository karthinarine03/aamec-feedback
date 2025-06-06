import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const studentApi = createApi({
    reducerPath : "studentApi",
    baseQuery : fetchBaseQuery({baseUrl:"https://aec2-202-21-40-242.ngrok-free.app/api/v1"}),
    keepUnusedDataFor: 60,
    tagTypes : ["Review"],
    endpoints : (builder)=>({
        registerStudent : builder.mutation({
            query(body){
                return {
                    url :"/addRating",
                    method : "POST",
                    body
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