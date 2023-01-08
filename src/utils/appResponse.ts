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

export { serverErrorResponse };
