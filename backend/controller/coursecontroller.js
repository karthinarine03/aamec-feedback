import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import catchAsynError from "../middleware/catchAsynError.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to data.json
const rawData = fs.readFileSync(path.join(__dirname, '../data/data.json'));
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
