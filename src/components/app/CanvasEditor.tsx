// İhtiyaç sihirbazı: the 7-field canvas as a guided, one-question-per-screen flow.
// The kurum's own words are read first (Niri's model, checked by engine/ground.ts, or the rules
// offline); the score from canvas.ts is shown live and each check turns green as the answer improves.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import type { Canvas, ConstraintKind } from '../../lib/types.ts';
import { actions, byId, currentOrg, getState, useAppState, useView } from '../../lib/store.ts';
import { assessCanvas, isCheckable, PUBLISH_THRESHOLD, SAMPLE_COMPLAINT } from '../../lib/engine/canvas.ts';
import type { Rejected, Suggestion } from '../../lib/engine/ground.ts';
import { readComplaint, type Reading } from '../../lib/ai.ts';
import { rankCandidates, similarNeeds } from '../../lib/engine/match.ts';
import { CONSTRAINT, PILOT_STATUS } from '../../lib/labels.ts';
import { uid } from '../../lib/format.ts';
import { skillLabel, skillsInText } from '../../lib/skills.ts';
import { type Mood } from '../ui/Niri';
import NiriSays from '../ui/NiriSays';
import SkillPicker from '../ui/SkillPicker';
import { Bar, celebrate, CountUp, feedback, Ring, Sheet, Why } from '../ui/kit';
import { CheckCircle } from '../ui/icons';
import { OrgMark, StatusIcon } from '../ui/primitives';
import { FIT_MIN, gateNote } from '../kurum/NeedBits';

const EMPTY: Canvas = {
  current: '',
  pain: '',
  painMetric: '',
  outcome: '',
  criteria: [{ id: 'c-0', text: '' }],
  constraints: [],
  decisionMaker: '',
  scope: '',
};

type StepId = 'dert' | 'okuma' | 'current' | 'pain' | 'painMetric' | 'outcome' | 'criteria' | 'constraints' | 'decisionMaker' | 'scope' | 'skills' | 'title' | 'review';
type Q = Exclude<StepId, 'dert' | 'okuma' | 'review'>;
type TextField = 'current' | 'pain' | 'painMetric' | 'outcome' | 'decisionMaker' | 'scope';

const TEXT: Q[] = ['current', 'pain', 'painMetric', 'outcome', 'decisionMaker', 'scope'];
const ORDER: StepId[] = ['dert', 'okuma', 'current', 'pain', 'painMetric', 'outcome', 'criteria', 'constraints', 'decisionMaker', 'scope', 'skills', 'title', 'review'];

const LABEL: Record<Q, string> = {
  current: 'Mevcut durum',
  pain: 'Sorun',
  painMetric: 'Sorunun ölçüsü',
  outcome: 'Beklenen sonuç',
  criteria: 'Başarı kriterleri',
  constraints: 'Kısıtlar',
  decisionMaker: 'Karar verici',
  scope: 'Deneme projesinin kapsamı',
  skills: 'Yetkinlikler',
  title: 'Başlık',
};

const META: Record<Q, { q: string; hint: string; tip: string; ex: string; ph: string }> = {
  current: {
    q: 'Bugün bu iş nasıl yürüyor?',
    hint: 'Hangi süreç, hangi araçla, ne ölçekte? Bir yabancıya anlatır gibi yaz.',
    tip: 'Kısa ama somut ol: araç adı ve ölçek yeter.',
    ex: 'Günlük 3.000 teslimat noktasının rotası her sabah tek iş parçacıklı bir Python betiğiyle hesaplanıyor.',
    ph: 'ör. Randevular telefonla alınıyor ve elle bir tabloya yazılıyor…',
  },
  pain: {
    q: 'Sorun tam olarak ne?',
    hint: 'Sorun kimi, nasıl etkiliyor? Tek cümle yeter.',
    tip: 'Çözümü değil sorunu yaz: kim neyi yapamıyor?',
    ex: 'Hesaplama bitmeden araçlar depodan çıkamıyor; sabahın ilk teslimatları gecikiyor.',
    ph: 'ör. Hastalar sıra beklerken vazgeçiyor…',
  },
  painMetric: {
    q: 'Bu sorun bugün hangi sayıyla ölçülüyor?',
    hint: 'Süre, oran, maliyet ya da adet. Sayı yoksa deneme projesinin başarısı ölçülemez.',
    tip: 'Tahmini bir sayı bile işe yarar. En az bir rakam yaz.',
    ex: 'Hesaplama süresi ortalama 45 dk; sabah ilk teslimat gecikmesi %18',
    ph: 'ör. Ortalama bekleme 45 dk; şikâyet oranı %27',
  },
  outcome: {
    q: 'Deneme projesi bitince elinde ne olacak?',
    hint: 'Bir ürün, servis ya da rapor. Çıktıyı somut tarif et.',
    tip: '“Şu işi yapan bir servis” gibi tarif edersen adaylar seni hızla anlar.',
    ex: 'Aynı kısıtlarla çalışan, ölçülebilir hızda yeni bir rota servisi.',
    ph: 'ör. Randevuları otomatik hatırlatan bir web paneli…',
  },
  criteria: {
    q: 'Başarıyı hangi sayılar gösterir?',
    hint: 'En az iki kriter yaz. Her biri deneme projesinde bir aşama olur.',
    tip: 'Kriterde bir eşik değer ya da “teslim edilir” gibi net bir ifade olsun.',
    ex: '3.000 noktalık rota hesaplaması 5 dakikanın altında tamamlanır',
    ph: 'ör. Konum bilgisi panele 30 saniyeden kısa sürede yansır',
  },
  constraints: {
    q: 'Sınırların neler?',
    hint: 'Bütçe, süre, veri ya da mevzuat. En az birini ekle.',
    tip: 'Kısıtı baştan söylemek adayın hızlı karar vermesini sağlar.',
    ex: 'Süre: deneme projesi 6 hafta sürer',
    ph: '',
  },
  decisionMaker: {
    q: 'Aşamaları kim onaylayacak?',
    hint: 'Kurum adına karar verecek rol ya da kişi.',
    tip: 'Bir unvan yeter, ad vermek zorunda değilsin.',
    ex: 'Operasyon Direktörü',
    ph: 'ör. Bilgi İşlem Müdürü',
  },
  scope: {
    q: 'Deneme projesini en küçük hâliyle nerede deneyelim?',
    hint: 'Tek bölge, tek müşteri ya da tek ürün grubu.',
    tip: 'Küçük başlamak projenin bitme şansını artırır.',
    ex: 'Yalnız Tuzla deposu ve 1 haftalık geçmiş sipariş verisi.',
    ph: 'ör. Yalnız tek şube ve son bir ayın verisi',
  },
  skills: {
    q: 'Hangi yetkinlikler gerekli?',
    hint: 'Yazdıklarından çıkardıklarımı seçili getirdim. İstediğini ekle ya da çıkar.',
    tip: 'Eşleşme bu listeye göre yapılır. Gereğinden geniş tutma.',
    ex: 'Go, Optimizasyon, API tasarımı',
    ph: '',
  },
  title: {
    q: 'İhtiyaca bir ad ver',
    hint: 'Sonuç odaklı tek cümle: “X’ten Y’ye indirmek”.',
    tip: 'Başlık adaylara ilk görünen şeydir. Sayıyı başlığa koy.',
    ex: 'Sabah rota hesaplamasını 45 dakikadan 5 dakikanın altına indirmek',
    ph: 'ör. Randevu bekleme süresini 45 dakikadan 10 dakikaya indirmek',
  },
};

const CONSTRAINT_PH: Record<ConstraintKind, string> = {
  butce: 'ör. Deneme projesi bütçesi 60.000 TL',
  sure: 'ör. Deneme projesi süresi 6 hafta',
  veri: 'ör. Gerçek adres yerine anonim koordinat verilir',
  mevzuat: 'ör. KVKK: veri maskelenir',
  teknoloji: 'ör. Sensörler MQTT üzerinden yayın yapıyor',
};

const SLIDE: Variants = {
  enter: (d: number) => ({ x: d * 56, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } },
  exit: (d: number) => ({ x: d * -56, opacity: 0, transition: { duration: 0.12 } }),
};

type Done = { kind: 'draft' | 'published' | 'saved'; id: string; fits: number };

export default function CanvasEditor() {
  const s = useAppState();
  const view = useView();
  const rm = useReducedMotion();
  const editId = typeof location !== 'undefined' ? (new URLSearchParams(location.search).get('id') ?? undefined) : undefined;
  const existing = byId.need(s, editId);
  const org = byId.org(s, existing?.orgId ?? currentOrg(s, view).id)!;
  const [reading, setReading] = useState<Reading | null>(null);
  const [busy, setBusy] = useState(false);
  // "okuma" shows what was read from the text, so it exists only once there is a reading.
  const order = existing ? ORDER.filter((x) => x !== 'dert' && x !== 'okuma') : reading ? ORDER : ORDER.filter((x) => x !== 'okuma');
  const isLive = Boolean(existing && existing.status !== 'draft');

  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [c, setC] = useState<Canvas>(() => {
    if (!existing) return EMPTY;
    const k = structuredClone(existing.canvas);
    return { ...k, criteria: k.criteria.length ? k.criteria : [{ id: uid('c'), text: '' }] };
  });
  const [raw, setRaw] = useState('');
  const [extra, setExtra] = useState<string[]>(existing?.skills ?? []);
  const [removed, setRemoved] = useState<string[]>([]);
  const [savedId, setSavedId] = useState(existing?.id);
  const [done, setDone] = useState<Done | null>(null);
  const [quit, setQuit] = useState(false);
  const [mem, setMem] = useState(false);
  const start = useRef(JSON.stringify(c));

  const text = [title, c.current, c.pain, c.painMetric, c.outcome, c.scope, ...c.criteria.map((k) => k.text), ...c.constraints.map((k) => k.text)].join('. ');
  const auto = useMemo(() => skillsInText(text), [text]);
  const skills = [...new Set([...auto, ...extra])].filter((k) => !removed.includes(k));
  const a = assessCanvas(c, skills);
  const titleOk = title.trim().length >= 8;
  const ready = a.canPublish && titleOk;
  const memory = similarNeeds(s, skills, savedId);
  const id = order[i];
  const dirty = !done && (JSON.stringify(c) !== start.current || title !== (existing?.title ?? '') || raw.trim() !== '');

  // The moment the gate opens deserves a nod, but only when it actually flips.
  const gate = useRef(a.canPublish);
  useEffect(() => {
    if (a.canPublish && !gate.current) feedback({ tone: 'good', title: 'Artık yayımlayabilirsin', text: `Netlik puanın ${a.score}. Hazırsan yayımla ya da biraz daha netleştir.` });
    gate.current = a.canPublish;
  }, [a.canPublish, a.score]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [i]);

  const go = (to: number) => {
    const t = Math.max(0, Math.min(order.length - 1, to));
    setDir(t >= i ? 1 : -1);
    setI(t);
  };
  const jump = (step: string) => go(order.indexOf(step as StepId));
  const next = () => go(i + 1);

  const toggleSkill = (k: string) => {
    if (skills.includes(k)) {
      setRemoved([...removed, k]);
      setExtra(extra.filter((x) => x !== k));
    } else {
      setRemoved(removed.filter((x) => x !== k));
      setExtra([...extra, k]);
    }
  };

  const convert = async () => {
    setBusy(true);
    const r = await readComplaint(raw);
    setBusy(false);
    const d = r.draft;
    // The rule extractor prefixes constraints with their kind ("Bütçe: 40.000 TL"); the kind is shown as a pill here.
    const constraints = d.canvas.constraints.map((k) => ({ ...k, text: k.text.replace(new RegExp(`^${CONSTRAINT[k.kind]}:\\s*`, 'i'), '') }));
    setReading(r);
    setTitle(d.title);
    setC({ ...d.canvas, constraints, criteria: d.canvas.criteria.length ? d.canvas.criteria : [{ id: uid('c'), text: '' }] });
    setExtra(d.source === 'model' ? d.skills : []);
    setRemoved([]);
    setDir(1);
    setI(1);
  };

  // From the reading to the first thing still missing.
  const fill = () => {
    const failing = a.checks.filter((k) => !k.ok);
    const to = order.findIndex((x) => failing.some((k) => k.field === x));
    go(to > 0 ? to : order.indexOf('title'));
  };

  const persist = () =>
    actions.saveNeed({
      id: savedId,
      orgId: org.id,
      title: title.trim() || 'Adsız ihtiyaç',
      canvas: { ...c, criteria: c.criteria.filter((k) => k.text.trim()), constraints: c.constraints.filter((k) => k.text.trim()) },
      skills,
    });

  const save = () => {
    const nid = persist();
    setSavedId(nid);
    setQuit(false);
    setDone({ kind: isLive ? 'saved' : 'draft', id: nid, fits: 0 });
    feedback(isLive ? { tone: 'good', title: 'Değişiklikler kaydedildi' } : { tone: 'good', title: 'Taslak kaydedildi', text: 'İstediğin zaman kaldığın yerden devam edebilirsin.' });
  };

  const publish = () => {
    const nid = persist();
    actions.publishNeed(nid);
    setSavedId(nid);
    const st = getState();
    const fits = rankCandidates(st, st.needs.find((n) => n.id === nid)!).filter((m) => m.score >= FIT_MIN).length;
    setDone({ kind: 'published', id: nid, fits });
    celebrate({
      title: 'İhtiyacın yayında!',
      sub: fits ? `${fits} aday uyuyor` : 'Henüz uyan aday yok; yeni kanıtlar geldikçe burada görünür.',
      cta: 'Adayları gör',
      href: `/ihtiyaclar/${nid}#adaylar`,
    });
  };

  if (done) return <Finished done={done} onResume={() => setDone(null)} />;

  const q = id !== 'dert' && id !== 'okuma' && id !== 'review' ? id : null;
  const stepChecks = q === 'title' ? [{ id: 'title', label: 'Başlık yazıldı', ok: titleOk, points: 0, blocking: false, fix: 'En az 8 karakterlik, sonucu anlatan bir başlık yaz.' }] : q ? a.checks.filter((k) => k.field === q) : [];
  const stepOk = stepChecks.length > 0 && stepChecks.every((k) => k.ok);

  return (
    <div className="mx-auto max-w-[640px]">
      <div data-coach="wiz-ilerleme" className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (dirty ? setQuit(true) : (location.href = '/ihtiyaclar'))}
          className="btn-quiet btn-sm !min-h-10 !px-2 !text-ink-3"
          aria-label="Sihirbazdan çık"
        >
          <X className="h-6 w-6" strokeWidth={3} />
        </button>
        <div className="flex-1" role="progressbar" aria-label="Adım" aria-valuemin={1} aria-valuemax={order.length} aria-valuenow={i + 1}>
          <Bar value={i / (order.length - 1)} tone="indigo" h={14} />
        </div>
        <span className="num text-[14px] font-black text-ink-3">
          {i + 1}/{order.length}
        </span>
      </div>

      <div data-coach="wiz-netlik" className="mt-4 rounded-[16px] bg-bg-2 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1 text-[15px] font-extrabold text-ink">
            Netlik puanı
            <Why title="Netlik puanı nasıl hesaplanıyor?">
              <p className="text-[16px] font-bold text-ink-2">
                Netlik puanı, ihtiyacın ne kadar net ve çözülebilir yazıldığını gösterir. İhtiyaç on maddelik bir listeden puan alır; hepsi 100 eder. Yayımlamak için hem {PUBLISH_THRESHOLD} puan hem de zorunlu üç maddenin tamamı gerekir.
              </p>
              <ul className="mt-4 space-y-2">
                {a.checks.map((k) => (
                  <li key={k.id} className="flex items-start gap-2 text-[15px] font-bold text-ink-2">
                    <StatusIcon kind={k.ok ? 'ok' : 'pending'} className="mt-1" />
                    <span className="flex-1">
                      {k.label}
                      {k.blocking && <span className="ml-2 text-[13px] font-extrabold text-indigo">zorunlu</span>}
                    </span>
                    <span className="num text-ink-3">+{k.points}</span>
                  </li>
                ))}
              </ul>
            </Why>
          </span>
          <span className={`text-[17px] font-black ${a.canPublish ? 'text-green-lip' : 'text-ink'}`}>
            <CountUp value={a.score} />
            <span className="text-ink-3">/100</span>
          </span>
        </div>
        <div className="relative mt-2.5">
          <Bar value={a.score / 100} tone={a.canPublish ? 'green' : 'indigo'} h={14} />
          <span className="absolute -top-1 h-[22px] w-[3px] -translate-x-1/2 rounded-full bg-ink" style={{ left: `${PUBLISH_THRESHOLD}%` }} aria-hidden="true" />
        </div>
        <div className="relative mt-2 h-5 text-[13px] font-extrabold">
          <span className={a.canPublish ? 'text-green-lip' : 'text-ink-2'}>{a.canPublish ? 'Yayımlamaya hazır' : gateNote(a)}</span>
          <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-ink-3" style={{ left: `${PUBLISH_THRESHOLD}%` }}>
            {PUBLISH_THRESHOLD}
          </span>
        </div>
      </div>

      <div
        data-coach="wiz-soru"
        className="mt-6 overflow-x-clip"
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing || id === 'dert' || id === 'okuma' || id === 'review') return;
          if (['BUTTON', 'A', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
          e.preventDefault();
          next();
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={rm ? 0 : dir}>
          <motion.div key={id} custom={rm ? 0 : dir} variants={SLIDE} initial="enter" animate="center" exit="exit" className="p-1">
            {id === 'dert' ? (
              <DertStep raw={raw} setRaw={setRaw} busy={busy} />
            ) : id === 'okuma' && reading ? (
              <ReadingStep reading={reading} />
            ) : id === 'review' ? (
              <Review
                org={org.name}
                c={c}
                title={title}
                skills={skills}
                a={a}
                titleOk={titleOk}
                ready={ready}
                draftLeft={isLive ? 'Değişiklikleri kaydet' : 'Taslak kaydet'}
                canMem={memory.length > 0}
                onMem={() => setMem(true)}
                onEdit={jump}
                onBack={() => go(i - 1)}
                onSave={save}
                onPublish={publish}
                live={isLive}
              />
            ) : (
              <StepView
                id={id as Q}
                ok={stepOk}
                checks={stepChecks}
                c={c}
                setC={setC}
                title={title}
                setTitle={setTitle}
                skills={skills}
                toggleSkill={toggleSkill}
                quotes={reading?.draft.extracted.includes(id as keyof Canvas) ? (reading.draft.quotes[id as keyof Canvas] ?? []) : null}
                suggestions={id === 'criteria' ? (reading?.draft.suggestions ?? []) : []}
                idea={reading?.draft.ideas[id as TextField]}
                onNext={next}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {id === 'dert' && (
        <div data-coach="wiz-devam" className="mt-6 space-y-2 p-1">
          <button
            type="button"
            className="btn-primary btn-lg btn-block relative overflow-hidden"
            disabled={raw.trim().length < 30}
            aria-busy={busy}
            onClick={busy ? undefined : convert}
          >
            {busy ? 'Niri okuyor…' : 'Taslağa dönüştür'}
            {busy && <span className="reading-fill" aria-hidden="true" />}
          </button>
          {!busy && (
            <button type="button" className="btn-quiet btn-block" onClick={() => go(order.indexOf('current'))}>
              Atla, tek tek yazayım
            </button>
          )}
        </div>
      )}
      {id === 'okuma' && (
        <div data-coach="wiz-devam" className="mt-6 space-y-2 p-1">
          <button type="button" className="btn-primary btn-lg btn-block" onClick={fill}>
            Eksikleri tamamla
          </button>
          <button type="button" className="btn-quiet btn-block" onClick={() => go(0)}>
            Metni düzelt
          </button>
        </div>
      )}
      {q && (
        <div data-coach="wiz-devam" className={`mt-8 grid gap-3 p-1 ${i > 0 ? 'grid-cols-[auto_1fr]' : ''}`}>
          {i > 0 && (
            <button type="button" className="btn-line btn-lg" onClick={() => go(i - 1)}>
              Geri
            </button>
          )}
          <button type="button" className={`${stepOk ? 'btn-green' : 'btn-primary'} btn-lg`} onClick={next}>
            {order[i + 1] === 'review' ? 'Özeti gör' : 'Devam'}
          </button>
        </div>
      )}
      {q && <p className="mt-3 hidden text-center text-[13px] font-bold text-ink-3 md:block">Enter ile devam edebilirsin. Yeni satır için Shift + Enter.</p>}

      <Sheet open={quit} onClose={() => setQuit(false)} title="Çıkmadan önce">
        <p className="text-[16px] font-bold text-ink-2">Yazdıkların henüz kaydedilmedi. Çıkarsan kaybolacak.</p>
        <div className="mt-6 space-y-3">
          <button type="button" className="btn-primary btn-block" onClick={save}>
            {isLive ? 'Değişiklikleri kaydet' : 'Taslak olarak kaydet'}
          </button>
          <button type="button" className="btn-line btn-block" onClick={() => setQuit(false)}>
            Yazmaya devam et
          </button>
          <a href="/ihtiyaclar" className="btn-quiet btn-block !text-red-lip">
            Kaydetmeden çık
          </a>
        </div>
      </Sheet>

      <Sheet open={mem} onClose={() => setMem(false)} title="Benzer ihtiyaçlar nasıl sonuçlandı?">
        <p className="text-[15px] font-bold text-ink-3">Aynı yetkinlikleri isteyen geçmiş ihtiyaçlar. Problemi yeniden çerçevelemek isteyebilirsin.</p>
        <ul className="mt-4 space-y-3">
          {memory.map((x) => (
            <li key={x.need.id} className="rounded-[16px] bg-bg-2 p-4">
              <p className="text-[16px] font-extrabold leading-snug text-ink">{x.need.title}</p>
              <p className="mt-1 text-[14px] font-bold text-ink-3">
                {x.org.name}
                {x.pilot ? ` · ${PILOT_STATUS[x.pilot.status]}` : ''}
              </p>
              {x.pilot?.closure && <p className="mt-2 text-[14px] font-semibold leading-relaxed text-ink-2">{x.pilot.closure.summary}</p>}
            </li>
          ))}
        </ul>
      </Sheet>
    </div>
  );
}

// ---------------------------------------------------------------- pieces

/** Niri with one tip in a speech bubble; the mood follows the answer. */
function Coach({ tip, mood }: { tip: string; mood: Mood }) {
  return (
    <NiriSays mood={mood} size={72} className="mt-5">
      <p className="text-[15px] font-extrabold leading-snug text-ink">{tip}</p>
    </NiriSays>
  );
}

/** One inline check. It pops once when it flips to green, not when it mounts green. */
function CheckRow({ ok, label, fix, points, must }: { ok: boolean; label: string; fix: string; points: number; must: boolean }) {
  const was = useRef(ok);
  const [pops, setPops] = useState(0);
  useEffect(() => {
    if (ok && !was.current) setPops((n) => n + 1);
    was.current = ok;
  }, [ok]);
  return (
    <li className="flex items-start gap-3">
      <span key={pops} className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors ${ok ? `bg-green-tint ${pops ? 'pop' : ''}` : 'bg-bg-3'}`}>
        {ok && <StatusIcon kind="ok" className="!align-baseline" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[15px] font-extrabold ${ok ? 'text-green-lip' : 'text-ink'}`}>
          {label}
          {must && !ok && <span className="ml-2 text-[13px] font-extrabold text-indigo">zorunlu</span>}
        </span>
        {!ok && <span className="block text-[14px] font-semibold leading-snug text-ink-3">{fix}</span>}
      </span>
      {points > 0 && <span className={`num text-[14px] font-black ${ok ? 'text-green-lip' : 'text-ink-3'}`}>+{points}</span>}
    </li>
  );
}

interface StepProps {
  id: Q;
  ok: boolean;
  checks: { id: string; label: string; ok: boolean; points: number; blocking: boolean; fix: string }[];
  c: Canvas;
  setC: (f: (p: Canvas) => Canvas) => void;
  title: string;
  setTitle: (v: string) => void;
  skills: string[];
  toggleSkill: (k: string) => void;
  /** Sentences of the kurum's text this field was read from; null when the field was not read. */
  quotes: string[] | null;
  suggestions: Suggestion[];
  /** Niri's suggestion for a field the text left empty; shown faded in the field until taken. */
  idea?: string;
  onNext: () => void;
}

function StepView({ id, ok, checks, c, setC, title, setTitle, skills, toggleSkill, quotes, suggestions, idea, onNext }: StepProps) {
  const m = META[id];
  const val = id === 'title' ? title : TEXT.includes(id) ? c[id as TextField] : '';
  const put = (v: string) => (id === 'title' ? setTitle(v) : setC((p) => ({ ...p, [id]: v })));
  // An idea needs room to be read whole, so its field wraps even where the answer is one line.
  const single = (id === 'painMetric' || id === 'decisionMaker' || id === 'title') && !idea;
  const field = useRef<HTMLTextAreaElement>(null);
  const offer = idea && !String(val).trim() ? idea : '';
  // Taking the idea puts the cursor on its first blank, so the kurum types its own figure there.
  const take = () => {
    put(offer);
    requestAnimationFrame(() => {
      const el = field.current;
      if (!el) return;
      const at = offer.indexOf('…');
      el.focus();
      if (at >= 0) el.setSelectionRange(at, at + 1);
    });
  };
  const tip = offer ? 'Metninde bunu bulamadım. Derdine göre bir öneri yazdım: kullan ya da kendi cümleni yaz.' : String(val).includes('…') ? '“…” olan yerlere kendi bilgini yaz.' : m.tip;
  // The rules copy whole sentences, so a quote that equals the answer says nothing new.
  const cited = (quotes ?? []).filter((q) => q.trim() !== String(val).trim());

  return (
    <div>
      <h1 className="text-[26px] font-black leading-tight text-ink sm:text-[30px]">{m.q}</h1>
      <p className="mt-2 text-[16px] font-bold text-ink-3">{m.hint}</p>
      <Coach tip={tip} mood={ok ? 'happy' : 'think'} />

      <div className="mt-2">
        {quotes && (val || id === 'constraints') && (
          <div className="mb-3">
            <span className="pill !py-0.5 bg-cyan-tint text-cyan-lip">Metninden doldurdum, bir kontrol et</span>
            {cited.map((q) => (
              <p key={q} className="mt-1.5 text-[14px] font-semibold leading-snug text-ink-3">
                <span className="font-extrabold">Metninde:</span> “{q}”
              </p>
            ))}
          </div>
        )}
        {id === 'criteria' ? (
          <>
            <Criteria c={c} setC={setC} onNext={onNext} />
            <Suggestions all={suggestions} c={c} setC={setC} />
          </>
        ) : id === 'constraints' ? (
          <Constraints c={c} setC={setC} onNext={onNext} />
        ) : id === 'skills' ? (
          <SkillPicker value={skills} onToggle={toggleSkill} />
        ) : single ? (
          <input className="field" value={val} onChange={(e) => put(e.target.value)} placeholder={m.ph} aria-label={m.q} autoFocus enterKeyHint="next" />
        ) : (
          <textarea
            ref={field}
            className="field min-h-[120px] resize-none"
            value={val}
            onChange={(e) => put(e.target.value)}
            placeholder={offer ? `Niri’nin önerisi: ${offer}` : m.ph}
            aria-label={m.q}
            autoFocus
            enterKeyHint="next"
          />
        )}
        {offer && (
          <button type="button" className="btn-line btn-sm mt-3" onClick={take}>
            <Check className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />
            Öneriyi kullan
          </button>
        )}
      </div>

      <ul className="mt-5 space-y-3" aria-label="Bu adımın kontrolleri">
        {checks.map((k) => (
          <CheckRow key={k.id} ok={k.ok} label={k.label} fix={k.fix} points={k.points} must={k.blocking} />
        ))}
      </ul>

      {!idea && (
        <div className="mt-5 rounded-[16px] bg-bg-2 px-4 py-3">
          <p className="text-[13px] font-extrabold text-ink-3">İyi bir örnek</p>
          <p className="mt-0.5 text-[15px] font-bold leading-snug text-ink-2">“{m.ex}”</p>
        </div>
      )}
      {ok && <span className="sr-only" role="status">Bu adım tamam.</span>}
    </div>
  );
}

function Criteria({ c, setC, onNext }: { c: Canvas; setC: StepProps['setC']; onNext: () => void }) {
  const rows = c.criteria;
  const [fresh, setFresh] = useState('');
  const add = () => {
    const nid = uid('c');
    setFresh(nid);
    setC((p) => ({ ...p, criteria: [...p.criteria, { id: nid, text: '' }] }));
  };
  return (
    <div>
      <ol className="space-y-3">
        {rows.map((k, idx) => {
          const last = idx === rows.length - 1;
          return (
            <li key={k.id} className="flex items-start gap-2">
              <span className="num mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bg-3 text-[15px] font-black text-ink-3">{idx + 1}</span>
              <GrowField
                className="field resize-none !px-3.5"
                value={k.text}
                onChange={(e) => setC((p) => ({ ...p, criteria: p.criteria.map((x) => (x.id === k.id ? { ...x, text: e.target.value } : x)) }))}
                placeholder={META.criteria.ph}
                aria-label={`${idx + 1}. başarı kriteri`}
                autoFocus={k.id === fresh || (idx === 0 && !fresh)}
                enterKeyHint="next"
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (k.text.trim() && last) add();
                  else if (!k.text.trim() && last) onNext();
                  else (e.currentTarget.closest('li')?.nextElementSibling?.querySelector('textarea') as HTMLTextAreaElement | null)?.focus();
                }}
              />
              <span className="mt-4 w-5 shrink-0" title={k.text.trim() ? (isCheckable(k.text) ? 'Ölçülebilir' : 'Ölçülebilir değil') : undefined}>
                {k.text.trim() && <StatusIcon kind={isCheckable(k.text) ? 'ok' : 'warn'} className="!h-5 !w-5" />}
              </span>
              {rows.length > 1 && (
                <button type="button" className="btn-quiet btn-sm mt-2 !min-h-9 !px-2 !text-ink-3" aria-label={`${idx + 1}. kriteri sil`} onClick={() => setC((p) => ({ ...p, criteria: p.criteria.filter((x) => x.id !== k.id) }))}>
                  <X className="h-5 w-5" strokeWidth={3} />
                </button>
              )}
            </li>
          );
        })}
      </ol>
      <button type="button" className="btn-line btn-sm mt-3" onClick={add}>
        <Plus className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />
        Kriter ekle
      </button>
    </div>
  );
}

/** One-line field that grows with its text, so a long criterion stays readable on a phone. Enter never adds a line. */
function GrowField(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 4}px`;
  };
  useLayoutEffect(fit, [props.value]);
  // The row narrows when its delete key appears; refit on width changes only, a frame later.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let w = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === w) return;
      w = el.clientWidth;
      requestAnimationFrame(fit);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <textarea ref={ref} rows={1} {...props} />;
}

/** Criteria the model proposed. They enter the canvas only when the kurum adds them. */
function Suggestions({ all, c, setC }: { all: Suggestion[]; c: Canvas; setC: StepProps['setC'] }) {
  const left = all.filter((s) => !c.criteria.some((k) => k.text.trim() === s.text));
  if (!left.length) return null;
  const add = (s: Suggestion) => setC((p) => ({ ...p, criteria: [...p.criteria.filter((k) => k.text.trim()), { id: uid('c'), text: s.text }] }));
  return (
    <div className="mt-5 rounded-[16px] bg-bg-2 p-4">
      <p className="text-[15px] font-extrabold text-ink">Önerilerim</p>
      <p className="mt-0.5 text-[14px] font-semibold leading-snug text-ink-3">Metnindeki sorundan ve sayılardan çıkardım. Eklemediğin öneri kanvasa girmez; eşiği sen belirle.</p>
      <ul className="mt-3 space-y-3">
        {left.map((s) => (
          <li key={s.text} className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold leading-snug text-ink-2">{s.text}</p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug text-ink-3">Dayanağı: “{s.basis}”</p>
            </div>
            <button type="button" className="btn-line btn-sm shrink-0" onClick={() => add(s)}>
              <Plus className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />
              Ekle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Constraints({ c, setC, onNext }: { c: Canvas; setC: StepProps['setC']; onNext: () => void }) {
  const [focus, setFocus] = useState(-1);
  const add = (kind: ConstraintKind) => {
    setFocus(c.constraints.length);
    setC((p) => ({ ...p, constraints: [...p.constraints, { kind, text: '' }] }));
  };
  return (
    <div>
      {c.constraints.length > 0 && (
        <ul className="mb-3 space-y-3">
          {c.constraints.map((k, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="pill w-[88px] shrink-0 justify-center bg-bg-3 text-ink-2">{CONSTRAINT[k.kind]}</span>
              <input
                className="field !px-3.5"
                value={k.text}
                onChange={(e) => setC((p) => ({ ...p, constraints: p.constraints.map((x, j) => (j === idx ? { ...x, text: e.target.value } : x)) }))}
                placeholder={CONSTRAINT_PH[k.kind]}
                aria-label={`${CONSTRAINT[k.kind]} kısıtı`}
                autoFocus={idx === focus}
                enterKeyHint="next"
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (k.text.trim()) onNext();
                }}
              />
              <button type="button" className="btn-quiet btn-sm !min-h-9 !px-2 !text-ink-3" aria-label={`${CONSTRAINT[k.kind]} kısıtını sil`} onClick={() => setC((p) => ({ ...p, constraints: p.constraints.filter((_, j) => j !== idx) }))}>
                <X className="h-5 w-5" strokeWidth={3} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Kısıt ekle">
        {(Object.keys(CONSTRAINT) as ConstraintKind[]).map((k) => (
          <button key={k} type="button" className="chip !py-1.5 transition-colors hover:border-indigo/40 hover:text-indigo" onClick={() => add(k)}>
            <Plus className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />
            {CONSTRAINT[k]}
          </button>
        ))}
      </div>
    </div>
  );
}

function DertStep({ raw, setRaw, busy }: { raw: string; setRaw: (v: string) => void; busy: boolean }) {
  const n = raw.trim().length;
  return (
    <div>
      <h1 className="text-[26px] font-black leading-tight text-ink sm:text-[30px]">Derdini kendi sözlerinle anlat</h1>
      <p className="mt-2 text-[16px] font-bold text-ink-3">Kurumunun çözmek istediği problemi yaz. Nasıl anlatıyorsan öyle: alanları ben doldururum, yalnız eksik kalanları sorarım.</p>
      <Coach
        tip={busy ? 'Okuyorum. Her bilgiyi hangi cümlenden aldığımı göstereceğim.' : 'Rakam, kısıt ve istediğin sonuç varsa hepsini ekle.'}
        mood={busy ? 'think' : 'wave'}
      />
      <textarea
        className="field mt-2 min-h-[168px] resize-none"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="ör. Müşterilerimiz kargolarının nerede olduğunu göremiyor, çağrı merkezimiz sürekli arıyor…"
        aria-label="Derdini anlat"
        readOnly={busy}
        autoFocus
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className={`num text-[13px] font-bold ${n >= 30 ? 'text-green-lip' : 'text-ink-3'}`}>{n >= 30 ? 'Yeterli' : `En az 30 karakter · ${n}`}</span>
        <button type="button" className="btn-quiet btn-sm" disabled={busy} onClick={() => setRaw(SAMPLE_COMPLAINT)}>
          Örnekle doldur
        </button>
      </div>
      <p className="hint">Metnin, taslak için açık kaynaklı bir yapay zekâ modeline gider; Nirengi onu saklamaz. Kişisel veri yazma.</p>
    </div>
  );
}

const REASON: Record<Rejected['reason'], string> = {
  quote: 'Dayandığı cümle metninde yok',
  number: 'Metninde geçmeyen bir sayı içeriyor',
  measurable: 'Ölçülebilir değil: eşik ya da somut teslim yok',
};

const FALLBACK: Record<NonNullable<Reading['fallback']>, string> = {
  offline: 'Modelime şu an ulaşamadım',
  quota: 'Modelimin bugünkü ücretsiz kotası doldu',
  busy: 'Modelim şu an çok yoğun',
  model: 'Modelin cevabı denetimden geçmedi',
};

const READ_ROWS: Q[] = ['current', 'pain', 'painMetric', 'outcome', 'constraints', 'decisionMaker', 'scope'];

/** What was read from the text, where each piece came from, and what was refused. Nothing to edit here. */
function ReadingStep({ reading }: { reading: Reading }) {
  const d = reading.draft;
  const model = d.source === 'model';
  const missing = READ_ROWS.filter((f) => !d.extracted.includes(f as keyof Canvas)).map((f) => LABEL[f].toLocaleLowerCase('tr-TR'));
  const n = d.extracted.length;
  const said = [
    reading.recorded
      ? `${FALLBACK[reading.fallback ?? 'offline']}, bu örnek için kayıtlı cevabını gösteriyorum. ${n} alan dolu`
      : model
        ? `${n} alanı doldurdum`
        : `${FALLBACK[reading.fallback ?? 'model']}, taslağı kurallarla çıkardım. ${n} alan doldu`,
    d.suggestions.length ? `${d.suggestions.length} başarı kriteri öneriyorum` : '',
  ]
    .filter(Boolean)
    .join(', ');
  const cap = (s: string) => s.charAt(0).toLocaleUpperCase('tr-TR') + s.slice(1);
  const ideas = READ_ROWS.filter((f) => d.ideas[f as TextField]);
  const offered = ideas.length === 1 ? `${cap(LABEL[ideas[0]].toLocaleLowerCase('tr-TR'))} için bir öneri hazırladım.` : ideas.length ? `${ideas.length} alan için öneri hazırladım.` : '';
  const tip = `${said}.${missing.length ? ` ${cap(missing.slice(0, 2).join(' ve '))} eksik; ${missing.length > 1 ? 'onları' : 'onu'} soracağım.` : ''}${offered ? ` ${offered}` : ''}`;
  // A field the model filled but the guard refused is in the text; it is asked again, not "missing from the text".
  const refused = new Set<string>(d.rejected.map((r) => r.field));

  return (
    <div>
      <h1 className="text-[26px] font-black leading-tight text-ink sm:text-[30px]">Metninden çıkardıklarım</h1>
      <p className="mt-2 text-[16px] font-bold text-ink-3">Her alanın altında hangi cümlenden aldığım yazıyor. Metninde olmayanı yazmadım.</p>
      <Coach tip={cap(tip)} mood={model ? 'happy' : 'think'} />

      <ul className="card mt-2 divide-y-2 divide-line">
        {READ_ROWS.map((f) => {
          const got = d.extracted.includes(f as keyof Canvas);
          const value = f === 'constraints' ? d.canvas.constraints.map((k) => `${CONSTRAINT[k.kind]}: ${k.text.replace(new RegExp(`^${CONSTRAINT[k.kind]}:\\s*`, 'i'), '')}`).join(' · ') : String(d.canvas[f as TextField]);
          const quotes = (d.quotes[f as keyof Canvas] ?? []).filter((q) => q.trim() !== value.trim());
          return (
            <li key={f} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-1">
                <StatusIcon kind={got ? 'ok' : 'pending'} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold text-ink-3">{LABEL[f]}</p>
                {got ? (
                  <>
                    <p className="mt-0.5 break-words text-[15px] font-bold leading-snug text-ink-2">{value}</p>
                    {quotes.map((q) => (
                      <p key={q} className="mt-1 break-words text-[13px] font-semibold leading-snug text-ink-3">
                        “{q}”
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="mt-0.5 text-[15px] font-bold text-ink-3">{refused.has(f) ? 'Doğrulayamadım, soracağım' : 'Metninde yok, soracağım'}</p>
                    {d.ideas[f as TextField] && (
                      <p className="mt-1 break-words text-[13px] font-semibold leading-snug text-ink-3">
                        <span className="font-extrabold">Önerim:</span> {d.ideas[f as TextField]}
                      </p>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {d.rejected.length > 0 && (
        <div className="mt-4 rounded-[16px] bg-bg-2 p-4">
          <p className="text-[15px] font-extrabold text-ink">Almadıklarım</p>
          <p className="mt-0.5 text-[14px] font-semibold leading-snug text-ink-3">Model bunları yazdı ama metninle doğrulayamadım, kanvasa koymadım.</p>
          <ul className="mt-2 space-y-2">
            {d.rejected.map((r, j) => (
              <li key={j} className="flex items-start gap-2">
                <StatusIcon kind="fail" className="mt-1" />
                <span className="min-w-0 flex-1 text-[14px] font-bold leading-snug text-ink-2">
                  {r.value}
                  <span className="block text-[13px] font-semibold text-ink-3">{REASON[r.reason]}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="hint">
        {model
          ? `Okuyan: ${reading.label}, açık ağırlıklı bir model${reading.recorded ? ' (bu örnek metne daha önce verdiği gerçek cevap, kayıttan)' : reading.cached ? ' (bu metin için daha önce verdiği cevap)' : ''}. Yayına model karar vermez: netlik puanını kurallar hesaplar.`
          : `Kural motoru cümleleri olduğu gibi alır, kriter önermez. Netlik puanı aynı kurallarla hesaplanır.${reading.fallback && reading.fallback !== 'model' ? ' Modelin nasıl okuduğunu görmek için geri dönüp “Örnekle doldur”u dene: o metne verdiği cevap kayıtlı.' : ''}`}
      </p>
    </div>
  );
}

interface ReviewProps {
  org: string;
  c: Canvas;
  title: string;
  skills: string[];
  a: ReturnType<typeof assessCanvas>;
  titleOk: boolean;
  ready: boolean;
  draftLeft: string;
  canMem: boolean;
  onMem: () => void;
  onEdit: (step: string) => void;
  onBack: () => void;
  onSave: () => void;
  onPublish: () => void;
  live: boolean;
}

function Review({ org, c, title, skills, a, titleOk, ready, draftLeft, canMem, onMem, onEdit, onBack, onSave, onPublish, live }: ReviewProps) {
  const fixes = [
    ...a.checks.filter((k) => !k.ok).map((k) => ({ id: k.id, step: k.field as string, label: k.label, must: k.blocking, points: k.points })),
    ...(titleOk ? [] : [{ id: 'title', step: 'title', label: 'Başlık yazıldı', must: false, points: 0 }]),
  ].sort((x, y) => Number(y.must) - Number(x.must));
  const rowOk = (f: string) => (f === 'title' ? titleOk : a.checks.filter((k) => k.field === f).every((k) => k.ok));
  const empty = <span className="text-ink-3">Henüz yazılmadı</span>;
  const crit = c.criteria.filter((k) => k.text.trim());
  const cons = c.constraints.filter((k) => k.text.trim());
  const rows: { f: Q; v: ReactNode }[] = [
    { f: 'title', v: title.trim() || empty },
    { f: 'current', v: c.current.trim() || empty },
    { f: 'pain', v: c.pain.trim() || empty },
    { f: 'painMetric', v: c.painMetric.trim() || empty },
    { f: 'outcome', v: c.outcome.trim() || empty },
    {
      f: 'criteria',
      v: crit.length ? (
        <ol className="list-decimal space-y-1 pl-5">
          {crit.map((k) => (
            <li key={k.id}>{k.text}</li>
          ))}
        </ol>
      ) : (
        empty
      ),
    },
    {
      f: 'constraints',
      v: cons.length ? (
        <ul className="space-y-1">
          {cons.map((k, j) => (
            <li key={j}>
              <b>{CONSTRAINT[k.kind]}:</b> {k.text}
            </li>
          ))}
        </ul>
      ) : (
        empty
      ),
    },
    { f: 'decisionMaker', v: c.decisionMaker.trim() || empty },
    { f: 'scope', v: c.scope.trim() || empty },
    {
      f: 'skills',
      v: skills.length ? (
        <span className="flex flex-wrap gap-1.5">
          {skills.map((k) => (
            <span key={k} className="chip">
              {skillLabel(k)}
            </span>
          ))}
        </span>
      ) : (
        empty
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-[26px] font-black leading-tight text-ink sm:text-[30px]">Her şey doğru mu?</h1>
      <p className="mt-2 flex items-center gap-2 text-[16px] font-bold text-ink-3">
        <OrgMark name={org} size={24} />
        <span>{live ? `${org} için kaydedilecek.` : `${org} adına yayımlanır.`}</span>
      </p>

      <div className="card mt-5 flex items-center gap-4 p-4">
        <Ring value={a.score} size={72} label="netlik puanı" tone={a.canPublish ? 'green' : 'indigo'} />
        <div className="min-w-0">
          <p className="text-[18px] font-black text-ink">{ready ? 'Yayına hazır' : (gateNote(a) ?? 'Neredeyse hazır')}</p>
          <p className="text-[14px] font-bold text-ink-3">Netlik puanı. Yayımlamak için en az {PUBLISH_THRESHOLD} gerekir.</p>
        </div>
      </div>

      {!ready && fixes.length > 0 && (
        <div className="mt-4 rounded-[16px] bg-bg-2 p-4">
          <p className="text-[15px] font-extrabold text-ink">Yayımlamadan önce</p>
          <ul className="mt-2 space-y-1">
            {fixes.slice(0, 5).map((k) => (
              <li key={k.id} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 text-[15px] font-bold text-ink-2">
                  {k.label}
                  {k.must && <span className="ml-2 text-[13px] font-extrabold text-indigo">zorunlu</span>}
                </span>
                {k.points > 0 && <span className="num hidden text-[14px] font-black text-ink-3 sm:inline">+{k.points}</span>}
                <button type="button" className="btn-quiet btn-sm" onClick={() => onEdit(k.step)}>
                  Düzelt
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="card mt-4 divide-y-2 divide-line">
        {rows.map((r) => (
          <li key={r.f} className="flex items-start gap-3 px-4 py-3">
            <span className="mt-1">
              <StatusIcon kind={rowOk(r.f) ? 'ok' : 'pending'} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-ink-3">{LABEL[r.f]}</p>
              <div className="mt-0.5 break-words text-[15px] font-bold leading-snug text-ink-2">{r.v}</div>
            </div>
            <button type="button" className="btn-quiet btn-sm shrink-0" onClick={() => onEdit(r.f)} aria-label={`${LABEL[r.f]} alanını düzenle`}>
              Düzenle
            </button>
          </li>
        ))}
      </ul>

      {canMem && (
        <button type="button" className="btn-quiet btn-sm mt-3" onClick={onMem}>
          Benzer ihtiyaçlar nasıl sonuçlandı?
        </button>
      )}

      <div className="mt-6 space-y-3">
        {live ? (
          <button type="button" className="btn-primary btn-lg btn-block" onClick={onSave}>
            {draftLeft}
          </button>
        ) : (
          <button type="button" className="btn-primary btn-lg btn-block" disabled={!ready} onClick={onPublish}>
            Yayımla
          </button>
        )}
        <div className={`grid gap-3 ${live ? '' : 'grid-cols-2'}`}>
          <button type="button" className="btn-line btn-block" onClick={onBack}>
            Geri
          </button>
          {!live && (
            <button type="button" className="btn-line btn-block" onClick={onSave}>
              {draftLeft}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Finished({ done, onResume }: { done: Done; onResume: () => void }) {
  const copy = {
    published: { h: 'İhtiyacın yayında', p: done.fits ? `${done.fits} aday ihtiyacına uyuyor. Adayların isimleri ilk temasa kadar gizli kalır.` : 'Henüz uyan aday yok; yeni kanıtlar geldikçe burada görünür.' },
    draft: { h: 'Taslak kaydedildi', p: 'Kaldığın yerden istediğin zaman devam edebilirsin.' },
    saved: { h: 'Değişiklikler kaydedildi', p: 'İhtiyacın güncel hâli adaylara yansıdı.' },
  }[done.kind];
  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center py-10 text-center">
      <CheckCircle size={84} className="pop" />
      <h1 className="mt-5 text-[28px] font-black text-ink">{copy.h}</h1>
      <p className="lead mt-2">{copy.p}</p>
      <div className="mt-8 flex w-full flex-col gap-3">
        {done.kind === 'published' ? (
          <>
            <a href={`/ihtiyaclar/${done.id}#adaylar`} className="btn-primary btn-lg btn-block">
              Adayları gör
            </a>
            <a href="/ihtiyaclar" className="btn-quiet btn-block">
              Tüm ihtiyaçlar
            </a>
          </>
        ) : (
          <>
            <a href={done.kind === 'saved' ? `/ihtiyaclar/${done.id}` : '/ihtiyaclar'} className="btn-primary btn-lg btn-block">
              {done.kind === 'saved' ? 'İhtiyaca dön' : 'İhtiyaçlara dön'}
            </a>
            <button type="button" className="btn-line btn-block" onClick={onResume}>
              Düzenlemeye devam et
            </button>
          </>
        )}
      </div>
    </div>
  );
}
