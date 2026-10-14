export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-cream/10 px-6 py-8 font-body text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Kenram Car Rental. Isulan, Sultan Kudarat.</p>
        <div className="flex gap-6">
          <a href="/fleet" className="hover:text-cream/80">
            Fleet
          </a>
          <a href="/#why" className="hover:text-cream/80">
            Why Kenram
          </a>
          <a href="/contact" className="hover:text-cream/80">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}