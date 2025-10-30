import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createClass, deleteClass, listClasses, updateClass } from '../controllers/classController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Gestão de turmas
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Lista turmas cadastradas
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas
 */
router.get('/', listClasses);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Cria uma nova turma
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, courseId, startDate, endDate, capacity]
 *             properties:
 *               name:
 *                 type: string
 *               courseId:
 *                 type: integer
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Turma criada
 */
router.post(
  '/',
  [
    body('name').notEmpty(),
    body('courseId').isInt({ min: 1 }),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    body('capacity').isInt({ min: 1 })
  ],
  createClass
);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Atualiza uma turma
 *     tags: [Classes]
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
 *         description: Turma atualizada
 *       404:
 *         description: Turma não encontrada
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601(),
    body('capacity').optional().isInt({ min: 1 })
  ],
  updateClass
);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Remove uma turma
 *     tags: [Classes]
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
 *         description: Turma removida
 *       404:
 *         description: Turma não encontrada
 */
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 })],
  deleteClass
);

export default router;
