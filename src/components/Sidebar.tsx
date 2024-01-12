import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar } from "@/utils/helpers";
import {
  BarChartRounded,
  RoundedCorner,
  WineBarOutlined,
} from "@mui/icons-material";
import { APP_NAME } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { PAGES } from "@/common";
// import { CustomSession } from "@/app/api/auth/[...nextauth]/authOptions";
export default function Sidebar() {
  const { push } = useRouter();
  const { data: session } = useSession();
  // const roles = (session as CustomSession)?.roles;
  // console.log(roles);
  return (
    <div>
      {session?.user?.name && (
        <Sheet
          className="Sidebar"
          sx={{
            position: {
              xs: "fixed",
              md: "sticky",
            },
            transform: {
              xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
              md: "none",
            },
            transition: "transform 0.4s, width 0.4s",
            zIndex: 10000,
            height: "100dvh",
            width: "var(--Sidebar-width)",
            top: 0,
            p: 2,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <GlobalStyles
            styles={(theme) => ({
              ":root": {
                "--Sidebar-width": "220px",
                [theme.breakpoints.up("lg")]: {
                  "--Sidebar-width": "220px",
                },
              },
            })}
          />
          <Box
            className="Sidebar-overlay"
            sx={{
              position: "fixed",
              zIndex: 9998,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              opacity: "var(--SideNavigation-slideIn)",
              backgroundColor: "var(--joy-palette-background-backdrop)",
              transition: "opacity 0.4s",
              transform: {
                xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
                lg: "translateX(-100%)",
              },
            }}
            onClick={() => closeSidebar()}
          />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton variant="soft" color="primary" size="sm">
              <BarChartRounded />
            </IconButton>
            <Typography level="title-lg">{APP_NAME}</Typography>
            <ColorSchemeToggle sx={{ ml: "auto" }} />
          </Box>
          <Box
            sx={{
              minHeight: 0,
              overflow: "hidden auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              [`& .${listItemButtonClasses.root}`]: {
                gap: 1.5,
              },
            }}
          >
            <List
              size="sm"
              sx={{
                gap: 1,
                "--List-nestedInsetStart": "30px",
                "--ListItem-radius": (theme) => theme.vars.radius.sm,
              }}
            >
              <ListItem>
                <ListItemButton onClick={() => push("/")}>
                  <HomeRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Home</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>

              <ListItem color="warning">
                <ListItemButton
                  onClick={() => push(PAGES.add)}
                  color="warning"
                >
                  <WineBarOutlined />
                  <ListItemContent>
                    <Typography level="title-sm">Add a wine</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
            <Divider></Divider>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Avatar variant="outlined" size="sm" />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography level="title-sm" noWrap>{session?.user?.name}</Typography>
              <Typography level="body-xs" noWrap>{session?.user?.email}</Typography>
            </Box>
            <IconButton onClick={() => signOut()}>
              <LogoutRoundedIcon />
            </IconButton>
          </Box>
        </Sheet>
      )}
    </div>
  );
}
