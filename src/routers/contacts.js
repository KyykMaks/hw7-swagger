import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactController,
  patchContactController,
  upsertContactController,
} from '../controllers/controller.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middleware/isValidId.js';
import { authenticate }from '../middleware/authenticate.js'
import { upload } from '../middleware/multer.js';

const router = Router();

router.use(authenticate)

router.get('/', ctrlWrapper(getContactController));

router.get('/:contactId',
  isValidId ,
   ctrlWrapper(getContactByIdController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.delete('/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController));
router.put(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
