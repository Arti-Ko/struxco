interface PageHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeading({ title, subtitle, action }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        {subtitle && (
          <p className="eyebrow mb-2" style={{ color: "#7d7d80" }}>
            {subtitle}
          </p>
        )}
        <h1
          className="text-[2rem] font-bold leading-tight lg:text-[2.25rem]"
          style={{ color: "#ededed", letterSpacing: "-0.04em" }}
        >
          {title}
        </h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
