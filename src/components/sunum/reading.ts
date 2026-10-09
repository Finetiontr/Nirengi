// A real answer from Niri's draft model (Gemma 4 26B on Workers AI) for SAMPLE_COMPLAINT,
// kept as recorded. The deck runs it through the same guard the product uses
// (engine/ground.ts), so the AI slides show computed results, not drawn ones;
// tests/ground.test.ts bends it the ways a model fails.

export const SAMPLE_READING = {
  title: 'Canlı araç takip web paneli kurmak',
  current: { quote: 'Araçlarımızda GPS cihazı var ama konum verisi günde bir kez Excel raporuna dönüşüyor.', value: 'GPS cihazlarından gelen veriler günde bir kez Excel raporu olarak alınıyor.' },
  pain: { quote: 'Kurumsal müşterilerimiz kargolarının nerede olduğunu göremiyor ve sürekli çağrı merkezimizi arıyor.', value: 'Kurumsal müşterilerin kargo konumunu görememesi ve çağrı merkezini araması' },
  painMetric: { quote: 'Çağrı merkezine gelen aramaların %40’ı “kargom nerede” sorusu, ayda yaklaşık 6.000 arama.', value: "Ayda 6.000 arama, aramaların %40'ı" },
  outcome: { quote: 'Müşterilerimize araç konumlarını canlı haritada gösteren bir web paneli istiyoruz.', value: 'Araç konumlarını canlı haritada gösteren bir web paneli' },
  decisionMaker: { quote: 'Aşamaları operasyon direktörümüz onaylayacak.', value: 'Operasyon direktörü' },
  scope: { quote: 'İlk denemeyi yalnız Tuzla deposundan çıkan araçlar ve onların kurumsal müşterileriyle yapmak istiyoruz.', value: 'Tuzla deposundan çıkan araçlar ve kurumsal müşterileri' },
  constraints: [
    { kind: 'butce', quote: 'Bütçemiz 40.000 TL', text: '40.000 TL' },
    { kind: 'sure', quote: '6 hafta içinde sonuç görmek istiyoruz.', text: '6 hafta içinde sonuç' },
    { kind: 'mevzuat', quote: 'Konum verisi KVKK kapsamında; müşteri adresleri paylaşılmayacak.', text: 'KVKK kapsamında' },
  ],
  criteria: [
    { basis: 'Çağrı merkezine gelen aramaların %40’ı “kargom nerede” sorusu, ayda yaklaşık 6.000 arama.', text: '“kargom nerede” aramalarının %20 oranında azalması' },
    { basis: 'Müşterilerimize araç konumlarını canlı haritada gösteren bir web paneli istiyoruz.', text: 'Canlı konum verisini gösteren web panelinin teslim edilmesi' },
  ],
  skills: ['react', 'node', 'api', 'maps', 'realtime'],
};

/** The model's answer with one invented field, the way the guard's own test bends it. */
export const INVENTED_DECIDER = { ...SAMPLE_READING, decisionMaker: { value: 'Genel Müdür', quote: 'Projeyi Genel Müdür onaylar.' } };
