import React, { useEffect, useState } from "react";
import { useAddSubjectReviewMutation } from "../redux/api/studentApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Questions } from "./helper/Question";
import { Rate } from "antd";
import "antd/dist/reset.css";
import "../SubmitReview.css";
import { useGetFacultyDeptMutation } from "../redux/api/courseApi";

const SubmitReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();

  const tips = ['VERY POOR', 'BAD', 'NORMAL', 'GOOD', 'EXCELLENT'];
  const [score, setScore] = useState(new Array(Questions.length).fill(0));
  const [comments, setComments] = useState('');

  const subject = searchParams.get("sub");
  const semester = searchParams.get("sem");
  const section = searchParams.get("sec");
  const faculty = searchParams.get("faculty");
  const atDept = searchParams.get("atDept")
  const id = params.id;

  const [addReview, { data,error, isLoading, isSuccess }] = useAddSubjectReviewMutation();
  const [getFacultyDept,{data:facultyData,error:facultError,isLoading : facultyLoading}] = useGetFacultyDeptMutation()

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully submitted");
      navigate(`/subjectList/${id}?sem=${semester}&sec=${section}&atDept=${atDept}`);
    }
  }, [isSuccess, navigate]);

  useEffect(()=>{
    const value = {
      faculty
    }

    getFacultyDept(value)
  },[faculty])

  console.log(facultError,facultyData,faculty);
  const departments = facultyData?.departments[0]
  console.log(departments);
  
  const score_submit = (e) => {
    e.preventDefault();
    if (score.includes(0)) {
      toast.error("Please rate all questions");
      return;
    }

    const totalRating = score.reduce((sum, val) => sum + val, 0);
    const value = {
      id,
      body: {
        atDept,
        subjects: [
          {
            subject,
            rating: totalRating,
            comment: comments,
            faculty,
            dept : departments,
            semester
          },
        ],
      },
    };

    addReview(value);
  };

  console.log(data,error);
  

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 text-gradient">Feedback: {subject}</h1>
      <form onSubmit={score_submit}>
        <div className="row g-4">
          {Questions.map((question, index) => (
            <div className="col-md-6" key={index}>
              <div className="card p-3 shadow-sm h-100 question-card">
                <h5 className="mb-3">{index + 1}. {question.ques}</h5>
                <Rate
                  tooltips={tips}
                  className="ratingstar"
                  allowClear={false}
                  onChange={(count) => {
                    const updatedScores = [...score];
                    updatedScores[index] = parseFloat(count);
                    setScore(updatedScores);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h4 className="mb-3">Additional Comments</h4>
          <textarea
            className="form-control shadow-sm"
            rows="4"
            placeholder="Write your comments here..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-5 py-2" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger text-center mt-3" role="alert">
            Error: {error.message || "Submission failed"}
          </div>
        )}
      </form>
    </div>
  );
};

export default SubmitReview;