type Props = {
  title: string
  subtitle: string
  delayClass?: string
}

export function ClientePageHeader({ title, subtitle, delayClass = '' }: Props) {
  return (
    <div className={`animate-client-fade-up ${delayClass}`}>
      <h1 className="cliente-heading-gradient text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-600">
        {subtitle}
      </p>
    </div>
  )
}
