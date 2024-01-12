"use client"
import { PAGES } from '@/common';
import { InfoRounded, WineBarRounded } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/joy'
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const { push } = useRouter();

  if (!(session?.user as any)?.id) return <CircularProgress></CircularProgress>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          my: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2">Welcome!</Typography>
        <Button
          endDecorator={<WineBarRounded />}
          size="md"
          onClick={() => push(PAGES.add_or_edit_wine + "0")}
        >
          Add wine
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: { sm: "50%" },
          flexDirection: "column",
        }}
      >
        <Alert
          variant="outlined"
          startDecorator={<InfoRounded color="primary" />}
        >
          <div>
            <Typography level="body-sm">
              Here is a list of your favourite wines.
              To add a new one to the list use the button at the rigth. Or click on one in the list to edit it.
            </Typography>
          </div>
        </Alert>
        
      </Box>
    </Box>
  )
}
