import createHttpError from 'http-errors';
import { SORT_ORDER } from '../constants/index.js';
import { contactModel } from '../db/models/contact.js';
import { User } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactModel.find({ userId });

  const contactsCount = await contactModel
    .find({ userId })
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await contactModel.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const user = await User.findById(payload.userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const contact = await contactModel.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const rawResult = await contactModel.findOneAndUpdate(
    {
      _id: contactId,
      userId: userId,
    },
    payload,
    { new: true, includeResultMetadata: true },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContactById = async (contactId, userId) => {
  const contact = await contactModel.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return contact;
};
