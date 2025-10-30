import { validationResult } from 'express-validator';
import { getModels } from '../database/index.js';

export const listStudents = async (_req, res) => {
  try {
    const { Student, Enrollment, Class, Course } = getModels();
    const students = await Student.findAll({
      include: [{
        model: Enrollment,
        as: 'enrollments',
        include: [{
          model: Class,
          as: 'class',
          include: [{ model: Course, as: 'course' }]
        }]
      }]
    });
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar estudantes', details: error.message });
  }
};

export const createStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { Student } = getModels();
    const student = await Student.create(req.body);
    return res.status(201).json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar estudante', details: error.message });
  }
};

export const updateStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const { Student } = getModels();
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    await student.update(req.body);
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar estudante', details: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const { Student } = getModels();
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    await student.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover estudante', details: error.message });
  }
};
