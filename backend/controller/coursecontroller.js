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

  const {dept,semester} = req.body;
  
  const result =await data.filter(item => item.department == dept && item.semester == semester)
  
  res.status(200).json({
    result
  })
})

export const addCourse = catchAsynError(async (req, res, next) => {
  const { department, semester, section, newSubjects } = req.body;

  if (!department || !semester || !section || !newSubjects || !Array.isArray(newSubjects)) {
    return res.status(400).json({ message: "Missing or invalid fields in request body." });
  }

  const rawData = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(rawData);

  let updated = false;

  for (let dept of parsed) {
    if (dept.department === department && dept.semester == semester) {
      for (let sec of dept.sections) {
        if (sec.section === section) {
          const currentSubjects = sec.subjects || [];

          // Get the current max id
          const maxId = currentSubjects.reduce((max, subj) => subj.id && subj.id > max ? subj.id : max, 0);

          // Assign auto-incremented IDs
          let idCounter = maxId + 1;
          const newSubjectsWithIds = newSubjects.map(subj => ({
            id: idCounter++,
            ...subj
          }));

          // Add new subjects
          sec.subjects.push(...newSubjectsWithIds);
          updated = true;
          break;
        }
      }
    }
  }

  if (updated) {
    await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
    return res.status(200).json({ message: "Subjects added successfully." });
  } else {
    return res.status(404).json({ message: "Matching department/semester/section not found." });
  }
});