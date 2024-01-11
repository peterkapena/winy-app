"use client";
import { Box } from "@mui/joy";
import React from "react";
import Button from "@mui/joy/Button";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

type SubmitButtonProps = {
  showReturn?: boolean;
  content?: React.ReactNode;
  fullWidth?: boolean
};
export function SubmitButton({
  showReturn: hideReturn = true,
  content = "Submit", fullWidth
}: SubmitButtonProps): React.ReactNode {
  const router = useRouter();
  return (
    <Box>
      {hideReturn && (
        <Button
          type="button"
          onClick={() => router.back()}
          sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}
          variant="plain"
          startDecorator={<ArrowBack />}
        >
          Return
        </Button>
      )}
      <Button type="submit" fullWidth={fullWidth} color="success" sx={{ mt: 2 }}>
        {content}
      </Button>
    </Box>
  );
}
