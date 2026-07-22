import { useState } from 'react';
import { Sprout } from 'lucide-react';
import { NavButton, MobileNavButton } from './components/NavButton';
import { LanguageDropdown } from './components/LanguageDropdown';
import { Dashboard } from './pages/Dashboard';
import { Diseases } from './pages/Diseases';
import { Sensor } from './pages/Sensor';
import { Reports } from './pages/Reports';
import { Farmers } from './pages/Farmers';
import { useT, type LangKey } from './lib/i18n';
import { type Farmer, type FieldCase } from './lib/types';

const INITIAL_FARMERS: Farmer[] = [
  { id: 1, name: 'Budi Santoso', komoditas: 'Padi Inpari 32', luas: 1.5, status: 'Fase Vegetatif' },
  { id: 2, name: 'Siti Aminah', komoditas: 'Jagung Manis', luas: 0.8, status: 'Fase Generatif' },
  { id: 3, name: 'Ahmad Dahlan', komoditas: 'Cabai Rawit', luas: 0.5, status: 'Fase Vegetatif' },
];

const INITIAL_CASES: FieldCase[] = [
  { id: 101, date: '20 Mei 2026', reporter: 'Agronomist Reza', farmer: 'Budi Santoso', crop: 'Cabai Rawit', symptom: 'Daun mengeriting ke atas, warna kuning mozaik', status: 'Menunggu Analisis' },
  { id: 102, date: '18 Mei 2026', reporter: 'Agronomist Dina', farmer: 'Siti Aminah', crop: 'Jagung Manis', symptom: 'Bercak coklat pada daun, menyebar cepat', status: 'Telah Ditangani' },
];

type TabKey = 'dashboard' | 'farmers' | 'diseases' | 'sensor' | 'reports';

export default function App() {
  const [lang, setLang] = useState<LangKey>('id');
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [farmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [fieldCases, setFieldCases] = useState<FieldCase[]>(INITIAL_CASES);

  const t = useT(lang);

  const handleAddCase = (newCase: FieldCase) => {
    setFieldCases((prev) => [newCase, ...prev]);
  };

  const navItems: { key: TabKey; icon: string; label: string }[] = [
    { key: 'dashboard', icon: 'layout-dashboard', label: t('menu_dashboard') },
    { key: 'farmers', icon: 'users', label: t('menu_farmers') },
    { key: 'diseases', icon: 'bug', label: t('menu_diseases') },
    { key: 'sensor', icon: 'radio', label: t('menu_sensor') },
    { key: 'reports', icon: 'file-text', label: t('menu_reports') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard lang={lang} t={t} />;
      case 'farmers': return <Farmers lang={lang} t={t} farmers={farmers} />;
      case 'diseases': return <Diseases lang={lang} t={t} farmers={farmers} fieldCases={fieldCases} onAddCase={handleAddCase} />;
      case 'sensor': return <Sensor lang={lang} t={t} farmers={farmers} />;
      case 'reports': return <Reports lang={lang} t={t} farmers={farmers} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-100 bg-white shadow-sm md:flex">
        <div className="flex h-[68px] items-center border-b border-gray-50 px-6">
          <div className="mr-3 rounded-lg bg-agro-600 p-2">
            <Sprout size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            RUMAH <span className="text-agro-600">NAGA</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5">
          {navItems.map((item) => (
            <NavButton
              key={item.key}
              active={activeTab === item.key}
              icon={item.icon}
              label={item.label}
              onClick={() => setActiveTab(item.key)}
            />
          ))}
        </nav>

        <div className="border-t border-gray-50 p-4">
          <div className="mb-4">
            <LanguageDropdown lang={lang} onChange={setLang} />
          </div>
          <div className="flex items-center px-1 py-1">
            <img
              src="https://ui-avatars.com/api/?name=Agronomist&background=10b981&color=fff&bold=true"
              alt="User avatar"
              className="mr-3 h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">Reza Pahlawan</p>
              <p className="text-xs text-gray-400">{t('role')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm md:hidden">
          <div className="flex items-center">
            <div className="mr-2 rounded-md bg-agro-600 p-1.5">
              <Sprout size={18} className="text-white" />
            </div>
            <h1 className="text-base font-bold text-gray-800">RUMAH NAGA</h1>
          </div>
          <div className="w-28">
            <LanguageDropdown lang={lang} onChange={setLang} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pb-20 md:p-8 md:pb-8">
          {renderContent()}
        </main>

        {/* Mobile bottom nav */}
        <nav className="absolute bottom-0 z-20 flex w-full border-t border-gray-200 bg-white px-1 py-1.5 md:hidden">
          {navItems.map((item) => (
            <MobileNavButton
              key={item.key}
              active={activeTab === item.key}
              icon={item.icon}
              label={item.label}
              onClick={() => setActiveTab(item.key)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
