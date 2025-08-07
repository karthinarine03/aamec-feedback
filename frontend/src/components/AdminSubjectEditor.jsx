import React, { useState, useEffect } from "react";
import {
  useAddCourseMutation,
  useAdminQuery,
  useDeleteCourseMutation,
  useUpdataCourseMutation,
} from "../redux/api/courseApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSave } from "@fortawesome/free-regular-svg-icons";

const AdminSubjectEditor = () => {
  const [dept, setDept] = useState();
  const [semester, setSemester] = useState();
  const [section, setSection] = useState();
  const [editingSubjectId, setEditingSubjectId] = useState(null); // Currently editing subject ID
  const [editedSubject, setEditedSubject] = useState({}); // Stores changes locally
  const [newSubjects, setNewSubjects] = useState({});

  // redux fetchings.......
  const { data, isLoading, error } = useAdminQuery({dept,semester})

  const [
    updateCourse,
    { data: updateData, isLoading: UpdateLoading, error: updateError },
  ] = useUpdataCourseMutation();

  const [addCourse,{data : newCourse}] = useAddCourseMutation()

  const [deleteCourse,{isSuccess : deleteSuccess}] = useDeleteCourseMutation()

  useEffect(() => {
    console.log("refetchjed");
  }, [data]);

  const handleDelete = (id,sec) => {

    const data = {
      department : dept,
      semester,
      section : sec,
      id
    }

    deleteCourse(data)
    console.log("Deleting subject with ID:", id ,deleteSuccess);
  };

  const handleEditClick = (sub, sect) => {
    setEditingSubjectId(sub.id);
    setSection(sect);
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

  const handleSave = async (id, section) => {
    console.log("Saved data for subject ID:", id);
    console.log(editedSubject);
    // Call your backend or write to JSON here using the `id` and `editedSubject`
    const data = {
      department: dept,
      semester: Number(semester),
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

  const handleAddNew = (sectionName) => {
    setNewSubjects((prev) => ({
      ...prev,
      [sectionName]: {
        subjectCode: "",
        subjectTitle: "",
        faculty: "",
      },
    }));
  };

  const handleNewSubjectChange = (sectionName, e) => {
    const { name, value } = e.target;
    setNewSubjects((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [name]: value,
      },
    }));
  };

  const handleSaveNewSubject = async (sectionName) => {
    const newSubject = newSubjects[sectionName];

    const data = {
      department: dept,
      semester: Number(semester),
      section: sectionName,
      subjects : [ {
        subjectTitle: newSubject.subjectTitle,
        subjectCode: newSubject.subjectCode,
        faculty: newSubject.faculty,
        department : dept
      }]
      
    };
    console.log(data);

    try {
      const response = await addCourse(data).unwrap();
      console.log("New Subject Added:", response);
      // Clear the new subject form
      setNewSubjects((prev) => {
        const copy = { ...prev };
        delete copy[sectionName];
        return copy;
      });
    } catch (err) {
      console.error("Adding new subject failed:", err);
    }
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
          {[
            "Information Technology",
            "Computer Science Engineering",
            "Electrical and Communication Engineering",
            "Electrical Electronic Engineering",
            "Mechanical Engineering",
            "Chemical Engineering",
            "Civil Engineering",
          ].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
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
      {data?.result.length == 0 || data?.result[0]?.sections?.length == 1 ? (
        <div className="row">
          {["A", "B"].map((sec, index) => (
            <div key={index} className="col-6 mb-4">
              <h4 className="text-white">{sec}</h4>
              {newSubjects[sec] && (
                <div className="bg-light d-flex justify-content-between align-items-center p-3 mb-2 rounded shadow-sm">
                  <div className="d-flex flex-column gap-2 w-75">
                    <input
                      name="subjectCode"
                      value={newSubjects[sec].subjectCode}
                      onChange={(e) => handleNewSubjectChange(sec, e)}
                      className="form-control"
                      placeholder="Subject Code"
                    />
                    <input
                      name="subjectTitle"
                      value={newSubjects[sec].subjectTitle}
                      onChange={(e) => handleNewSubjectChange(sec, e)}
                      className="form-control"
                      placeholder="Subject Title"
                    />
                    <input
                      name="faculty"
                      value={newSubjects[sec].faculty}
                      onChange={(e) => handleNewSubjectChange(sec, e)}
                      className="form-control"
                      placeholder="Faculty"
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-success"
                      onClick={() => handleSaveNewSubject(sec)}
                    >
                      <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                  </div>
                </div>
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleAddNew(sec)}
              >
                + Add New
              </button>
            </div>
          ))}
        </div>
      ) : 
      (<div className="row">
        {data?.result[0]?.sections?.map((sect, i) => (
          <div key={i} className="col-6 mb-4">
            <h4 className="text-white">{sect.section}</h4>
            {sect?.subjects?.map((sub, index) => {
              const isEditing =
                editingSubjectId === sub.id && section == sect.section;

              return (
                <div
                  key={sub.id}
                  className="bg-light d-flex justify-content-between align-items-center p-3 mb-2 rounded shadow-sm"
                >
                  <div key={index} className="d-flex flex-column gap-2 w-75">
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
                        isEditing
                          ? editedSubject.subjectTitle
                          : sub.subjectTitle
                      }
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="form-control"
                    />
                    <input
                      name="faculty"
                      value={isEditing ? editedSubject.faculty : sub.faculty}
                      readOnly={!isEditing}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="d-flex flex-column align-items-center gap-2">
                    {isEditing ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleSave(sub.id, sect.section)}
                      >
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEditClick(sub, sect.section)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} /> Edit
                      </button>
                    )}
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(sub.id,sect.section)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            {newSubjects[sect.section] && (
              <div className="bg-light d-flex justify-content-between align-items-center p-3 mb-2 rounded shadow-sm">
                <div className="d-flex flex-column gap-2 w-75">
                  <input
                    name="subjectCode"
                    value={newSubjects[sect.section].subjectCode}
                    onChange={(e) => handleNewSubjectChange(sect.section, e)}
                    className="form-control"
                    placeholder="Subject Code"
                  />
                  <input
                    name="subjectTitle"
                    value={newSubjects[sect.section].subjectTitle}
                    onChange={(e) => handleNewSubjectChange(sect.section, e)}
                    className="form-control"
                    placeholder="Subject Title"
                  />
                  <input
                    name="faculty"
                    value={newSubjects[sect.section].faculty}
                    onChange={(e) => handleNewSubjectChange(sect.section, e)}
                    className="form-control"
                    placeholder="Faculty"
                  />
                </div>
                <div>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSaveNewSubject(sect.section)}
                  >
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                </div>
              </div>
            )}
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleAddNew(sect.section)}
            >
              + Add New
            </button>
          </div>
        ))}
      </div> ) }
    </div>
  );
};

export default AdminSubjectEditor;
