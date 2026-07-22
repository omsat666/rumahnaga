import { useState } from 'react';
import { AlertTriangle, ArrowLeft, Sparkles, Loader2, FileText } from 'lucide-react';
import { fetchGeminiText } from '../lib/gemini';
import { i18n, type LangKey } from '../lib/i18n';
import { type Farmer, type FieldCase } from '../lib/types';

interface DiseasesProps {
  lang: LangKey;
  t: (key: string) => string;
  farmers: Farmer[];
  fieldCases: FieldCase[];
  onAddCase: (c: FieldCase) => void;
}

type ViewMode = 'list' | 'add-case' | 'case-detail';

export function Diseases({ lang, t, farmers, fieldCases, onAddCase }: DiseasesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCase, setSelectedCase] = useState<FieldCase | null>(null);
  const [newSymptom, setNewSymptom] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id ?? 1);
  const [aiPrediction, setAiPrediction] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [kiaiResponse, setKiaiResponse] = useState('');
  const [isKiaiLoading, setIsKiaiLoading] = useState(false);

  const handlePredictSymptom = async () => {
    if (!newSymptom) return;
    setIsPredicting(true);
    const prompt = `Sebagai ahli fitopatologi RUMAH NAGA, berikan prediksi penyakit singkat (1 kalimat) dan 1 kemungkinan patogen berdasarkan gejala berikut: "${newSymptom}". Jawab seluruhnya menggunakan ${i18n[lang].lang_name}.`;
    const result = await fetchGeminiText(prompt);
    setAiPrediction(result);
    setIsPredicting(false);
  };

  const handleAskKiai = async (kasus: FieldCase) => {
    setIsKiaiLoading(true);
    const prompt = `Berperanlah sebagai "Kiai Nugroho", seorang sesepuh ahli agronomi. Berikan "Resep Penyelesaian" untuk mengatasi gejala ${kasus.symptom} pada ${kasus.crop}. Jawab dengan sapaan hangat, diagnosis awal, resep organik/kimia, dan nasihat penutup. Jawab menggunakan ${i18n[lang].lang_name}.`;
    const result = await fetchGeminiText(prompt);
    setKiaiResponse(result);
    setIsKiaiLoading(false);
  };

  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = farmers.find((f) => f.id === selectedFarmerId);
    if (!farmer) return;
    onAddCase({
      id: Date.now(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      reporter: 'Agronomist',
      farmer: farmer.name,
      crop: farmer.komoditas,
      symptom: newSymptom,
      status: 'Menunggu Analisis',
    });
    setNewSymptom('');
    setAiPrediction('');
    setViewMode('list');
  };

  if (viewMode === 'add-case') {
    return (
      <div className="animate-fade-in mx-auto max-w-2xl">
        <button
          onClick={() => { setViewMode('list'); setAiPrediction(''); setNewSymptom(''); }}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft size={16} /> {t('back')}
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-800">{t('add_case')}</h2>
          <p className="mt-1 border-b border-gray-100 pb-5 text-sm text-gray-500">{t('add_case_desc')}</p>

          <form onSubmit={handleSubmitCase} className="mt-5 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('farmer_select')}</label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-500"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} — {f.komoditas}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{t('tbl_symptom')}</label>
              <textarea
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                rows={3}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-500"
                placeholder="Contoh: Daun menguning dan berlubang, ditemukan ulat..."
              />

              <button
                type="button"
                onClick={handlePredictSymptom}
                disabled={isPredicting || !newSymptom}
                className="mt-3 flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 disabled:opacity-50"
              >
                {isPredicting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isPredicting ? t('predict_loading') : t('predict_btn')}
              </button>

              {aiPrediction && (
                <div className="mt-3 animate-fade-in rounded-xl border border-teal-100 bg-teal-50/70 p-4 text-sm leading-relaxed text-teal-900 shadow-sm">
                  <strong>{t('ai_guess')}</strong>
                  <br />
                  {aiPrediction}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-xl bg-agro-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-agro-700"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (viewMode === 'case-detail' && selectedCase) {
    return (
      <div className="animate-fade-in mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => { setViewMode('list'); setKiaiResponse(''); }}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft size={16} /> {t('back')}
        </button>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedCase.farmer}</h2>
                <p className="mt-0.5 text-sm text-gray-500">{selectedCase.crop} &bull; {selectedCase.date}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedCase.status === 'Telah Ditangani'
                  ? 'bg-agro-100 text-agro-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedCase.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-relaxed text-red-800">
              "{selectedCase.symptom}"
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:p-8">
                <div>
                  <h3 className="mb-2 flex items-center text-lg font-bold">
                    <Sparkles size={22} className="mr-2 text-amber-300" />
                    {t('kiai_title')}
                  </h3>
                  <p className="max-w-md text-sm text-emerald-100">{t('kiai_desc')}</p>
                </div>
                <button
                  onClick={() => handleAskKiai(selectedCase)}
                  disabled={isKiaiLoading}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold text-emerald-900 shadow-md transition-colors hover:bg-amber-300 disabled:opacity-80"
                >
                  {isKiaiLoading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                  {t('kiai_btn')}
                </button>
              </div>

              {kiaiResponse && (
                <div className="mt-6 animate-fade-in rounded-2xl border-2 border-amber-200 bg-[#fdfbf7] p-6 shadow-sm">
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-800">{kiaiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('disease_title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('disease_subtitle')}</p>
        </div>
        <button
          onClick={() => setViewMode('add-case')}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-600"
        >
          <AlertTriangle size={16} /> {t('add_case')}
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">{t('tbl_date')}</th>
                <th className="px-6 py-4 font-medium">{t('tbl_name')}</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">{t('tbl_symptom')}</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">{t('tbl_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {fieldCases.map((kasus) => (
                <tr key={kasus.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500">{kasus.date}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{kasus.farmer}</p>
                    <p className="text-xs text-gray-400">{kasus.crop}</p>
                  </td>
                  <td className="hidden px-6 py-4 text-gray-600 md:table-cell max-w-xs truncate">{kasus.symptom}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      kasus.status === 'Telah Ditangani'
                        ? 'bg-agro-100 text-agro-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {kasus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setSelectedCase(kasus); setViewMode('case-detail'); }}
                      className="rounded-lg bg-agro-50 px-3 py-1.5 text-sm font-medium text-agro-600 transition-colors hover:bg-agro-100"
                    >
                      {t('btn_detail')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
