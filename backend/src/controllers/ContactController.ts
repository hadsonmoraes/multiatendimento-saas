import * as Yup from "yup";
import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import ListContactsService from "../services/ContactServices/ListContactsService";
import CreateContactService from "../services/ContactServices/CreateContactService";
import ShowContactService from "../services/ContactServices/ShowContactService";
import UpdateContactService from "../services/ContactServices/UpdateContactService";
import DeleteContactService from "../services/ContactServices/DeleteContactService";

import CheckContactNumber from "../services/WbotServices/CheckNumber"
import CheckIsValidContact from "../services/WbotServices/CheckIsValidContact";
import GetProfilePicUrl from "../services/WbotServices/GetProfilePicUrl";
import AppError from "../errors/AppError";
import GetContactService from "../services/ContactServices/GetContactService";
import jwt_decode from "jwt-decode";
import { logger } from "../utils/logger";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

type IndexGetContactQuery = {
  name: string;
  number: string;
};

interface ExtraInfo {
  name: string;
  value: string;
}
interface ContactData {
  name: string;
  number: string;
  email?: string;
  extraInfo?: ExtraInfo[];
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''));

  const { contacts, count, hasMore } = await ListContactsService({
    searchParam,
    pageNumber,
    companyId: userJWT.companyId
  });

  return res.json({ contacts, count, hasMore });
};

export const getContact = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, number } = req.body as IndexGetContactQuery;

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  const contact = await GetContactService({
    name,
    number,
    companyId: userJWT.companyId
  });

  return res.status(200).json(contact);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const newContact: ContactData = req.body;
  newContact.number = newContact.number.replace("-", "").replace(" ", "");

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    number: Yup.string()
      .required()
      .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
  });


  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  try {
    await schema.validate(newContact);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  await CheckIsValidContact(newContact.number, userJWT.companyId);
  const validNumber: any = await CheckContactNumber(newContact.number, userJWT.companyId)

  let profilePicUrl = await GetProfilePicUrl(validNumber, userJWT.companyId);
  if (!profilePicUrl)
    profilePicUrl = "/default-profile.png"; // Foto de perfil padrão   

  let name = newContact.name;
  let number = validNumber;
  let email = newContact.email;
  let extraInfo = newContact.extraInfo;

  const contact = await CreateContactService({
    name,
    number,
    email,
    extraInfo,
    profilePicUrl,
    companyId: userJWT.companyId
  });

  const io = getIO();
  io.emit(`contact-${userJWT.companyId}`, {
    action: "create",
    contact
  });

  return res.status(200).json(contact);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { contactId } = req.params;

  const contact = await ShowContactService(contactId);

  return res.status(200).json(contact);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactData: ContactData = req.body;

  const schema = Yup.object().shape({
    name: Yup.string(),
    number: Yup.string().matches(
      /^\d+$/,
      "Invalid number format. Only numbers is allowed."
    )
  });

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''));
  logger.warn('Updating contact ' + contactData.number + ' in business: ' + userJWT.companyId);

  contactData.companyId = userJWT.companyId;

  try {
    await schema.validate(contactData);
  } catch (err: any) {
    throw new AppError(err.message);
  }

  await CheckIsValidContact(contactData.number, userJWT.companyId);

  const { contactId } = req.params;

  const contact = await UpdateContactService({ contactData, contactId });

  const io = getIO();
  io.emit(`contact-${userJWT.companyId}`, {
    action: "update",
    contact
  });

  return res.status(200).json(contact);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { contactId } = req.params;

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  await DeleteContactService(contactId, userJWT.companyId);

  const io = getIO();
  io.emit(`contact-${userJWT.companyId}`, {
    action: "delete",
    contactId
  });

  return res.status(200).json({ message: "Contact deleted" });
};
