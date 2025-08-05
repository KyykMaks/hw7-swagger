import { SORT_ORDER } from '../constants/index.js';
import { Contact} from '../models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({_id:contactId, userId});
};

export const createContact = async (payload,userId) => {
  return await Contact.create({...payload,userId});
};

export const deleteContact = async (contactId,userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};

export const updateContact = async (contactId, payload,userId, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId,userId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject.upserted),
  };
};

export const getAllContact = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean'){
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if(filter.userId) {
    contactsQuery.where('userId').equals(filter.userId)
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};
