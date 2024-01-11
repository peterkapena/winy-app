"use client";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, Typography } from "@mui/joy";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormSchema, FormSchemaType } from "./form-schema";
import { IS_DEVELOPER } from "@/common";
import TextField from "@/components/TextField";
import Password from "@/components/Password";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SubmitLoadingButton } from "../../../components/SubmitLoadingButton";
import { Notice } from "../../../components/Notice";
import { initializeUser } from "../signup/_actions";
import { PETER_KAPENA_EMAIL, PETER_KAPENA_PASSWORD } from "@/utils/constants";

export default function Page() {
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email_or_username: IS_DEVELOPER ? PETER_KAPENA_EMAIL : "",
      password: IS_DEVELOPER ? PETER_KAPENA_PASSWORD : "",
    },
  });
  async function fetch() {
    await initializeUser();
  }
  useEffect(() => {
    fetch();
  }, []);

  const processForm: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email_or_username: data.email_or_username,
        password: data.password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        setMessages(["Incorrect username or password"]);
      } else {
        window.location.href = "/";
      }

      setShowSubmitButton(false);
      setIsSuccess(Boolean(!result?.error));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet
      sx={{
        mt: 2,
        width: 500,
        mx: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "sm",
        boxShadow: "md",
      }}
      variant="outlined"
    >
      <form onSubmit={handleSubmit(processForm)}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
          <div>
            <Typography level="h2" component="h1" sx={{ mb: 2 }}>
              <b>Sign in!</b>
            </Typography>
            <Typography level="body-md">Sign in to continue.</Typography>
          </div>
          <div>
            <ColorSchemeToggle />
          </div>
        </Box>
        <TextField
          disabled={Boolean(!showSubmitButton)}
          label={"Email or username"}
          fieldName="email_or_username"
          placeholder="johndoe@example.com"
          register={register}
          fieldError={errors.email_or_username}
          type="text"
        ></TextField>
        <Password
          showSubmitButton={showSubmitButton}
          error={errors.password}
          register={register}
        ></Password>

        <Box
          sx={{
            my: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="plain"
            size="sm"
            onClick={() => push("/auth/signup")}
          >
            Do not have an account? Click here to create one.
          </Button>
        </Box>
        {showSubmitButton && (
          <SubmitLoadingButton
            isLoading={isLoading}
            title="Sign in"
          ></SubmitLoadingButton>
        )}

        {!showSubmitButton && messages.length > 0 && (
          <Notice
            isSuccess={isSuccess}
            onClose={() => {
              setShowSubmitButton(true);
              setMessages([]);
            }}
            messages={messages}
          />
        )}
      </form>
    </Sheet>
  );
}
