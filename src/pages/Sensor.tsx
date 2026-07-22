import { useState } from 'react';
import { Bluetooth, Sparkles, Loader2 } from 'lucide-react';
import { fetchGeminiText } from '../lib/gemini';
import { i18n, type LangKey } from '../lib/i18n';
import { type Farmer, type SensorData } from '../lib/types';

interface SensorProps {
  lang: LangKey;
  t: (key: string) => string;
  farmers: Farmer[];
}

export function Sensor({ lang, t, farmers }: SensorProps) {
  const [farmerId, setFarmerId] = useState(farmers[0]?.id ?? 1);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setSensorData(null);
    setAiReport('');
    setTimeout(() => {
      setSensorData({
        n: Math.floor(Math.random() * 60) + 40,
        p: Math.floor(Math.random() * 40) + 20,
        k: Math.floor(Math.random() * 50) + 30,
        humidity: Math.floor(Math.random() * 40) + 45,
        temp: Math.floor(Math.random() * 12) + 24,
        ph: (Math.random() * 2 + 5.0).toFixed(1),
        fertility: ['Kurang', 'Sedang', 'Optimal'][Math.floor(Math.random() * 3)],
      });
      setIsScanning(false);
    }, 2500);
  };

  const handleAiAnalysis = async () => {
    if (!sensorData) return;
    setIsAiLoading(true);
    const selected = farmers.find((f) => f.id === farmerId);
    const prompt = `Berperanlah sebagai "Bang Naga", ahli agronomi. Buatkan insight yang SANGAT SINGKAT dan TO THE POINT untuk lahan ${selected?.name} (Tanaman: ${selected?.komoditas}) berdasarkan data sensor ini:
N(${sensorData.n}), P(${sensorData.p}), K(${sensorData.k}), pH(${sensorData.ph}), Suhu(${sensorData.temp}°C), Lembap(${sensorData.humidity}%), Kesuburan(${sensorData.fertility}).

Wajib format jawaban dalam 3 poin singkat berikut:
1. Hasil: (Satu kalimat merangkum status nutrisi/tanah)
2. Panduan Naga Biru: (Cara aplikasi terbaik sesuai kondisi suhu/lembap saat ini)
3. Saran: (Saran mendesak saja. Jika normal, beri apresiasi).

PENTING: Jangan bertele-tele. Jawab seluruhnya menggunakan ${i18n[lang].lang_name}.`;
    const result = await fetchGeminiText(prompt);
    setAiReport(result);
    setIsAiLoading(false);
  };

  const selected = farmers.find((f) => f.id === farmerId);
  let nagaBiruBottles = 0, dosisPerTank = 0, tankCount = 0;
  if (sensorData && selected) {
    const deficitN = Math.max(0, 100 - sensorData.n);
    const deficitP = Math.max(0, 60 - sensorData.p);
    const deficitK = Math.max(0, 70 - sensorData.k);
    const luasAre = selected.luas * 100;
    const maxDefisit = Math.max(deficitN, deficitP, deficitK);
    nagaBiruBottles = Math.max(1, Math.ceil((maxDefisit / 15) * (luasAre / 20)));
    dosisPerTank = maxDefisit > 40 ? 70 : 50;
    tankCount = Math.ceil(luasAre / 5);
  }

  const fertilityColor = sensorData
    ? sensorData.fertility === 'Optimal' ? 'text-agro-500' : sensorData.fertility === 'Sedang' ? 'text-amber-500' : 'text-red-500'
    : '';

  return (
    <div className="animate-fade-in mx-auto max-w-4xl space-y-6 pb-10">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('sensor_title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('sensor_subtitle')}</p>
      </header>

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <select
          value={farmerId}
          onChange={(e) => { setFarmerId(Number(e.target.value)); setSensorData(null); setAiReport(''); }}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-agro-500"
        >
          {farmers.map((f) => (
            <option key={f.id} value={f.id}>{f.name} — {f.komoditas} ({f.luas} Ha)</option>
          ))}
        </select>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center justify-center gap-2 rounded-full bg-agro-600 px-8 py-3 font-bold text-white transition-colors hover:bg-agro-700 disabled:opacity-70"
        >
          {isScanning ? (
            <><Loader2 size={18} className="animate-spin" /> {t('sensor_scanning')}</>
          ) : (
            <><Bluetooth size={18} /> {t('sensor_scan_btn')}</>
          )}
        </button>
      </div>

      {sensorData && (
        <div className="animate-fade-in space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SensorCard label="Nitrogen (N)" value={`${sensorData.n} mg/kg`} />
            <SensorCard label="Fosfor (P)" value={`${sensorData.p} mg/kg`} />
            <SensorCard label="Kalium (K)" value={`${sensorData.k} mg/kg`} />
            <SensorCard label="pH Tanah" value={sensorData.ph} />
            <SensorCard label="Suhu" value={`${sensorData.temp}°C`} />
            <SensorCard label="Kelembapan" value={`${sensorData.humidity}%`} />
            <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Kesuburan Tanah</p>
              <p className={`mt-1 text-lg font-bold ${fertilityColor}`}>{sensorData.fertility}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl">
            <div className="p-6 md:p-8">
              <h2 className="mb-6 text-xl font-bold">{t('calc_title')}</h2>
              <div className="grid grid-cols-3 gap-4 rounded-xl bg-white/10 p-5">
                <CalcCard value={nagaBiruBottles} label="Botol" />
                <CalcCard value={dosisPerTank} label="ml / Tangki" />
                <CalcCard value={tankCount} label="Tangki (Sesi)" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-6 py-4">
              <p className="text-sm text-slate-300">Dosis berdasarkan defisit nutrisi & luas lahan</p>
              <button
                onClick={handleAiAnalysis}
                disabled={isAiLoading}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-slate-900 transition-colors hover:bg-amber-400 disabled:opacity-70"
              >
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Tanya Bang Naga
              </button>
            </div>
          </div>

          {aiReport && (
            <div className="animate-fade-in rounded-2xl border border-agro-100 bg-agro-50/50 p-6 shadow-sm">
              <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-800">{aiReport}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SensorCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}

function CalcCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold md:text-5xl">{value}</p>
      <p className="mt-1 text-xs text-slate-300">{label}</p>
    </div>
  );
}
