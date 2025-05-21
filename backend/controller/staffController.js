import catchAsynError from "../middleware/catchAsynError.js";
import Subjects from "../model/subjects.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getSubjectReview = catchAsynError(async (req, res, next) => {
  const { section, subject } = req.body;

  const data = await Subjects.aggregate([
    ...(subject ? [{ $match: { subject: { $in: subject } } }] : []),
    { $unwind: "$ratings" },
    {
      $lookup: {
        from: "students",
        localField: "ratings.student",
        foreignField: "_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
    ...(section ? [{ $match: { "student.section": section } }] : []),

    {
      $group: {
        _id: { subjectId: "$_id", faculty: "$ratings.faculty" },
        subject: { $first: "$subject" },
        semester: { $first: "$semester" },
        faculty: { $first: "$ratings.faculty" },
        ratings: {
          $push: {
            rating: "$ratings.rating",
            comment: "$ratings.comment",
            faculty: "$ratings.faculty",
            dept : "$ratings.dept",
            semester: "$semester",       // Add semester here
            student: {
              _id: "$student._id",
              section: "$student.section"
            }
          }
        },
        avgRating: { $avg: "$ratings.rating" }
      }
    },
    {
      $group: {
        _id: "$_id.subjectId",
        subject: { $first: "$subject" },
        semester: { $first: "$semester" },
        facultyRatings: {
          $push: {
            faculty: "$faculty",
            avgRating: { $round: ["$avgRating", 1] },
            ratings: "$ratings"
          }
        }
      }
    }
  ]);

  if (!data.length) {
    return next(new ErrorHandler("Not found subject or section", 400));
  }

  res.status(200).json({ data });
});

export const allSubjectReview = catchAsynError(async (req, res, next) => {
  const data = await Subjects.aggregate([
    { $unwind: "$ratings" },
    {
      $lookup: {
        from: "students",
        localField: "ratings.student",
        foreignField: "_id",
        as: "student"
      }
    },
    { $unwind: "$student" },
    {
      $group: {
        _id: "$_id",
        subject: { $first: "$subject" },
        semester: { $first: "$semester" },
        department : {$first : "$department"},       // Also add semester here
        ratings: {
          $push: {
            rating: "$ratings.rating",
            comment: "$ratings.comment",
            faculty: "$ratings.faculty",
            dept : "$ratings.dept",
            semester: "$semester",              // Add semester here too
            student: {
              _id: "$student._id",
              section: "$student.section"
            }
          }
        }
      }
    },
    {
      $addFields: {
        avgRating: {
          $round: [{ $avg: "$ratings.rating" }, 1]
        }
      }
    }
  ]);

  if (data.length === 0) {
    return next(new ErrorHandler("No subject reviews found", 404));
  }

  res.status(200).json({ success: true, data });
});
