import { Response } from "express";

function serverErrorResponse(err: unknown): string {
  let errMsg: string;
  if (err instanceof Error) {
    errMsg = err.message;
    return errMsg;
  } else {
    errMsg = String(err);
    return errMsg;
  }
}

/**
 * @param res : Response
 * @param statusCode : Response status code
 * @param status : Response status
 * @param message : Response message
 * @param data **Optional** : Data to send
 * @returns : Response object
 */
function responseHandler(
  res: Response,
  statusCode: number,
  status: string,
  message?: string,
  data?: any
) {
  if (data) {
    return res.status(statusCode).json({
      status: status,
      message: message,
      data: data,
    });
  }
  if (!message) {
    return res.status(statusCode).json({
      status: status,
      data: data,
    });
  }
  return res.status(statusCode).json({
    status: status,
    message: message,
  });
}

export { serverErrorResponse, responseHandler };
