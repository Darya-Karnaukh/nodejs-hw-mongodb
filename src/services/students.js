import { studentModel } from '../db/models/student.js';

export const getAllStudents = async () => {
  const students = await studentModel.find();
  return students;
};

export const getStudentById = async (studentId) => {
  const student = await studentModel.findById(studentId);
  return student;
};
