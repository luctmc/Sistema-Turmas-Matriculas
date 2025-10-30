import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createStudent, deleteStudent, listStudents, updateStudent } from '../controllers/studentController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Gestão de estudantes
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Lista estudantes cadastrados
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudantes
 */
router.get('/', listStudents);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, document]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               document:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Estudante criado
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('document').notEmpty().withMessage('Documento é obrigatório'),
    body('birthDate').optional().isISO8601().withMessage('Data inválida')
  ],
  createStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Atualiza um estudante
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Estudante atualizado
 *       404:
 *         description: Estudante não encontrado
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Identificador inválido'),
    body('email').optional().isEmail(),
    body('birthDate').optional().isISO8601()
  ],
  updateStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Remove um estudante
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Estudante removido
 *       404:
 *         description: Estudante não encontrado
 */
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Identificador inválido')],
  deleteStudent
);

export default router;
