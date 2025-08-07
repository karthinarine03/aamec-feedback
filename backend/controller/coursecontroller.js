import { promises as fs } from 'fs'; // ✅ FIXED
import path from 'path';
import { fileURLToPath } from 'url';
import catchAsynError from "../middleware/catchAsynError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/data.json');

// Then in any async function:
const rawData = await fs.readFile(filePath, 'utf-8');
const data = JSON.parse(rawData);


export const coursecontroller = async(req, res) => {
  const { semester, section } = req.body; // <-- Add section from request
  console.log("Semester:", semester);
  console.log("Section:", section);
  console.log(data);

  const filtered =await  data
    .filter(entry => entry.semester == semester)
    .flatMap(entry =>
      entry.sections.filter(sec => sec.section == section)
    );

  res.json({
    filtered
  });
};

export const staffDept = catchAsynError(async (req, res, next) => {
  const { faculty } = req.body;
  const departments = [];

  for (const semester of data) {
    for (const section of semester.sections) {
      for (const subject of section.subjects) {
        if (subject.faculty.toLowerCase().includes(faculty.toLowerCase())) {
          departments.push(subject.department);
        }
      }
    }
  }

  if (departments.length === 0) {
    return res.status(404).json({
      message: "No departments found for the given faculty"
    });
  }

  return res.status(200).json({
    departments
  });
});

// add upon admin controll

export const admin = catchAsynError(async(req,res,next)=>{

  const {dept,semester} = req.query
  
  const result =await data.filter(item => item.department == dept && item.semester == semester)
  
  res.status(200).json({
    result
  })
})

//add single or more subjects or totally new semester and dept
export const addCourse = catchAsynError(async (req, res, next) => {
  const { department, semester, section, subjects } = req.body;

  if (!department || !semester || !section || !subjects) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Ensure subjects is always an array
  const subjectList = Array.isArray(subjects) ? subjects : [subjects];

  // Read existing JSON
  const rawData = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(rawData);

  let dept = parsed.find(item => item.department === department && item.semester == semester);

  if (!dept) {
    // 👷 If department + semester not found, create new
    const newSubjectsWithIds = subjectList.map((subj, i) => ({
      id: i + 1,
      ...subj,
    }));

    const newDept = {
      department,
      semester,
      sections: [
        {
          section,
          subjects: newSubjectsWithIds,
        },
      ],
    };

    parsed.push(newDept);

    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
    return res.status(201).json({ message: 'New department and subjects added.' });
  }

  // 🔍 Find section
  let sec = dept.sections.find(sec => sec.section === section);

  if (!sec) {
    // ✏️ Section doesn't exist, create new section
    const maxId = dept.sections
      .flatMap(s => s.subjects || [])
      .reduce((max, subj) => (subj.id && subj.id > max ? subj.id : max), 0);

    let idCounter = maxId + 1;
    const newSubjectsWithIds = subjectList.map(subj => ({
      id: idCounter++,
      ...subj,
    }));

    dept.sections.push({
      section,
      subjects: newSubjectsWithIds,
    });

    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
    return res.status(201).json({ message: 'New section and subjects added.' });
  }

  // ✨ Section exists → Append new subjects with auto-incremented ID
  const currentSubjects = sec.subjects || [];
  const maxId = currentSubjects.reduce((max, subj) => (subj.id && subj.id > max ? subj.id : max), 0);

  let idCounter = maxId + 1;
  const newSubjectsWithIds = subjectList.map(subj => ({
    id: idCounter++,
    ...subj,
  }));

  sec.subjects.push(...newSubjectsWithIds);

  await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
  return res.status(200).json({ message: `${subjectList.length} subject(s) added to existing section.` });
});

// delete the subject
export const deleteCourse = catchAsynError(async (req, res, next) => {
  const { department, section, semester, id } = req.body;

  if (!department || !section || !semester || !id) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const rawData = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(rawData);

  let updated = false;

  for (let dept of parsed) {
    if (dept.department === department && dept.semester == semester) {
      for (let sec of dept.sections) {
        if (sec.section === section) {
          const beforeDelete = sec.subjects.length;

          sec.subjects = sec.subjects.filter(item => item.id != id);

          const afterDelete = sec.subjects.length;

          if (beforeDelete !== afterDelete) {
            updated = true;
          }
        }
      }
    }
  }

  if (updated) {
    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
    return res.status(200).json({ message: "Subject deleted successfully." });
  } else {
    return res.status(404).json({ message: "No matching subject found for deletion." });
  }
});


export const updateSubjectById = catchAsynError(async (req, res, next) => {
  const { department, semester, section, id, subjectTitle, subjectCode, faculty } = req.body;

  if (!department || !semester || !section || !id || !subjectTitle || !subjectCode || !faculty) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const rawData = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(rawData);

  let updated = false;

  for (let dept of parsed) {
    if (dept.department == department && dept.semester == semester) {
      for (let sec of dept.sections) {
        if (sec.section == section) {
          const subject = sec.subjects.find(subj => subj.id == id);
          if (subject) {
            subject.subjectTitle = subjectTitle;
            subject.subjectCode = subjectCode;
            subject.faculty = faculty;
            updated = true;
            break;
          }
        }
      }
    }
  }

  if (updated) {
    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
    return res.status(200).json({ message: "Subject updated successfully." });
  } else {
    return res.status(404).json({ message: "Subject with the given ID not found." });
  }
});
