import { UserPlus } from 'lucide-react';
import { type LangKey } from '../lib/i18n';
import { type Farmer } from '../lib/types';

interface FarmersProps {
  t: (key: string) => string;
  lang: LangKey;
  farmers: Farmer[];
}

const STATUS_COLORS: Record<string, string> = {
  'Fase Vegetatif': 'bg-blue-50 text-blue-700',
  'Fase Generatif': 'bg-amber-50 text-amber-700',
  'Fase Panen': 'bg-agro-50 text-agro-700',
};

export function Farmers({ t, farmers }: FarmersProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('farmer_title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('farmer_subtitle')}</p>
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-xl bg-agro-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-agro-700">
          <UserPlus size={16} /> {t('farmer_add')}
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">{t('tbl_name')}</th>
                <th className="px-6 py-4 font-medium">{t('tbl_commodity')}</th>
                <th className="px-6 py-4 font-medium">{t('tbl_area')}</th>
                <th className="px-6 py-4 font-medium">{t('tbl_status')}</th>
                <th className="px-6 py-4 text-right font-medium">{t('tbl_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {farmers.map((f) => (
                <tr key={f.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-agro-100 text-sm font-bold text-agro-700">
                        {f.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{f.komoditas}</td>
                  <td className="px-6 py-4 text-gray-600">{f.luas} Ha</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[f.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg bg-agro-50 px-3 py-1.5 text-sm font-medium text-agro-600 transition-colors hover:bg-agro-100">
                      {t('btn_analysis')}
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
