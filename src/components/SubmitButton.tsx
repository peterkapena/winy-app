"use client";
import { Box } from "@mui/joy";
import React from "react";
import Button from "@mui/joy/Button";
import { useRouter } from "next/navigation";

type SubmitButtonProps = {
  showReturn?: boolean;
  content?: React.ReactNode;
};
export function SubmitButton({
  showReturn: hideReturn = true,
  content = "Submit",
}: SubmitButtonProps): React.ReactNode {
  const router = useRouter();
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
      {hideReturn && (
        <Button
          type="button"
          onClick={() => router.back()}
          sx={{ display: "flex", justifyContent: "flex-start", m: 1 }}
          variant="soft"
        >
          Return
        </Button>
      )}
      <Button type="submit" color="success"  sx={{ display: "flex", justifyContent: "flex-start", m: 1 }}>
        {content}
      </Button>
    </Box>
  );
}
