"use client"
import ThemeRegistry from './ThemeRegistry'
import { Box } from '@mui/joy'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SessionProvider } from 'next-auth/react';
import { BreadCrumbs } from '@/BreadCrumbs';
import { Session } from 'next-auth';


export default function RootLayout({
  children, session
}: {
  children: React.ReactNode,
  session: Session | null;
}) {
  return (
    <html lang="en">
      <body >
        <ThemeRegistry options={{ key: 'joy' }}>
          <SessionProvider session={session}>
            <Box sx={{ display: "flex", minHeight: "100dvh" }}>
              <Header />
              <Sidebar />
              <Box
                component="main"
                className="MainContent"
                sx={{
                  px: {
                    xs: 2,
                    md: 6,
                  },
                  pt: {
                    xs: "calc(12px + var(--Header-height))",
                    sm: "calc(12px + var(--Header-height))",
                    md: 3,
                  },
                  pb: {
                    xs: 2,
                    sm: 2,
                    md: 3,
                  },
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  height: "100dvh",
                  gap: 1,
                }}
              >
                {<BreadCrumbs />}
                {children}
              </Box>
            </Box>
          </SessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
