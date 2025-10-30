import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createEnrollment, deleteEnrollment, listEnrollments, updateEnrollment } from '../controllers/enrollmentController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Gestão de matrículas
 */

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Lista matrículas
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de matrículas
 */
router.get('/', listEnrollments);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Cria uma matrícula
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, classId]
 *             properties:
 *               studentId:
 *                 type: integer
 *               classId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, cancelled, completed]
 *     responses:
 *       201:
 *         description: Matrícula criada
 */
router.post(
  '/',
  [
    body('studentId').isInt({ min: 1 }),
    body('classId').isInt({ min: 1 }),
    body('status').optional().isIn(['active', 'cancelled', 'completed'])
  ],
  createEnrollment
);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Atualiza uma matrícula
 *     tags: [Enrollments]
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, cancelled, completed]
 *     responses:
 *       200:
 *         description: Matrícula atualizada
 *       404:
 *         description: Matrícula não encontrada
 */
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('status').optional().isIn(['active', 'cancelled', 'completed'])
  ],
  updateEnrollment
);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Remove uma matrícula
 *     tags: [Enrollments]
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
 *         description: Matrícula removida
 *       404:
 *         description: Matrícula não encontrada
 */
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 })],
  deleteEnrollment
);

export default router;
