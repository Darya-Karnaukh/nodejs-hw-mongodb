import { contactModel } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactModel.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await contactModel.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactModel.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const rawResult = await contactModel.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContactById = async (contactId) => {
  const contact = await contactModel.findByIdAndDelete({
    _id: contactId,
  });
  return contact;
};
