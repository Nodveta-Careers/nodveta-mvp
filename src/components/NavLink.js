import NextLink from "next/link";
import { useRouter } from "next/router";
import { forwardRef } from "react";

const NavLink = forwardRef(function NavLink(
  { href, activeClassName = "", className = "", exact = false, children, ...props },
  ref
) {
  const router = useRouter();
  const isActive = exact
    ? router.pathname === href
    : router.pathname === href || router.pathname.startsWith(`${href}/`);
  const combinedClassName = [className, isActive ? activeClassName : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <NextLink href={href} ref={ref} className={combinedClassName} {...props}>
      {children}
    </NextLink>
  );
});

export default NavLink;
