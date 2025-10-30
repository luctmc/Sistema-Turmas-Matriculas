import { validationResult } from 'express-validator';
import { getModels } from '../database/index.js';

export const listEnrollments = async (_req, res) => {
  try {
    const { Enrollment, Student, Class, Course } = getModels();
    const enrollments = await Enrollment.findAll({
      include: [
        { model: Student, as: 'student' },
        {
          model: Class,
          as: 'class',
          include: [{ model: Course, as: 'course' }]
        }
      ]
    });
    return res.json(enrollments);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar matrículas', details: error.message });
  }
};

export const createEnrollment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { Enrollment, Class } = getModels();
    const { classId } = req.body;

    const classroom = await Class.findByPk(classId, { include: ['enrollments'] });

    if (!classroom) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    if (classroom.enrollments.length >= classroom.capacity) {
      return res.status(400).json({ message: 'Capacidade da turma atingida' });
    }

    const enrollment = await Enrollment.create(req.body);
    return res.status(201).json(enrollment);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar matrícula', details: error.message });
  }
};

export const updateEnrollment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const { Enrollment } = getModels();
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Matrícula não encontrada' });
    }

    await enrollment.update(req.body);
    return res.json(enrollment);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar matrícula', details: error.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  const { id } = req.params;

  try {
    const { Enrollment } = getModels();
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Matrícula não encontrada' });
    }

    await enrollment.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover matrícula', details: error.message });
  }
};
