import { Link } from "react-router";

export function LandingLogo() {
  return (
    <Link to="/" className="flex items-center group no-underline">
      <img src="/ziplin-brand-logo.png" alt="ziplin logo" className="w-[128px] object-contain" />
    </Link>
  );
}

