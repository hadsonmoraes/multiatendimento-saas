import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateQueueService from "../services/QueueService/CreateQueueService";
import DeleteQueueService from "../services/QueueService/DeleteQueueService";
import ListQueuesService from "../services/QueueService/ListQueuesService";
import ShowQueueService from "../services/QueueService/ShowQueueService";
import UpdateQueueService from "../services/QueueService/UpdateQueueService";
import jwt_decode from "jwt-decode";
import ShowCompanyService from "../services/CompanyService/ShowCompanyService";
import AppError from "../errors/AppError";

export const index = async (req: Request, res: Response): Promise<Response> => {

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  const queues = await ListQueuesService(userJWT.companyId);

  return res.status(200).json(queues);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name, color, greetingMessage, startWork, endWork, absenceMessage } = req.body;

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  const queues = await ListQueuesService(userJWT.companyId);
  const company: any = await ShowCompanyService(userJWT.companyId)

  const s1: number = Number(queues.length);
  const s2: number = Number(company.dataValues.numberSetores);

  if (s1 >= s2) {
    throw new AppError("ERR_NO_LIMIT_QUEUE", 403);
  }

  const queue = await CreateQueueService({
    name, color, greetingMessage, companyId: userJWT.companyId, startWork, endWork, absenceMessage
  });

  const io = getIO();
  io.emit(`queue-${userJWT.companyId}`, {
    action: "update",
    queue
  });

  return res.status(200).json(queue);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { queueId } = req.params;

  const queue = await ShowQueueService(queueId);

  return res.status(200).json(queue);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId } = req.params;

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  const queue = await UpdateQueueService(queueId, req.body);

  const io = getIO();
  io.emit(`queue-${userJWT.companyId}`, {
    action: "update",
    queue
  });

  return res.status(201).json(queue);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueId } = req.params;

  const userJWT: any = req.headers.authorization && await jwt_decode(req.headers.authorization.replace('Bearer ', ''))

  await DeleteQueueService(queueId);

  const io = getIO();
  io.emit(`queue-${userJWT.companyId}`, {
    action: "delete",
    queueId: +queueId
  });

  return res.status(200).send();
};
