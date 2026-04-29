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
                className="group flex h-full min-h-[9.25rem] flex-col items-center justify-center gap-3 rounded-lg border border-line bg-white px-4 py-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-elevated)] active:border-primary/35 sm:min-h-[8.75rem]"
                title={p.name}
              >
                <div className="relative h-14 w-full transition-[height] duration-300 group-hover:h-[4.25rem] group-active:h-[4.25rem] sm:h-12 sm:group-hover:h-16 sm:group-active:h-16">
                  <Image
                    src={p.src}
                    alt={`${p.name} logo`}
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                    className="object-contain"
                  />
                </div>
                <span className="text-center text-[12px] font-medium leading-snug text-ink-muted transition-all duration-300 group-hover:text-[14px] group-hover:font-semibold group-hover:text-ink group-active:text-[14px] group-active:font-semibold group-active:text-ink sm:group-hover:text-[15px] sm:group-active:text-[15px]">
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
