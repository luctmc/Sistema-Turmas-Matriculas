import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createCourse, deleteCourse, listCourses, updateCourse } from '../controllers/courseController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Gestão de cursos
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Lista cursos cadastrados
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos
 */
router.get('/', listCourses);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, workload]
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               workload:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Curso criado
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('code').notEmpty().withMessage('Código é obrigatório'),
    body('workload').isInt({ min: 1 }).withMessage('Carga horária inválida'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status inválido')
  ],
  createCourse
);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Courses]
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
 *               name:
 *                 type: string
 *               workload:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Curso atualizado
 *       404:
 *         description: Curso não encontrado
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Identificador inválido'),
    body('name').optional().notEmpty(),
    body('workload').optional().isInt({ min: 1 }),
    body('status').optional().isIn(['active', 'inactive'])
  ],
  updateCourse
);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Courses]
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
 *         description: Curso removido
 *       404:
 *         description: Curso não encontrado
 */
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Identificador inválido')],
  deleteCourse
);

export default router;
