import React, { useState } from "react";
import { useAdminQuery } from "../redux/api/courseApi";
const AdminSubjectEditor = () => {
  const { data, isLoading } = useAdminQuery();

  const [dept,setDept] = useState()
  const [semester,setSemester] = useState()
  console.log(data);
  return (
    <div>
      <div className="container">
        <div>
          <div className="container py-4">
            <h2 className="check mb-4 text-primary text-center fw-semibold text-white">
              Subject Reviews{" "}
              {semester && `- Semester ${semester}`}
            </h2>

            <div className="mb-4 text-center">
              <label className="check me-2 fw-semibold text-white">
                Filter by Departement:
              </label>
              <select
                className="form-select d-inline w-auto"
                value={dept}
                // onChange={handleDeptChange}
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
                // onChange={handleSemesterChange}
              >
                <option value="">-- Select Semester --</option>
                {[3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>{`Semester ${sem}`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubjectEditor;
