import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useGetSubjectsMutation } from "../redux/api/courseApi";
import { useGetStudentsQuery } from "../redux/api/studentApi";
import "../SubjectsList.css";

const SubjectsList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  const semester = searchParams.get("sem");
  const section = searchParams.get("sec");
  const atDept = searchParams.get("atDept")
  const id = params.id;

  const { data: studentData, isLoading: studentLoading } = useGetStudentsQuery(id);
  const [getSubjects, { data: subjectData, isLoading: subjectLoading }] = useGetSubjectsMutation();

  const [animatingSubjects, setAnimatingSubjects] = useState([]);

  useEffect(() => {
    if (semester && section) {
      getSubjects({ semester, section });
    }
    
  }, [semester, section]);



  const selectedSubjectTitles = studentData?.data?.subjects?.map((s) => s?.subject) || [];
  const allSubjects = subjectData?.filtered?.[0]?.subjects || [];

  const handleAlreadyReviewedClick = (subjectTitle) => {
    if (!animatingSubjects.includes(subjectTitle)) {
      setAnimatingSubjects((prev) => [...prev, subjectTitle]);
      setTimeout(() => {
        setAnimatingSubjects((prev) => prev.filter((title) => title !== subjectTitle));
      }, 800); // animation duration
    }
  };

  const handleCardClick = (subject) => {
    const subjectTitle = subject.subjectTitle;
    const alreadyReviewed = selectedSubjectTitles.includes(subjectTitle);
    console.log("Clicked subject:", subjectTitle, "Already reviewed:", alreadyReviewed);

    if (alreadyReviewed) {
      handleAlreadyReviewedClick(subjectTitle);
    } else {
      const faculty = encodeURIComponent(subject.faculty);
      const title = encodeURIComponent(subjectTitle);
      const encodedSem = encodeURIComponent(semester);
      const encodedSec = encodeURIComponent(section);

      navigate(
        `/submitReview/${id}?sub=${title}&sem=${encodedSem}&sec=${encodedSec}&atDept=${atDept}&faculty=${faculty}`,
        { replace: true }
      );
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-gradient mb-5">Subjects</h1>

      <div className="row g-4">
        {studentLoading || subjectLoading ? (
          <div className="text-center w-100">
            <div className="spinner-border text-primary" role="status" />
            <p>Loading...</p>
          </div>
        ) : allSubjects.length > 0 ? (
          allSubjects.map((subject, index) => {
            const subjectTitle = subject.subjectTitle;
            const alreadyReviewed = selectedSubjectTitles.includes(subjectTitle);
            const isAnimating = animatingSubjects.includes(subjectTitle);

            return (
              <div className="col-12 col-sm-6 col-lg-4 d-flex" key={index}>
                <div
                  className={`card subject-card w-100 ${alreadyReviewed ? "disabled-card" : ""}`}
                  style={{ cursor: "pointer", opacity: alreadyReviewed ? 0.9 : 1 }}
                  onClick={() => handleCardClick(subject)}
                >
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h5 className="card-title fw-bold">
                      {subject.subjectCode} - {subject.subjectTitle}
                    </h5>
                    <p className="mb-0">{subject.faculty}</p>
                    {alreadyReviewed && (
                      <span className={`tick-animate ${isAnimating ? "tick-bounce" : ""}`}>
                        <i className="bi bi-check-circle-fill tick-icon"></i>
                        Already Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center w-100">
            <p>No subjects available for selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsList;

