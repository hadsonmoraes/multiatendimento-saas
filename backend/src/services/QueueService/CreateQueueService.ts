import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

interface QueueData {
  name: string;
  color: string;
  greetingMessage?: string;
  companyId: number;
}

const CreateQueueService = async (queueData: QueueData): Promise<Queue> => {
  const { color, name } = queueData;
  console.log(`rrrrr ${queueData.companyId}`);
  const queueWithSameName = await Queue.findOne({
    where: { name, color, companyId: queueData.companyId }
  }); // findOne retorna um objeto ou null

  if (queueWithSameName?.id !== undefined) {
    throw new AppError("ERR_QUEUE_NAME_ALREADY_EXISTS", 400);
  }

  try {
    var queue = await Queue.create(queueData);
  } catch (err: any) {
    //console.log(err);
    throw new AppError(err.message);
  }


  return queue;
};

export default CreateQueueService;
