import React, { useEffect, useState } from 'react'
import { useRegisterStudentMutation } from '../redux/api/studentApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'


const RegisterStudent = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [register, setRegister] = useState('');
  const [year, setYear] = useState('--');
  const [department, setDept] = useState('--');
  const [section, setSection] = useState('--');
  const [semester, setSemester] = useState('--');

    const [registerStudent,{data,error,isLoading,isSuccess}] = useRegisterStudentMutation()

    useEffect(()=>{
      if(isSuccess && data?.data[0]?._id){
        navigate(`/subjectList/${data?.data[0]?._id}?sem=${semester}&sec=${section}&atDept=${department}`)
      }
    },[isSuccess,data?.data[0]?._id])

    //check is empty



  function handleSubmit(e){
    e.preventDefault()

    if(name === '' ||register.length!=12 || year==='--' || department==='--' || section==='--' || semester==='--'){
      return toast.error("Fill all fields")
    }

    const value =  {
      reg: register,
      name,
      section,
      sem: semester,
      dept: department,
      subjects: [ ]
    }


    registerStudent(value)

  }
  // function handle(e){
  //   e.preventDefault()
  //   const value = {
  //     reg: "23CS004",
  //     name: "thiru Johnson",
  //     section: "B",
  //     sem: 4,
  //     dept: "Computer Science",
  //     subjects: [ ]
  // }
  // registerStudent(value)
  

  // }

  console.log(data);



  return (
<div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-lg p-4">
            <h3 className="text-center mb-4">Student Registration</h3>
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="reg_no" className="form-label">Register Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="reg_no"
                  placeholder="Enter 12-digit register number"
                  value={register}
                  onChange={(e) => setRegister(e.target.value)}
                  maxLength={12}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="dept" className="form-label">Department</label>
                <select className="form-select" id="dept" value={department} onChange={(e) => setDept(e.target.value)}>
                  <option hidden>--</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="CHEMICAL">CHEMICAL</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="year" className="form-label">Year</label>
                <select className="form-select" id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option hidden>--</option>
                  <option value="1">I</option>
                  <option value="2">II</option>
                  <option value="3">III</option>
                  <option value="4">IV</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="sec" className="form-label">Section</label>
                <select className="form-select" id="sec" value={section} onChange={(e) => setSection(e.target.value)}>
                  <option hidden>--</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="sem" className="form-label">Semester</label>
                <select className="form-select" id="sem" value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option hidden>--</option>
                  <option value="1">I</option>
                  <option value="2">II</option>
                  <option value="3">III</option>
                  <option value="4">IV</option>
                  <option value="5">V</option>
                  <option value="6">VI</option>
                  <option value="7">VII</option>
                  <option value="8">VIII</option>
                </select>
              </div>

              <div className="d-grid mt-4">
                <button className="btn btn-primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error?.data?.message || 'Something went wrong!'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterStudent