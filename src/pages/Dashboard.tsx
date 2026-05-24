import { useState } from 'react';
import { Users, Map, Wheat, Sparkles, Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchGeminiText } from '../lib/gemini';
import { i18n, type LangKey } from '../lib/i18n';

interface DashboardProps {
  lang: LangKey;
  t: (key: string) => string;
}

export function Dashboard({ lang, t }: DashboardProps) {
  const [aiReport, setAiReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    const prompt = `Sebagai konsultan pertanian "RUMAH NAGA", buatkan ringkasan rekomendasi aksi yang SINGKAT (maksimal 4 poin). Total Petani 124, Lahan 45 Ha, Panen bulan ini 12 Ton. Berikan saran operasional dan jawab seluruhnya menggunakan ${i18n[lang].lang_name}.`;
    const result = await fetchGeminiText(prompt);
    setAiReport(result);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">{t('dash_title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('dash_subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon={<Users size={26} />} color="blue" label={t('stat_farmers')} value="124" />
        <StatCard icon={<Map size={26} />} color="green" label={t('stat_area')} value="45 Ha" />
        <StatCard icon={<Wheat size={26} />} color="amber" label={t('stat_harvest')} value="12 Ton" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
            <TrendingUp size={16} className="mr-2 text-agro-600" /> Aktivitas Terkini
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { icon: <CheckCircle size={14} className="text-agro-500" />, text: 'Pemupukan lahan Budi selesai', time: '2j lalu' },
              { icon: <AlertTriangle size={14} className="text-amber-500" />, text: 'Kasus baru pada Siti Aminah', time: '5j lalu' },
              { icon: <CheckCircle size={14} className="text-agro-500" />, text: 'Data sensor Ahmad diperbarui', time: '1h lalu' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600">
                <span className="mt-0.5">{item.icon}</span>
                <span className="flex-1">{item.text}</span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-agro-100 bg-gradient-to-br from-agro-50 to-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center text-sm font-semibold text-agro-900">
              <Sparkles size={16} className="mr-2 text-agro-600" />
              AI Insight
            </h3>
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-agro-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-agro-700 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              {isLoading ? t('ai_loading') : t('ai_btn')}
            </button>
          </div>
          {aiReport ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{aiReport}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Klik tombol untuk mendapatkan rekomendasi AI terbaru berdasarkan data demplot Anda.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Status Komoditas</h3>
        <div className="space-y-3">
          {[
            { name: 'Padi Inpari 32', progress: 75, color: 'bg-agro-500', phase: 'Fase Vegetatif' },
            { name: 'Jagung Manis', progress: 55, color: 'bg-amber-500', phase: 'Fase Generatif' },
            { name: 'Cabai Rawit', progress: 30, color: 'bg-red-500', phase: 'Fase Vegetatif' },
          ].map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex justify-between text-xs text-gray-600">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-400">{item.phase} — {item.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, label, value }: { icon: React.ReactNode; color: 'blue' | 'green' | 'amber'; label: string; value: string }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-agro-100 text-agro-600',
    amber: 'bg-amber-100 text-amber-600',
  };
  return (
    <div className="flex items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className={`mr-5 rounded-full p-4 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
