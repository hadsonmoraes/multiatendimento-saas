import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";

interface ExtraInfo {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  email?: string;
  profilePicUrl?: string;
  extraInfo?: ExtraInfo[];
  companyId: number
}

const CreateContactService = async ({
  name,
  number,
  email = "",
  companyId,
  extraInfo = []
}: Request): Promise<Contact> => {

  const numberExists = await Contact.findOne({
    where: { number, companyId: companyId }
  });

  if (numberExists) {
    throw new AppError("ERR_DUPLICATED_CONTACT");
  }

  const contact = await Contact.create(
    {
      name,
      number,
      email,
      companyId,
      extraInfo
    },
    {
      include: ["extraInfo"]
    }
  );

  return contact;
};

export default CreateContactService;
