"use client";
import * as React from "react";
import { Box, Breadcrumbs, Typography } from "@mui/joy";
import { ChevronRightRounded, HomeRounded } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "@mui/joy/Link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatUrl } from "@/utils/helpers";

export const BreadCrumbs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [paths, setPaths] = useState<string[]>([]);
  const { push } = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const p = formatUrl(url);

    if (p && (paths.length === 0 || paths[paths.length - 1] !== url)) {
      setPaths([...paths, url]);
    }
  }, [pathname, searchParams]);

  function shrinkPath(index: number): void {
    const ps = [...paths];
    ps.splice(index); // This will remove all elements after the specified index
    console.log(ps, index + 1);
    setPaths(ps); // Assuming setPaths is a function that updates the state of paths
  }

  if (!(session?.user as any)?.id) return <></>;

  return (
    <Breadcrumbs
      size="md"
      aria-label="breadcrumbs"
      separator={<ChevronRightRounded fontSize="small" />}
      sx={{ pl: 0 }}
    >
      <Link
        component="button"
        onClick={() => {
          shrinkPath(0);
          push("/");
        }}
      >
        <HomeRounded />
      </Link>
      {paths.map((path, index) => (
        <Box key={index}>
          {index === paths.length - 1 ? (
            <Typography color="primary" fontWeight={500} fontSize={12}>
              {formatUrl(path)}
            </Typography>
          ) : (
            <Link
              underline="none"
              component="button"
              fontSize={"small"}
              onClick={() => {
                shrinkPath(index);
                push(path);
              }}
            >
              {formatUrl(path)}
            </Link>
          )}
        </Box>
      ))}
    </Breadcrumbs>
  );
};
