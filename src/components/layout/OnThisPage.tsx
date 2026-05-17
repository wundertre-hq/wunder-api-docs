import { useEffect, useState } from "react";

export function OnThisPage() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const els = Array.from(document.querySelectorAll<HTMLHeadingElement>(".docs-prose h2, .docs-prose h3"));
      setHeadings(
        els
          .filter((el) => el.id)
          .map((el) => ({ id: el.id, text: el.textContent ?? "", level: Number(el.tagName[1]) })),
      );
    };
    update();
    const t = setTimeout(update, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-20 hidden w-56 shrink-0 self-start text-sm xl:block">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </div>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1.25rem" : "0.75rem" }}>
            <a
              href={`#${h.id}`}
              className={
                "block -ml-px border-l py-0.5 pl-3 text-[13px] transition-colors " +
                (active === h.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
