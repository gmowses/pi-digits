import { useState, useMemo } from 'react'
import { Sun, Moon, Languages, Search, Info } from 'lucide-react'

const translations = {
  en: {
    title: 'Pi Digits',
    subtitle: 'Browse, search and highlight digit sequences in the first 1000 digits of Pi.',
    displayCount: 'Display digits',
    searchSeq: 'Search for digit sequence',
    searchPlaceholder: 'e.g. 314, 2718, 99999',
    found: 'Found at position',
    notFound: 'Sequence not found in the first 1000 digits.',
    position: 'Position',
    digits: 'digits',
    facts: 'Fun facts about Pi',
    funFacts: [
      'Pi (π) is irrational: its decimal expansion never ends or repeats.',
      'The first 1 million digits of Pi contain "999999" starting at position 762 (the Feynman point).',
      'Pi Day is March 14 (3/14) — Albert Einstein\'s birthday.',
      'Ancient Egyptians approximated Pi as (16/9)² ≈ 3.1605, around 1650 BC.',
      'In 2020, Timothy Mullican computed Pi to 50 trillion digits, taking 303 days.',
      'The probability that two random integers are coprime is 6/π².',
      '"3.14" in a mirror looks like "PIE".',
      'Pi appears in Euler\'s identity: e^(iπ) + 1 = 0.',
    ],
    builtBy: 'Built by',
  },
  pt: {
    title: 'Digitos de Pi',
    subtitle: 'Navegue, pesquise e destaque sequencias de digitos nos primeiros 1000 digitos de Pi.',
    displayCount: 'Exibir digitos',
    searchSeq: 'Pesquisar sequencia de digitos',
    searchPlaceholder: 'ex: 314, 2718, 99999',
    found: 'Encontrado na posicao',
    notFound: 'Sequencia nao encontrada nos primeiros 1000 digitos.',
    position: 'Posicao',
    digits: 'digitos',
    facts: 'Curiosidades sobre Pi',
    funFacts: [
      'Pi (π) e irracional: sua expansao decimal nunca termina nem se repete.',
      'Os primeiros 1 milhao de digitos de Pi contem "999999" a partir da posicao 762 (ponto de Feynman).',
      'O Dia de Pi e 14 de marco (3/14) — aniversario de Albert Einstein.',
      'Os antigos egipcios aproximavam Pi como (16/9)² ≈ 3.1605, por volta de 1650 a.C.',
      'Em 2020, Timothy Mullican calculou Pi com 50 trilhoes de digitos, levando 303 dias.',
      'A probabilidade de dois inteiros aleatorios serem coprimos e 6/π².',
      'Pi aparece na identidade de Euler: e^(iπ) + 1 = 0.',
      '"3.14" num espelho parece "PIE" (em ingles).',
    ],
    builtBy: 'Criado por',
  }
} as const

type Lang = keyof typeof translations

// First 1000 decimal digits of Pi (after the "3.")
const PI_PARTS: string[] = [
  '1415926535897932384626433832795028841971693993751058209749445923078',
  '1640628620899862803482534211706798214808651328230664709384460955058',
  '2231725359408128481117450284102701938521105559644622948954930381964',
  '4288109756659334461284756482337867831652712019091456485669234603486',
  '1045432664821339360726024914127372458700660631558817488152092096282',
  '9254091715364367892590360011330530548820466521384146951941511609433',
  '0572703657595919530921861173819326117931051185480744623799627495673',
  '5188575272489122793818301194912983367336244065664308602139494639522',
  '4737190702179860943702770539217176293176752384674818467669405132000',
  '5681271452635608277857713427577896091736371787214684409012249534301',
  '4654958537105079227968925892354201995611212902196086403441815981362',
  '9774771309960518707211349999998372978049951059731732816096318595024',
  '4594553469083026425223082533446850352619311881710100031378387528865',
  '8753320838142061717766914730359825349042875546873115956286388235378',
  '7593751957781857780532171226806613001927876611195909216420198938095',
]
const PI_DIGITS: string = PI_PARTS.join('');

export default function PiDigits() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [displayCount, setDisplayCount] = useState(100)
  const [searchQuery, setSearchQuery] = useState('')

  const t = translations[lang]

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  const searchResult = useMemo(() => {
    const q = searchQuery.trim().replace(/\D/g, '')
    if (!q) return null
    const idx = PI_DIGITS.indexOf(q)
    return { query: q, position: idx >= 0 ? idx + 1 : -1 } // +1 for 1-based, after decimal
  }, [searchQuery])

  const renderDigits = () => {
    const fullStr = PI_DIGITS.slice(0, displayCount)
    const q = searchQuery.trim().replace(/\D/g, '')

    if (!q || searchResult?.position === -1) {
      // Render with colors by groups of 10
      const parts: React.ReactNode[] = ['3.']
      for (let i = 0; i < fullStr.length; i++) {
        const group = Math.floor(i / 10)
        const colors = ['text-purple-500', 'text-blue-500', 'text-green-500', 'text-amber-500', 'text-red-500']
        parts.push(
          <span key={i} className={`${colors[group % colors.length]}`}>{fullStr[i]}</span>
        )
        if ((i + 1) % 50 === 0 && i < fullStr.length - 1) parts.push(<br key={`br${i}`} />)
        else if ((i + 1) % 10 === 0 && i < fullStr.length - 1) parts.push(<span key={`sp${i}`} className="text-zinc-300 dark:text-zinc-700">{' '}</span>)
      }
      return parts
    }

    // Highlight search results
    const parts: React.ReactNode[] = ['3.']
    let i = 0
    while (i < fullStr.length) {
      if (fullStr.startsWith(q, i)) {
        parts.push(
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-700 text-zinc-900 dark:text-zinc-100 rounded px-0.5">{q}</mark>
        )
        i += q.length
      } else {
        parts.push(<span key={i} className="text-zinc-600 dark:text-zinc-400">{fullStr[i]}</span>)
        i++
      }
      if (i > 0 && i % 50 === 0 && i < fullStr.length) parts.push(<br key={`br${i}`} />)
      else if (i > 0 && i % 10 === 0 && i < fullStr.length) parts.push(<span key={`sp${i}`} className="text-zinc-300 dark:text-zinc-700">{' '}</span>)
    }
    return parts
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">π</span>
            </div>
            <span className="font-semibold">Pi Digits</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/pi-digits" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t.displayCount}</label>
                <span className="text-sm text-purple-500 font-semibold">{displayCount} {t.digits}</span>
              </div>
              <input type="range" min={10} max={1000} step={10} value={displayCount} onChange={e => setDisplayCount(Number(e.target.value))} className="w-full accent-purple-500" />
              <div className="flex justify-between text-[10px] text-zinc-400"><span>10</span><span>1000</span></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2"><Search size={14} />{t.searchSeq}</label>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value.replace(/\D/g, ''))}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
              {searchResult && searchQuery && (
                <p className={`text-xs font-medium ${searchResult.position >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {searchResult.position >= 0 ? `${t.found} ${searchResult.position} (${t.position} ${searchResult.position} after decimal)` : t.notFound}
                </p>
              )}
            </div>
          </div>

          {/* Digits display */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <pre className="font-mono text-sm leading-loose tracking-wider break-all whitespace-pre-wrap select-all">
              {renderDigits()}
            </pre>
          </div>

          {/* Fun facts */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
            <h2 className="font-semibold flex items-center gap-2"><Info size={16} className="text-purple-500" />{t.facts}</h2>
            <ul className="space-y-2">
              {t.funFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="text-purple-500 font-bold shrink-0">{i + 1}.</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-purple-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
