// Canonical skill vocabulary. Needs and evidence both speak these keys, so a
// match is a set comparison rather than fuzzy keyword overlap. It spans every field a
// young person can show work in, not only software; areas group the keys on screen.

export type SkillArea = 'yazilim' | 'veri' | 'tasarim' | 'medya' | 'is';

export const AREAS: { id: SkillArea; label: string }[] = [
  { id: 'yazilim', label: 'Yazılım' },
  { id: 'veri', label: 'Veri ve yapay zekâ' },
  { id: 'tasarim', label: 'Tasarım ve sanat' },
  { id: 'medya', label: 'İçerik ve medya' },
  { id: 'is', label: 'İş ve topluluk' },
];

export interface SkillDef {
  label: string;
  area: SkillArea;
  aliases: string[];
}

export const SKILLS: Record<string, SkillDef> = {
  go: { label: 'Go', area: 'yazilim', aliases: ['go', 'golang'] },
  rust: { label: 'Rust', area: 'yazilim', aliases: ['rust', 'cargo'] },
  python: { label: 'Python', area: 'yazilim', aliases: ['python', 'pandas', 'fastapi', 'django'] },
  typescript: { label: 'TypeScript', area: 'yazilim', aliases: ['typescript', 'ts', 'javascript', 'js'] },
  react: { label: 'React', area: 'yazilim', aliases: ['react', 'next.js', 'nextjs', 'frontend', 'ön yüz', 'web arayüz', 'web panel', 'web uygulama'] },
  node: { label: 'Node.js', area: 'yazilim', aliases: ['node', 'node.js', 'nodejs', 'express'] },
  flutter: { label: 'Flutter', area: 'yazilim', aliases: ['flutter', 'dart', 'mobil uygulama'] },
  kotlin: { label: 'Kotlin / Android', area: 'yazilim', aliases: ['kotlin', 'android'] },
  cpp: { label: 'C++', area: 'yazilim', aliases: ['c++', 'cpp', 'qt'] },
  unity: { label: 'Unity', area: 'yazilim', aliases: ['unity', 'unity3d', 'c#', 'oyun motoru'] },
  shader: { label: 'Shader / GPU', area: 'yazilim', aliases: ['shader', 'hlsl', 'glsl', 'urp', 'gpu', 'shader graph'] },
  nlp: { label: 'Türkçe NLP', area: 'veri', aliases: ['nlp', 'doğal dil', 'dil işleme', 'metin sınıflandırma', 'duygu analizi', 'şikâyet', 'şikayet'] },
  ml: { label: 'Makine öğrenmesi', area: 'veri', aliases: ['makine öğrenmesi', 'ml', 'pytorch', 'tensorflow', 'model', 'yapay zeka', 'yapay zekâ'] },
  data: { label: 'Veri analizi', area: 'veri', aliases: ['veri analizi', 'sql', 'analitik', 'dashboard', 'raporlama'] },
  postgres: { label: 'PostgreSQL', area: 'yazilim', aliases: ['postgres', 'postgresql', 'veritabanı'] },
  distributed: { label: 'Dağıtık sistemler', area: 'yazilim', aliases: ['dağıtık', 'yüksek trafik', 'ölçeklen', 'cache', 'önbellek', 'dosya dağıtım', 'cdn', 'kuyruk'] },
  devops: { label: 'DevOps', area: 'yazilim', aliases: ['kubernetes', 'docker', 'devops', 'ci/cd', 'k8s'] },
  api: { label: 'API tasarımı', area: 'yazilim', aliases: ['api', 'rest', 'grpc', 'openapi', 'entegrasyon'] },
  realtime: { label: 'Gerçek zamanlı', area: 'yazilim', aliases: ['websocket', 'gerçek zamanlı', 'canlı', 'anlık', 'mqtt'] },
  maps: { label: 'Harita / CBS', area: 'veri', aliases: ['harita', 'leaflet', 'mapbox', 'gis', 'cbs', 'konum', 'gps'] },
  iot: { label: 'IoT / gömülü', area: 'yazilim', aliases: ['iot', 'sensör', 'esp32', 'gömülü', 'arduino', 'lora'] },
  optimization: { label: 'Optimizasyon', area: 'veri', aliases: ['optimizasyon', 'rota', 'vrp', 'algoritma', 'çizelgeleme'] },
  perf: { label: 'Performans', area: 'yazilim', aliases: ['performans', 'fps', 'hız', 'gecikme', 'lighthouse'] },
  uiux: { label: 'UI/UX tasarımı', area: 'tasarim', aliases: ['ui', 'ux', 'arayüz tasarım', 'kullanıcı deneyimi', 'tasarım sistemi'] },
  figma: { label: 'Figma', area: 'tasarim', aliases: ['figma', 'prototip'] },
  a11y: { label: 'Erişilebilirlik', area: 'tasarim', aliases: ['erişilebilirlik', 'wcag', 'a11y', 'ekran okuyucu'] },
  brand: { label: 'Marka kimliği', area: 'tasarim', aliases: ['marka', 'logo', 'kimlik tasarımı', 'ambalaj'] },
  visual: { label: 'Görsel üretim', area: 'tasarim', aliases: ['fotoğraf', 'illüstrasyon', '3d', 'render', 'görsel'] },
  illustration: { label: 'İllüstrasyon', area: 'tasarim', aliases: ['illüstrasyon', 'çizim', 'karakter tasarımı', 'konsept sanat', 'concept art'] },
  model3d: { label: '3B modelleme', area: 'tasarim', aliases: ['3b', 'blender', 'zbrush', '3d modelleme', 'sketchfab'] },
  animation: { label: 'Animasyon', area: 'tasarim', aliases: ['animasyon', 'motion graphics', 'hareketli grafik', 'after effects'] },
  industrial: { label: 'Endüstriyel tasarım', area: 'tasarim', aliases: ['endüstriyel tasarım', 'ürün tasarımı', 'solidworks'] },
  architecture: { label: 'Mimari çizim', area: 'tasarim', aliases: ['mimari proje', 'mimarlık', 'iç mimari', 'autocad', 'revit', 'sketchup'] },
  fashion: { label: 'Moda ve tekstil', area: 'tasarim', aliases: ['moda tasarımı', 'tekstil tasarımı', 'desen tasarımı', 'giyim tasarımı'] },
  docs: { label: 'Teknik yazım', area: 'medya', aliases: ['dokümantasyon', 'teknik yazım', 'kılavuz', 'readme'] },
  writing: { label: 'İçerik yazarlığı', area: 'medya', aliases: ['içerik yazarlığı', 'metin yazarlığı', 'copywriting', 'blog', 'senaryo yazımı', 'bülten'] },
  translation: { label: 'Çeviri', area: 'medya', aliases: ['çeviri', 'tercüme', 'altyazı', 'yerelleştirme'] },
  video: { label: 'Video kurgu', area: 'medya', aliases: ['video', 'premiere', 'davinci'] },
  photo: { label: 'Fotoğraf', area: 'medya', aliases: ['fotoğraf', 'ürün çekimi', 'lightroom'] },
  audio: { label: 'Ses ve müzik', area: 'medya', aliases: ['müzik', 'ses tasarımı', 'seslendirme', 'podcast', 'beste'] },
  social: { label: 'Sosyal medya', area: 'medya', aliases: ['sosyal medya', 'instagram', 'tiktok', 'reels', 'topluluk yönetimi'] },
  product: { label: 'Ürün yönetimi', area: 'is', aliases: ['ürün yönetimi', 'yol haritası', 'pm', 'kullanıcı araştırması'] },
  marketing: { label: 'Dijital pazarlama', area: 'is', aliases: ['pazarlama', 'seo', 'reklam', 'kampanya', 'google ads'] },
  finance: { label: 'Muhasebe ve finans', area: 'is', aliases: ['muhasebe', 'finans', 'maliyet analizi', 'ön muhasebe'] },
  research: { label: 'Araştırma', area: 'is', aliases: ['saha araştırması', 'anket', 'pazar araştırması', 'literatür taraması', 'akademik yayın'] },
  teaching: { label: 'Eğitim içeriği', area: 'is', aliases: ['ders içeriği', 'eğitim materyali', 'müfredat', 'eğitim videosu'] },
  event: { label: 'Etkinlik yönetimi', area: 'is', aliases: ['etkinlik yönetimi', 'etkinlik organizasyonu', 'fuar'] },
};

/** Skill keys of one area, in vocabulary order. */
export const skillsIn = (area: SkillArea) => Object.keys(SKILLS).filter((k) => SKILLS[k].area === area);

export const skillLabel = (key: string) => SKILLS[key]?.label ?? key;

/** Turkish-aware lowercase + whitespace collapse. */
export const norm = (s: string) => s.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();

/** Extract canonical skill keys mentioned anywhere in free text. */
export function skillsInText(text: string): string[] {
  const t = ` ${norm(text)} `;
  const found: string[] = [];
  for (const [key, def] of Object.entries(SKILLS)) {
    const hit = def.aliases.some((a) => {
      const alias = norm(a);
      // Short aliases (go, ts, ml, ui…) must stand alone to avoid false hits.
      if (alias.length <= 3) return new RegExp(`[^a-zçğıöşü0-9]${escape(alias)}[^a-zçğıöşü0-9]`).test(t);
      return t.includes(alias);
    });
    if (hit) found.push(key);
  }
  return found;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** GitHub primary language → skill keys. */
export const LANGUAGE_SKILLS: Record<string, string[]> = {
  Go: ['go'],
  Rust: ['rust'],
  Python: ['python'],
  TypeScript: ['typescript'],
  JavaScript: ['typescript'],
  Dart: ['flutter'],
  Kotlin: ['kotlin'],
  Java: ['kotlin'],
  'C++': ['cpp'],
  C: ['cpp', 'iot'],
  'C#': ['unity'],
  ShaderLab: ['shader'],
  HLSL: ['shader'],
  GLSL: ['shader'],
  QML: ['cpp', 'uiux'],
  Astro: ['react', 'typescript'],
  Vue: ['react', 'typescript'],
  Svelte: ['react', 'typescript'],
  Jupyter: ['python', 'data'],
  'Jupyter Notebook': ['python', 'data'],
  Swift: ['flutter'],
  HTML: ['react'],
  CSS: ['uiux'],
  Shell: ['devops'],
  Dockerfile: ['devops'],
};
