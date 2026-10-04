import { Router } from 'express';
import type { UserService } from '../services/user.service';

/** Express 5 forwards async failures to the common error handler. */
export function createUserRouter(service: UserService): Router {
  const router = Router();
  router.get('/', async (req, res) => {
    res.json(await service.getAll(req.query));
  });
  router.get('/:id', async (req, res) => {
    res.json(await service.getById(req.params.id));
  });
  router.post('/', async (req, res) => {
    res.status(201).json(await service.create(req.body));
  });
  router.put('/:id', async (req, res) => {
    res.json(await service.update(req.params.id, req.body));
  });
  router.delete('/:id', async (req, res) => {
    await service.delete(req.params.id);
    res.status(204).send();
  });
  return router;
}
