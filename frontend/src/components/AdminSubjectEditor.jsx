import React, { useState, useEffect } from "react";
import { useAdminMutation } from "../redux/api/courseApi";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
const AdminSubjectEditor = () => {
  const [dept, setDept] = useState();
  const [semester, setSemester] = useState();
  const body = {
    dept,
    semester,
  };

  const [adminLogin, { data, isLoading, error }] = useAdminMutation();

  useEffect(() => {
    adminLogin({
      dept: dept == "IT" && "Information Technology",
      semester: semester,
    });
  }, [semester, dept]);
  console.log(data, isLoading, error);
  data?.result[0]?.sections?.map((sect) => {
    sect?.subjects?.map((sub) => console.log(sub.faculty));
  });
  return (
    <div>
      <div className="container">
        <div>
          <div className="container py-4">
            <h2 className="check mb-4 text-primary text-center fw-semibold text-white">
              Subject Reviews {semester && `- Semester ${semester}`}
            </h2>

            <div className="mb-4 text-center">
              <label className="check me-2 fw-semibold text-white">
                Filter by Departement:
              </label>
              <select
                className="form-select d-inline w-auto"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {["IT", "CSE", "ECE", "EEE", "MECH", "CHEMICAL", "CIVIL"].map(
                  (sem) => (
                    <option key={sem} value={sem}>{`${sem}`}</option>
                  )
                )}
              </select>
            </div>

            <div className="mb-4 text-center">
              <label className="check me-2 fw-semibold text-white">
                Filter by Semester:
              </label>
              <select
                className="form-select d-inline w-auto"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">-- Select Semester --</option>
                {[3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>{`Semester ${sem}`}</option>
                ))}
              </select>
            </div>

            <div className="row">
              {data?.result[0]?.sections?.map((sect, i) => (
                <div key={i} className="col-6 ">
                  <h1 className="justify-self-center">{sect.section}</h1>
                  {sect?.subjects?.map((sub, index) => (
                    <div className="bg-light d-flex justify-content-center gap-3">
                      <div className="">
                        <input value={sub.subjectTitle} className=""/>
                        <FontAwesomeIcon icon={faPenToSquare}/>

                      </div>
                      <div>
                        <input value={sub.faculty} readOnly  className="full-width"/>
                        <FontAwesomeIcon icon={faPenToSquare}/>

                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubjectEditor;
