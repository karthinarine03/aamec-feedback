import React, { useState, useEffect } from "react";
import { useAdminMutation, useUpdataCourseMutation } from "../redux/api/courseApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave } from "@fortawesome/free-regular-svg-icons";

const AdminSubjectEditor = () => {
  const [dept, setDept] = useState();
  const [semester, setSemester] = useState();
  const [editingSubjectId, setEditingSubjectId] = useState(null); // Currently editing subject ID
  const [editedSubject, setEditedSubject] = useState({}); // Stores changes locally

  const [adminLogin, { data, isLoading, error }] = useAdminMutation();

  const [updateCourse ,{data : updateData, isLoading : UpdateLoading, error : updateError}] = useUpdataCourseMutation()

  useEffect(() => {
    if (dept && semester) {
      adminLogin({
        dept,
        semester,
      });
    }
  }, [dept, semester]);

  const handleDelete = (id) => {
    console.log("Deleting subject with ID:", id);
    // Hook this to your delete API or JSON write logic
  };

  const handleEditClick = (sub) => {
    setEditingSubjectId(sub.id);
    setEditedSubject({
      subjectCode: sub.subjectCode,
      subjectTitle: sub.subjectTitle,
      faculty: sub.faculty,
    });
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async(id,section) => {
    console.log("Saved data for subject ID:", id);
    console.log(editedSubject);
    // Call your backend or write to JSON here using the `id` and `editedSubject`
    const data = {
      department: dept,
      semester : Number(semester),
      section, 
      id,
      subjectTitle: editedSubject.subjectTitle,
      subjectCode: editedSubject.subjectCode,
      faculty: editedSubject.faculty,
    };
    console.log(data);
    try {
      const response = await updateCourse(data).unwrap();
      console.log("Update successful:", response);
    } catch (err) {
      console.error("Update failed:", err);
    }
    // Reset edit state
    setEditingSubjectId(null);
    setEditedSubject({});
  };

  return (
    <div className="container py-4">
      <h2 className="check mb-4 text-primary text-center fw-semibold text-white">
        Subject Reviews {semester && `- Semester ${semester}`}
      </h2>

      {/* Department Filter */}
      <div className="mb-4 text-center">
        <label className="check me-2 fw-semibold text-white">
          Filter by Department:
        </label>
        <select
          className="form-select d-inline w-auto"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          <option value="">-- Select Department --</option>
          {["Information Technology", "Computer Science Engineering", "Electrical and Communication Engineering", "Electrical Electronic Engineering", "Mechanical Engineering", "Chemical Engineering", "Civil Engineering"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Semester Filter */}
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
          
      {/* Subject List */}
      <div className="row">
        {data?.result[0]?.sections?.map((sect, i) => (
          <div key={i} className="col-6 mb-4">
            <h4 className="text-white">{sect.section}</h4>
            {sect?.subjects?.map((sub, index) => {
              const isEditing = editingSubjectId === sub.id;

              return (
                <div
                  key={sub.id}
                  className="bg-light d-flex justify-content-between align-items-center p-3 mb-2 rounded shadow-sm"
                >
                  <div className="d-flex flex-column gap-2 w-75">
                    <input
                      name="subjectCode"
                      value={
                        isEditing ? editedSubject.subjectCode : sub.subjectCode
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="form-control"
                    />
                    <input
                      name="subjectTitle"
                      value={
                        isEditing ? editedSubject.subjectTitle : sub.subjectTitle
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="form-control"
                    />
                    <input
                      name="faculty"
                      value={
                        isEditing ? editedSubject.faculty : sub.faculty
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="d-flex flex-column align-items-center gap-2">
                    {isEditing ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleSave(sub.id,sect.section)}
                      >
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEditClick(sub)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                      </button>
                    )}
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(sub.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            <button>Add new</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSubjectEditor;
