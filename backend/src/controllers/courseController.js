import { validationResult } from 'express-validator';
import { getModels } from '../database/index.js';

export const listCourses = async (_req, res) => {
  try {
    const { Course } = getModels();
    const courses = await Course.findAll({ include: ['classes'] });
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar cursos', details: error.message });
  }
};

export const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { Course } = getModels();
    const course = await Course.create(req.body);
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar curso', details: error.message });
  }
};

export const updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const { Course } = getModels();
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    await course.update(req.body);
    return res.json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar curso', details: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const { Course } = getModels();
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    await course.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover curso', details: error.message });
  }
};
