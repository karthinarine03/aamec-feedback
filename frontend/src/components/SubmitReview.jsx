import React, { useEffect, useRef, useState } from "react";
import { useAddSubjectReviewMutation } from "../redux/api/studentApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Questions } from "./helper/Question";
import { Rate } from "antd";
import gsap from "gsap";
import "antd/dist/reset.css";
import "../SubmitReview.css";
import { useGetFacultyDeptMutation } from "../redux/api/courseApi";

const SubmitReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const questionRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(new Array(Questions.length).fill(0));
  const [comments, setComments] = useState("");

  const subject = searchParams.get("sub");
  const semester = searchParams.get("sem");
  const section = searchParams.get("sec");
  const faculty = searchParams.get("faculty");
  const atDept = searchParams.get("atDept");
  const id = params.id;

  const [addReview, { error, isLoading, isSuccess }] = useAddSubjectReviewMutation();
  const [getFacultyDept, { data: facultyData }] = useGetFacultyDeptMutation();

  const departments = facultyData?.departments?.[0];

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully submitted");
      navigate(`/subjectList/${id}?sem=${semester}&sec=${section}&atDept=${atDept}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    getFacultyDept({ faculty });
  }, [faculty]);

  const animateSlide = (direction) => {
    const tl = gsap.timeline();
    tl.to(questionRef.current, {
      x: direction === "next" ? -100 : 100,
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrent((prev) => prev + (direction === "next" ? 1 : -1));
      },
    });
  };

  useEffect(() => {
    gsap.fromTo(
      questionRef.current,
      { x: 100, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [current]);

  const handleNext = () => {
    if (score[current] === 0) {
      toast.error("Please rate this question");
      return;
    }
    if (current < Questions.length) animateSlide("next");
  };

  const handlePrevious = () => {
    if (current > 0) animateSlide("prev");
  };

  const handleSubmit = (e) => {
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
            dept: departments,
            semester,
          },
        ],
      },
    };

    addReview(value);
  };

  const progressPercent = Math.round((current / (Questions.length + 1)) * 100);

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      <h2 className="text-center mb-4 text-gradient">Feedback: {subject}</h2>

      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div ref={questionRef}>
          {current < Questions.length ? (
            <div className="card p-4 mt-4 shadow-sm question-card">
              <h5 className="mb-3 text-white">
                {current + 1}. {Questions[current].ques}
              </h5>
              <Rate
                tooltips={["VERY POOR", "BAD", "NORMAL", "GOOD", "EXCELLENT"]}
                className="ratingstar"
                allowClear={false}
                value={score[current]}
                onChange={(value) => {
                  const updatedScores = [...score];
                  updatedScores[current] = value;
                  setScore(updatedScores);
                }}
              />
            </div>
          ) : (
            <div className="card p-4 mt-4 shadow-sm question-card">
              <h4 className="mb-3 text-white">Additional Comments</h4>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Write your comments here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-outline-light px-4"
            onClick={handlePrevious}
            disabled={current === 0}
          >
            Previous
          </button>

          {current < Questions.length ? (
            <button type="button" className="btn btn-primary px-4" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-success px-5 mx-4"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Feedback"}
            </button>
          )}
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
