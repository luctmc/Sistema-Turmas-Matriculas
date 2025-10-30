import { Sequelize } from 'sequelize';
import { databaseConfig } from '../config/database.js';
import { initUserModel } from '../models/User.js';
import { initCourseModel } from '../models/Course.js';
import { initStudentModel } from '../models/Student.js';
import { initClassModel } from '../models/Class.js';
import { initEnrollmentModel } from '../models/Enrollment.js';

export const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig);

const models = {};

export const initializeDatabase = async () => {
  initUserModel(sequelize);
  initCourseModel(sequelize);
  initStudentModel(sequelize);
  initClassModel(sequelize);
  initEnrollmentModel(sequelize);

  const { User } = sequelize.models;
  const { Course } = sequelize.models;
  const { Student } = sequelize.models;
  const { Class } = sequelize.models;
  const { Enrollment } = sequelize.models;

  Course.hasMany(Class, { foreignKey: 'courseId', as: 'classes' });
  Class.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

  Class.hasMany(Enrollment, { foreignKey: 'classId', as: 'enrollments' });
  Enrollment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

  Student.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
  Enrollment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

  models.User = User;
  models.Course = Course;
  models.Student = Student;
  models.Class = Class;
  models.Enrollment = Enrollment;

  await sequelize.authenticate();
  await sequelize.sync({ alter: false });

  return models;
};

export const getModels = () => ({ ...models });
