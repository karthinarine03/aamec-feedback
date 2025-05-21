import catchAsynError from "../middleware/catchAsynError.js"
import Student from "../model/student.js"
import Subjects from "../model/subjects.js"
import ErrorHandler from "../utils/ErrorHandler.js"

export const addRating = catchAsynError(async(req,res,next)=>{
    const detail = req.body

    const data = await Student.find({reg : req.body.reg})
    if(data.length == 0){
        const data = await Student.create(req.body)

        return res.status(200).json({
            data
        })
    }

    if(!data){
        return next(new ErrorHandler("cannot create",400))
    }
    res.status(200).json({
        data
    })
})

// export const updatesubjects = catchAsynError(async (req, res, next) => {
//   const { subjects } = req.body;

//   if (!Array.isArray(subjects) || subjects.length === 0) {
//     return next(new ErrorHandler("Subjects must be a non-empty array", 400));
//   }

//   const student = await Student.findById(req.params.id);
//   if (!student) {
//     return next(new ErrorHandler("Student not found", 404));
//   }

//   const subToAdd = subjects[0]; // You might want to support multiple in the future
//   const { subject, rating, comment, faculty, semester, dept } = subToAdd;

//   console.log(dept);
  
//   if (!subject || !semester) {
//     return next(new ErrorHandler("Subject and semester are required", 400));
//   }

//   const alreadyRated = student.subjects.some(s => s.subject === subject);
//   if (alreadyRated) {
//     return next(new ErrorHandler("Subject already rated", 400));
//   }

//   // Add subject to student
//   student.subjects.push(subToAdd);
//   await student.save();

//   // Create a new rating object
//   const newRating = {
//     student: student._id,
//     rating,
//     comment,
//     faculty,
//     dept,
//     semester,
//   };

//   // Update or create subject in collection
//   const subjectDoc = await Subjects.findOneAndUpdate(
//     { subject, semester },
//     { $push: { ratings: newRating } },
  
//   );

//   res.status(200).json({
//     student,
//     subjectCollection: subjectDoc,
//   });
// });


export const updatesubjects = catchAsynError(async (req, res, next) => {
  const { atDept,subjects } = req.body;

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return next(new ErrorHandler("Subjects must be a non-empty array", 400));
  }

  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new ErrorHandler("Student not found", 404));
  }

  const subToAdd = subjects[0];
  const { subject, rating, comment, faculty, semester, dept } = subToAdd;

  if (!subject || !semester) {
    return next(new ErrorHandler("Subject and semester are required", 400));
  }

  const alreadyRatedByStudent = student.subjects.some(s => s.subject === subject);
  if (alreadyRatedByStudent) {
    return next(new ErrorHandler("Subject already rated by student", 400));
  }

  // Add subject to student's own record
  student.subjects.push(subToAdd);
  await student.save();

  // Prepare rating object
  const newRating = {
    student: student._id,
    rating,
    comment,
    faculty,
    dept,
    semester,
  };

  // Check if subject exists
  let subjectDoc = await Subjects.findOne({ subject, semester });

  if (subjectDoc) {
    // Check if this student already exists in the ratings array
    const alreadyRatedInSubject = subjectDoc.ratings.some(r => r.student.equals(student._id));
    if (alreadyRatedInSubject) {
      return next(new ErrorHandler("Student already rated this subject in Subject collection", 400));
    }

    // Push new rating
    subjectDoc.ratings.push(newRating);
    await subjectDoc.save();
  } else {
    // Create new subject with initial rating
    subjectDoc = await Subjects.create({
      subject,
      semester,
      department : atDept,
      ratings: [newRating],
    });
  }

  res.status(200).json({
    student,
    subjectCollection: subjectDoc,
  });
});

// export const updatesubjects = catchAsynError(async (req, res, next) => {

//     const {subjects} = req.body

//     if(!Array.isArray(req.body.subjects)){
//         return next(new ErrorHandler("SUBJECT IS ONLY IN ARRAY",404))
//     }

//     const checkData = await Student.find({_id : req.params.id})
    
//     const isExist = checkData[0]?.subjects?.some(s=> s.subject == subjects[0].subject)
//     if(isExist){
//         return next(new ErrorHandler("already subject rated",400))
//     }

//     const data=await Student.findByIdAndUpdate(
//         {_id:req.params.id},
//         {$push:{subjects:{$each:req.body.subjects}}},
//         {new:true,runValidators:true})
    
//     if(!data){
//         return next (new(ErrorHandler("CANNOT UPDATE",404)))
//     }
    
//     // add to Subjects collection
//     const {subject,rating,comment,faculty,semester} = subjects[0]
//     const sub = await Subjects.findOne({subject : subject})

//     if(sub){
//         sub.ratings.push({
//             student : data._id,
//             rating,
//             semester,
//             comment,faculty,
            
//         })

//         await sub.save()

//         return res.status(200).json({
//             sub
//         })

//     }

//     const subcoll = await Subjects.create({
//         subject,
//         ratings : [{
//             student : data._id,
//             rating,
//             semester,
//             comment,faculty
//         }]
//     })

//     res.json({
//         data,
//         subcoll,
//         sub
//     })
// });

export const getStudent=catchAsynError(async(req,res,next)=>{
    const data=await Student.findById({_id:req.params.id});
    if(!data){
        return next(new ErrorHandler("no student",400))
    }
    res.json({
        data
    })
})
