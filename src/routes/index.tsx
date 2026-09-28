import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroCar from "@/assets/hero-car.jpg";

// ============================================================
// Dados de contato — confirmados no site oficial mbrunoseguros.com.br
// ============================================================
const WHATSAPP_NUMBER = "5551999713944";
const ADDRESS = "Avenida Gal. Flores da Cunha, 903 - 916";
const CITY = "Cachoeirinha - RS";
const INSTAGRAM_URL = "https://www.instagram.com/mbrunoseguros";
const FACEBOOK_URL = "https://www.facebook.com/mbrunoseguros";
const SITE_URL = "https://mbrunoseguros.com.br/";

const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// ============================================================
// Estimativa de cotação (faixa, baseada no valor Fipe informado)
// Fatores anuais aproximados do mercado; resultado é estimativa.
// ============================================================
type VehicleType = "carro" | "moto" | "caminhao";
type Coverage = "basica" | "completa";

const FACTORS: Record<VehicleType, Record<Coverage, [number, number]>> = {
  carro: { basica: [0.022, 0.035], completa: [0.045, 0.075] },
  moto: { basica: [0.03, 0.05], completa: [0.06, 0.1] },
  caminhao: { basica: [0.02, 0.03], completa: [0.04, 0.06] },
};

const VEHICLE_LABEL: Record<VehicleType, string> = {
  carro: "Carro",
  moto: "Moto",
  caminhao: "Caminhão",
};

const COVERAGE_LABEL: Record<Coverage, string> = {
  basica: "Básica (terceiros)",
  completa: "Completa (compreensiva)",
};

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

// ============================================================
// Logotipo MBruno (recriação tipográfica da marca)
// ============================================================
function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5 select-none">
      <span
        className="font-display text-2xl font-extrabold tracking-tight text-primary"
        aria-hidden="true"
      >
        M
      </span>
      <span
        className={`font-display text-2xl font-bold tracking-[0.14em] ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        BRUNO
      </span>
    </span>
  );
}

// ============================================================
// Ícones (SVG inline)
// ============================================================
const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.115-.199.058-.372-.03-.521-.086-.148-.66-1.59-.904-2.178-.238-.571-.48-.494-.66-.503l-.558-.01c-.194 0-.51.072-.777.372-.267.297-1.02.997-1.02 2.43 0 1.434 1.044 2.82 1.19 3.015.148.198 2.056 3.14 4.982 4.404.696.3 1.24.48 1.664.615.7.222 1.336.19 1.84.115.562-.084 1.75-.716 1.998-1.407.247-.69.247-1.283.173-1.407-.073-.124-.271-.198-.568-.347z" />
    <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.02 12.02 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.98.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.437-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.887 9.886z" />
  </svg>
);

const CheckIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PinIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

// ============================================================
// Página
// ============================================================
export function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <main>
        <Hero />
        <Simulation />
        <Benefits />
        <HowItWorks />
        <Insurers />
        <AboutStrip />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

// ------------------------------------------------------------
// Header
// ------------------------------------------------------------
function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#topo" aria-label="MBruno Corretora de Seguros">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#simulacao" className="transition-colors hover:text-primary">Simular seguro</a>
          <a href="#coberturas" className="transition-colors hover:text-primary">Coberturas</a>
          <a href="#seguradoras" className="transition-colors hover:text-primary">Seguradoras</a>
          <a href="#sobre" className="transition-colors hover:text-primary">Sobre</a>
        </nav>
        <a
          href={whatsappLink("Olá! Gostaria de falar com a MBruno sobre seguro de veículo.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:brightness-110"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Fale conosco</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

// ------------------------------------------------------------
// Hero + Simulação
// ------------------------------------------------------------
function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-speedlines" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold tracking-wide text-secondary-foreground uppercase">
            Corretora desde 1990
          </span>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[3.4rem]">
            Seguro de veículo{" "}
            <span className="text-primary">sem complicação</span>, com quem
            entende de verdade.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Carros, motos e caminhões com cotação em minutos entre as 11
            principais seguradoras do Brasil. Você simula online e fecha com um
            corretor de verdade — direto no WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#simulacao"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
            >
              Simular agora
            </a>
            <a
              href="#coberturas"
              className="inline-flex items-center gap-2 rounded-full border-2 border-border px-6 py-3 text-base font-bold text-foreground transition hover:border-primary hover:text-primary"
            >
              Ver coberturas
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 text-primary" /> Cotação gratuita
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 text-primary" /> Atendimento humano
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 text-primary" /> Sinistro com apoio do início ao fim
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl shadow-ink/20">
            <img
              src={heroCar}
              alt="Carro azul em movimento na cidade"
              className="h-64 w-full object-cover sm:h-80"
              width={1280}
              height={800}
            />
          </div>
          <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-card px-5 py-3.5 shadow-xl shadow-ink/15">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <PinIcon className="h-5 w-5 text-primary" />
            </span>
            <div>
              <p className="text-sm font-bold">{CITY}</p>
              <p className="text-xs text-muted-foreground">Atendimento em todo o RS e Brasil</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Simulação (formulário de cotação + captura de lead)
// ------------------------------------------------------------
function Simulation() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("carro");
  const [coverage, setCoverage] = useState<Coverage>("completa");
  const [fipe, setFipe] = useState("");
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [estimate, setEstimate] = useState<[number, number] | null>(null);
  const [error, setError] = useState("");

  const fipeValue = useMemo(() => {
    const n = Number(fipe.replace(/\D/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [fipe]);

  const canSubmit = name.trim().length >= 3 && phone.replace(/\D/g, "").length >= 10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (fipeValue < 5000) {
      setError("Informe um valor Fipe válido (mínimo R$ 5.000).");
      setEstimate(null);
      return;
    }
    if (!canSubmit) {
      setError("Preencha seu nome e WhatsApp para receber a cotação.");
      return;
    }
    const [lo, hi] = FACTORS[vehicleType][coverage];
    const currentYear = new Date().getFullYear();
    const vehicleYear = Number(year) || currentYear;
    const ageFactor = currentYear - vehicleYear > 12 ? 1.1 : 1;
    const low = (fipeValue * lo * ageFactor) / 12;
    const high = (fipeValue * hi * ageFactor) / 12;
    setEstimate([low, high]);

    const message = [
      "Olá! Fiz uma simulação de seguro no site da MBruno:",
      `• Nome: ${name.trim()}`,
      `• Veículo: ${VEHICLE_LABEL[vehicleType]} ${year ? `(${year})` : ""}`,
      `• Valor Fipe informado: ${formatBRL(fipeValue)}`,
      `• Cobertura: ${COVERAGE_LABEL[coverage]}`,
      city.trim() ? `• Cidade: ${city.trim()}` : null,
      `• Estimativa mensal no site: ${formatBRL(low)} a ${formatBRL(high)}`,
      "",
      "Gostaria de receber uma cotação oficial.",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener");
  }

  return (
    <section id="simulacao" className="relative scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative -mt-2 overflow-hidden rounded-4xl bg-ink px-6 py-10 text-white shadow-2xl sm:px-10">
          <div className="absolute inset-0 bg-speedlines opacity-40" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Simule seu seguro em <span className="text-primary-glow">1 minuto</span>
              </h2>
              <p className="mt-4 text-white/75">
                Informe os dados do veículo e receba na hora uma estimativa do
                valor mensal. Depois, um corretor da MBruno refina sua cotação
                com as melhores seguradoras — direto no seu WhatsApp, sem
                compromisso.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-semibold text-white/85">
                {[
                  "Estimativa imediata, sem cadastro em site de seguradora",
                  "Cotação oficial comparando 11 seguradoras",
                  "Apoio total em caso de sinistro",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/25">
                      <CheckIcon className="h-3 w-3 text-primary-glow" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-card p-6 text-foreground shadow-xl sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold" htmlFor="tipo">Tipo de veículo</label>
                  <select
                    id="tipo"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                    <option value="caminhao">Caminhão</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold" htmlFor="ano">Ano do veículo</label>
                  <input
                    id="ano"
                    inputMode="numeric"
                    placeholder="Ex.: 2021"
                    value={year}
                    onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold" htmlFor="fipe">
                    Valor da Tabela Fipe
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      R$
                    </span>
                    <input
                      id="fipe"
                      inputMode="numeric"
                      placeholder="45000"
                      value={fipe}
                      onChange={(e) => setFipe(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-input bg-background py-2.5 pr-3.5 pl-10 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Consulte grátis em veiculos.fipe.org.br
                  </p>
                </div>
                <div>
                  <label className="text-sm font-bold" htmlFor="cidade">Cidade</label>
                  <input
                    id="cidade"
                    placeholder="Ex.: Cachoeirinha"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              <fieldset className="mt-5">
                <legend className="text-sm font-bold">Cobertura desejada</legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {(Object.keys(COVERAGE_LABEL) as Coverage[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCoverage(c)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
                        coverage === c
                          ? "border-primary bg-secondary text-secondary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {COVERAGE_LABEL[c]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold" htmlFor="nome">Seu nome</label>
                  <input
                    id="nome"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold" htmlFor="fone">Seu WhatsApp</label>
                  <input
                    id="fone"
                    inputMode="tel"
                    placeholder="(51) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive">
                  {error}
                </p>
              )}

              {estimate && !error && (
                <div className="mt-4 rounded-2xl bg-secondary px-5 py-4 text-center">
                  <p className="text-sm font-semibold text-secondary-foreground">
                    Estimativa mensal aproximada
                  </p>
                  <p className="mt-0.5 text-2xl font-extrabold text-primary">
                    {formatBRL(estimate[0])} – {formatBRL(estimate[1])}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Valor de referência. A cotação oficial depende do perfil do
                    condutor e da seguradora.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {estimate ? "Simular novamente no WhatsApp" : "Ver estimativa e receber cotação"}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Ao enviar, abrimos o WhatsApp com sua simulação pronta para o
                corretor. Sem spam, sem compromisso.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Coberturas / benefícios
// ------------------------------------------------------------
const BENEFITS = [
  {
    title: "Cobertura compreensiva",
    desc: "Colisão, roubo e furto, incêndio e responsabilidade civil — a proteção completa para o seu veículo.",
  },
  {
    title: "Assistência 24h",
    desc: "Guincho, chaveiro, carro reserva e socorro a qualquer hora, em todo o território nacional.",
  },
  {
    title: "Vidros e faróis",
    desc: "Cobertura para vidros, faróis, lanternas e retrovisores, com reposição rápida.",
  },
  {
    title: "Apoio no sinistro",
    desc: "A MBruno acompanha você do aviso de sinistro até a indenização, sem burocracia.",
  },
];

function Benefits() {
  return (
    <section id="coberturas" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Proteção completa para o seu veículo
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Montamos a apólice sob medida: você escolhe o nível de cobertura e
            nós cuidamos do resto.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                <CheckIcon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Como funciona
// ------------------------------------------------------------
const STEPS = [
  {
    n: "1",
    title: "Simule online",
    desc: "Informe o veículo e o valor Fipe. Na hora, você vê uma faixa de preço estimada.",
  },
  {
    n: "2",
    title: "Receba cotações reais",
    desc: "Um corretor da MBruno compara as 11 principais seguradoras e te envia as melhores condições no WhatsApp.",
  },
  {
    n: "3",
    title: "Contrate tranquilo",
    desc: "Você escolhe a melhor proposta e conta com nosso apoio durante toda a vigência da apólice.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-surface-tint py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Como funciona</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Simples assim: três passos entre você e o seguro ideal.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-3xl bg-card p-7 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-lg font-extrabold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="#simulacao"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
          >
            Começar minha simulação
          </a>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Seguradoras parceiras
// ------------------------------------------------------------
const INSURERS = [
  "SulAmérica",
  "Tokio Marine",
  "Allianz",
  "Azul Seguros",
  "HDI Seguros",
  "Itaú Seguros",
  "Porto Seguro",
  "Bradesco Seguros",
  "Liberty Seguros",
  "Mapfre",
  "Sompo",
];

function Insurers() {
  return (
    <section id="seguradoras" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Trabalhamos com as <span className="text-primary">11 principais seguradoras</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Cotejamos o mercado inteiro para garantir o melhor preço e a melhor
          cobertura para o seu perfil.
        </p>
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {INSURERS.map((name) => (
            <li
              key={name}
              className="rounded-full border border-border bg-card px-5 py-2.5 font-display text-base font-bold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Sobre
// ------------------------------------------------------------
function AboutStrip() {
  return (
    <section id="sobre" className="scroll-mt-20 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-4xl bg-secondary p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Mais de 35 anos protegendo o patrimônio de quem confia na gente
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A MBruno é uma corretora de seguros com atuação desde 1990 no
              mercado gaúcho e brasileiro. São décadas de experiência
              negociando com as maiores seguradoras do país — e de clientes que
              voltam e indicam. Aqui, seu seguro é tratado por pessoas, não por
              robôs.
            </p>
            <a
              href={whatsappLink("Olá! Vim pelo site da MBruno e gostaria de conversar.")}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink/90"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Conversar com um corretor
            </a>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "1990", v: "Ano de fundação" },
              { k: "11", v: "Seguradoras parceiras" },
              { k: "35+", v: "Anos de mercado" },
              { k: "24h", v: "Assistência nas apólices" },
            ].map((stat) => (
              <div key={stat.k} className="rounded-3xl bg-card p-6 text-center shadow-sm">
                <dt className="sr-only">{stat.v}</dt>
                <dd className="font-display text-3xl font-extrabold text-primary">{stat.k}</dd>
                <dd className="mt-1 text-sm font-semibold text-muted-foreground">{stat.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// Footer
// ------------------------------------------------------------
const FOOTER_LINKS = ["Automóvel", "Residencial", "Vida", "Bicicleta", "Condomínio", "Empresarial"];

function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            Corretora de seguros com atuação desde 1990 no mercado gaúcho e
            brasileiro. Proteja seu patrimônio agora.
          </p>
          <div className="mt-6 flex items-start gap-2.5 text-sm">
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
            <div>
              <p className="font-bold">{CITY}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS} ${CITY}`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-white/60 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                {ADDRESS}
              </a>
            </div>
          </div>
        </div>
        <div className="md:text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
            Nossos seguros
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((l) => (
              <li key={l}>
                <a
                  href="#simulacao"
                  className="font-display text-sm font-bold tracking-wide text-primary-glow uppercase transition hover:text-white"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-5 md:items-center">
          <a
            href={whatsappLink("Olá! Gostaria de falar com a MBruno.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Fale conosco
          </a>
          <div className="flex gap-3">
            <a
              href={INSTAGRAM_URL}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-primary-glow hover:text-primary-glow"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#topo"
              aria-label="Facebook da MBruno"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-primary-glow hover:text-primary-glow"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.3 1.2-3.3 3.4V11H8.5v3H11v7h2.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} MBruno Corretora de Seguros · {CITY} · SUSEP
      </div>
    </footer>
  );
}

// ------------------------------------------------------------
// Botão flutuante de WhatsApp
// ------------------------------------------------------------
function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Olá! Vim pelo site da MBruno e quero cotar meu seguro de veículo.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MBruno Corretora | Seguro de Veículo — Carro, Moto e Caminhão" },
      {
        name: "description",
        content:
          "Simule grátis seu seguro de carro, moto ou caminhão. Corretora desde 1990 em Cachoeirinha-RS, cotação entre as 11 principais seguradoras do Brasil, direto no WhatsApp.",
      },
      { property: "og:title", content: "MBruno Corretora | Seguro de Veículo" },
      {
        property: "og:description",
        content:
          "Simule online em 1 minuto e receba a cotação das 11 principais seguradoras no seu WhatsApp. Corretora desde 1990 em Cachoeirinha-RS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
],
    links: [],
  }),
  component: Index,
});
