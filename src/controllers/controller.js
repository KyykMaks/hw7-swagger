import {
  createContact,
  deleteContact,
  getAllContact,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToClodinary.js';


export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found Contact with id ${contactId}!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  console.log(req , userId);

  let photo;
  if (req.file) {
    photo = await saveFileToCloudinary(req.file);
  }
  const contacts = await createContact({
    ...req.body,
    photo: photo,
  },userId);
  res.status(201).json({
    status: 201,
    message: 'Successfully create contacts!',
    data: contacts,
  });
};

export const upsertContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  let photo;
  if (req.file) {
    photo = await saveFileToCloudinary(req.life);
  }
  const result = await updateContact(
    contactId,
    { ...req.body, ...(photo && { photo }) },
    userId,
    { upsert: true },
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const status = result.isNew ? 201 : 202;
  res.status(status).json({
    status,
    message: 'Successful upserd',
    data: result.contact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  let photo;
  if (req.file) {
    photo = await saveFileToCloudinary(req.file);
  }

  const result = await updateContact(
    contactId,
    { ...req.body, ...(photo && { photo }) },
    userId,
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({ status: 200, message: 'Successful upserd', data: result.contact });
};

export const getContactController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContact({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
