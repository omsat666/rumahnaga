import { useState } from 'react';
import { FolderDown, FileSpreadsheet, FileText, CalendarDays, Sparkles, Loader2 } from 'lucide-react';
import { fetchGeminiText } from '../lib/gemini';
import { i18n, type LangKey } from '../lib/i18n';
import { type Farmer } from '../lib/types';

interface ReportsProps {
  lang: LangKey;
  t: (key: string) => string;
  farmers: Farmer[];
}

export function Reports({ lang, t, farmers }: ReportsProps) {
  const [weeklyPlan, setWeeklyPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    const farmersData = farmers.map((f) => `- ${f.name} (${f.komoditas}, ${f.status})`).join('\n');
    const prompt = `Sebagai asisten manajer pertanian RUMAH NAGA, buatkan Rencana Kerja Mingguan (To-Do List) ringkas untuk agronomis lapangan berdasarkan fase tanam berikut:\n${farmersData}\nBerikan 3-4 poin tugas spesifik (contoh: kunjungan, pemupukan susulan, persiapan panen). Jawab dalam ${i18n[lang].lang_name}.`;
    const result = await fetchGeminiText(prompt);
    setWeeklyPlan(result);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="flex items-center text-2xl font-bold text-gray-800">
          <FileText size={26} className="mr-3 text-agro-600" />
          {t('menu_reports')}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <FolderDown size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">{t('export_title')}</h2>
          <p className="mt-1 text-sm text-gray-500">Unduh semua data demplot dalam format pilihan Anda.</p>
          <div className="mt-6 flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700">
              <FileSpreadsheet size={15} /> Excel
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600">
              <FileText size={15} /> PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-agro-100 p-2 text-agro-600">
              <CalendarDays size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">{t('plan_title')}</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">{t('plan_desc')}</p>

          {weeklyPlan && (
            <div className="mb-4 animate-fade-in rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap shadow-sm">
              {weeklyPlan}
            </div>
          )}

          <button
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-agro-600 py-3 font-bold text-white shadow-md transition-all hover:bg-agro-700 disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isLoading ? t('plan_loading') : t('plan_btn')}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Ringkasan Data Petani</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="pb-3 pr-6 font-medium">{t('tbl_name')}</th>
                <th className="pb-3 pr-6 font-medium">{t('tbl_commodity')}</th>
                <th className="pb-3 pr-6 font-medium">{t('tbl_area')}</th>
                <th className="pb-3 font-medium">{t('tbl_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {farmers.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/50">
                  <td className="py-3 pr-6 font-medium text-gray-800">{f.name}</td>
                  <td className="py-3 pr-6 text-gray-600">{f.komoditas}</td>
                  <td className="py-3 pr-6 text-gray-600">{f.luas} Ha</td>
                  <td className="py-3">
                    <span className="rounded-full bg-agro-50 px-2.5 py-1 text-xs font-medium text-agro-700">{f.status}</span>
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
