import { TOKEN_COLOR } from "../constants/colors.constants";

export function linkColor(title: string) {
  const colors = [
    TOKEN_COLOR.PRIMARY,
    "#164BB7",
    TOKEN_COLOR.SUCCESS,
    TOKEN_COLOR.WARNING,
    "#0E2F73",
    "#FFC60A",
    "#164BB7",
    "#F4B400",
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++)
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

