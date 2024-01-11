import React from "react";
import TextField from "./TextField";
import { FieldError } from "react-hook-form";

const Email = ({
  showSubmitButton,
  register,
  error,
}: {
  showSubmitButton: boolean;
  register: any;
  error: FieldError | undefined;
}) => {
  return (
    <TextField
      disabled={Boolean(!showSubmitButton)}
      label={"Email"}
      fieldName="email"
      placeholder="johndoe@email.com"
      register={register}
      fieldError={error}
      type="email"
    ></TextField>
  );
};

export default Email;