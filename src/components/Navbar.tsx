const NAV_LINKS = [
  { label: "Fleet", href: "/fleet" },
  { label: "Why Kenram", href: "/#why" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-navy"
        >
          Kenram Car Rental
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm text-ink transition-colors hover:text-amber"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="tel:09972434914"
          className="rounded-sm bg-navy px-4 py-2 font-body text-sm font-medium text-cream transition-colors hover:bg-navy-dark"
        >
          0997&#8209;243&#8209;4914
        </a>
      </div>
    </header>
  );
}