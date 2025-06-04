// src/redux/api/staffApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.2.51:3000/api/v1" }),
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    getAllSubjectsReview: builder.query({
      query: () => ({
        url: '/getallSubjectsReview',
        method: 'GET'
      }),
      providesTags:["Review"]
    }),
    getStaffReview: builder.query({
      query: (body) => ({
      url: '/getSubjectReview',
        method: 'GET',
        body
      })
    })
  })
})

export const { useGetAllSubjectsReviewQuery, useGetStaffReviewQuery } = staffApi
