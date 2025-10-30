import { validationResult } from 'express-validator';
import { getModels } from '../database/index.js';

export const listClasses = async (_req, res) => {
  try {
    const { Class, Course, Enrollment, Student } = getModels();
    const classes = await Class.findAll({
      include: [
        { model: Course, as: 'course' },
        {
          model: Enrollment,
          as: 'enrollments',
          include: [{ model: Student, as: 'student' }]
        }
      ]
    });
    return res.json(classes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar turmas', details: error.message });
  }
};

export const createClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { Class } = getModels();
    const classroom = await Class.create(req.body);
    return res.status(201).json(classroom);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar turma', details: error.message });
  }
};

export const updateClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const { Class } = getModels();
    const classroom = await Class.findByPk(id);

    if (!classroom) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    await classroom.update(req.body);
    return res.json(classroom);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar turma', details: error.message });
  }
};

export const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const { Class } = getModels();
    const classroom = await Class.findByPk(id);

    if (!classroom) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    await classroom.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover turma', details: error.message });
  }
};
