import Image from "next/image";

export function TrustedPartnersSection() {
  const partners: { name: string; src: string; short: string }[] = [
    {
      name: "Bergen Community College",
      src: "/uni1.png",
      short: "Bergen CC",
    },
    { name: "Lincoln Tech", src: "/uni2.jpeg", short: "Lincoln Tech" },
    {
      name: "New Jersey City University",
      src: "/uni3.png",
      short: "NJCU",
    },
    {
      name: "Middlesex College",
      src: "/uni4.png",
      short: "Middlesex College",
    },
    {
      name: "Passaic County Community College",
      src: "/uni5.jpeg",
      short: "Passaic County CC",
    },
    {
      name: "Passaic County One Stop Career Center",
      src: "/uni6.jpeg",
      short: "Passaic One Stop",
    },
  ];

  return (
    <section
      className="border-y border-line bg-white"
      aria-labelledby="trusted-partners-heading"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-12 sm:py-14">
        <div className="max-w-3xl">
          <p
            id="trusted-partners-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            Trusted partners
          </p>
          <h2 className="mt-2 text-[22px] sm:text-[26px] font-semibold tracking-tight leading-snug text-ink">
            We work with colleges, training providers, and workforce
            organizations.
          </h2>
          <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
            Career Access Hub is delivered by EmployReady Partners in
            coordination with community colleges, accredited training providers,
            and county workforce boards across Bergen, Passaic, and Hudson.
          </p>
        </div>

        <ul
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
          role="list"
        >
          {partners.map((p) => (
            <li key={p.name}>
              <div
                className="group flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-line bg-white px-4 py-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-primary/35 hover:shadow-[var(--shadow-elevated)] active:border-primary/35"
                title={p.name}
              >
                <div className="relative h-14 w-full overflow-hidden sm:h-12">
                  <Image
                    src={p.src}
                    alt={`${p.name} logo`}
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                    className={`object-contain ${
                      p.short === "Passaic One Stop"
                        ? "brightness-150 contrast-150"
                        : ""
                    } transition-transform duration-300 group-hover:scale-[1.75] group-active:scale-[1.75] group-focus-within:scale-[1.75]`}
                  />
                </div>
                <span className="text-center text-[12px] font-medium leading-snug text-ink-muted transition-all duration-300 group-hover:text-[16px] group-hover:font-semibold group-hover:text-ink group-active:text-[16px] group-active:font-semibold group-active:text-ink group-focus-within:text-[16px] group-focus-within:font-semibold group-focus-within:text-ink">
                  {p.short}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[13px] text-ink-subtle">
          And a growing network of county workforce boards, community
          organizations, and employer partners.
        </p>
      </div>
    </section>
  );
}
