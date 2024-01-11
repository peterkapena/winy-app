"use client";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, Typography } from "@mui/joy";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { FormSchema, FormSchemaType } from "./form-schema";
import { IS_DEVELOPER } from "@/common";
import { signUp } from "./_actions";
import UserName from "@/components/UserName";
import Email from "@/components/Email";
import Password from "@/components/Password";
import ConfirmPassword from "@/components/ConfirmPassword";
import { useRouter } from "next/navigation";
import { SubmitLoadingButton } from "@/components/SubmitLoadingButton";
import { Notice } from "../../../components/Notice";
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
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: IS_DEVELOPER ? PETER_KAPENA_EMAIL : "",
      password: IS_DEVELOPER ? PETER_KAPENA_PASSWORD : "",
      username: IS_DEVELOPER ? PETER_KAPENA_EMAIL?.split("@")[0] : "",
      confirm_password: IS_DEVELOPER ? PETER_KAPENA_PASSWORD : "",
    },
  });

  const processForm: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      setIsLoading(true);

      const ok = await signUp(data);
      console.log(ok);

      setShowSubmitButton(false);

      if (ok) {
        setMessages([
          ...messages,
          "Sign up was successful. You will be redirected to sign in or or close this to sign in or login now.",
        ]);
        setTimeout(() => (window.location.href = "/"), 3000);
      } else {
        setMessages([
          ...messages,
          "Sign up failed. Try using different credentials. Otherwise, please contact support.",
        ]);
      }
      setIsSuccess(Boolean(ok));
    } catch (error) {
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
              <b>Register or Sign up!</b>
            </Typography>
            <Typography level="body-md">
              Sign up or register your account so to start making literatures'
              order or generate field service partners.
            </Typography>
          </div>
          <div>
            <ColorSchemeToggle />
          </div>
        </Box>
        <UserName
          showSubmitButton={showSubmitButton}
          error={errors.username}
          register={register}
        ></UserName>
        <Email
          showSubmitButton={showSubmitButton}
          error={errors.email}
          register={register}
        ></Email>

        <Password
          showSubmitButton={showSubmitButton}
          error={errors.password}
          register={register}
        ></Password>
        <ConfirmPassword
          showSubmitButton={showSubmitButton}
          error={errors.confirm_password}
          register={register}
        ></ConfirmPassword>

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
            onClick={() => push("/auth/signin")}
          >
            Already have an account? Sign in now!
          </Button>
        </Box>
        {showSubmitButton && (
          <SubmitLoadingButton
            isLoading={isLoading}
            title="Sign up "
          ></SubmitLoadingButton>
        )}

        {!showSubmitButton && messages.length > 0 && (
          <Notice
            isSuccess={isSuccess}
            onClose={() => {
              setShowSubmitButton(true);
              setMessages([]);
              reset();
              push("/auth/signin");
            }}
            messages={messages}
          />
        )}
      </form>
    </Sheet>
  );
}
