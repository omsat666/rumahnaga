import { type LangKey } from '../lib/i18n';

interface LanguageDropdownProps {
  lang: LangKey;
  onChange: (lang: LangKey) => void;
}

export function LanguageDropdown({ lang, onChange }: LanguageDropdownProps) {
  return (
    <select
      value={lang}
      onChange={(e) => onChange(e.target.value as LangKey)}
      className="block w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700 outline-none focus:border-agro-500 focus:ring-agro-500"
    >
      <option value="id">🇮🇩 Indonesia</option>
      <option value="en">🇬🇧 English</option>
      <option value="jv">ꦗꦮ Basa Jawa</option>
      <option value="zh">🇨🇳 中文</option>
    </select>
  );
}
