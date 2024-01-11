export const openSidebar = () => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
};

export const closeSidebar = () => {
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
};

export const toggleSidebar = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
};
export const dateFormatOptinos: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
}; //{ month: 'short', day: 'numeric', year: 'numeric' };
export const en_US_Locale = "en-US";

export function formatUrl(url: string) {
  // Remove the first and last characters if they are '/' or '?'
  url = url.replace(/^[\/?]|[\/?]$/g, "");

  // Split the url by '/'
  const parts = url.split("/");

  // Check if the third part is an ID and truncate it if necessary
  if (parts[2] && parts[2].length > 4) {
    parts[2] = parts[2].substring(0, 4);
  }

  // Join the first three parts with a comma and space, and return the result
  const formatUrl = parts.slice(0, 3).join(", ");

  return capitalize(formatUrl);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
