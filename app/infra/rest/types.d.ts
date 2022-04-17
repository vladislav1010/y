// solidbook Developer experience is important for all companies
// If the API responses isn't consistent and its shape isn't enforced, there is a surface of confusion and mistakes, more code for frontend developers. It'll be bad DX

interface GeneralError<TError> {
  generalError: TError;
}

export type FieldsError<TFields, TError> = {
  fields: {
    [K in keyof TFields]?: TFields[K] extends any[]
      ? TFields[K][number] extends object
        ? { fields: FieldsError<TFields[K][number]>[] } & GeneralError<TError>
        : { fields: TError[] } & GeneralError<TError>
      : TFields[K] extends object
      ? { fields: FieldsError<TFields[K]> } & GeneralError<TError>
      : TError;
  };
} & GeneralError<TError>;

export type ActionDataError<TFields> = {
  status: "error";
  httpStatus: Response["status"];
  errors: FieldsError<
    TFields,
    {
      type:
        | "BUSINESS_RULE"
        | "MISSING_MANDATORY_PARAMETER"
        | "BAD_FORMAT_OR_TYPE";
      message: string;
    }
  >;
};

export type ActionDataSuccess = { status: "success" };
