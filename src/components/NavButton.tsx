import { DynamicIcon } from './DynamicIcon';

interface NavButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

export function NavButton({ active, icon, label, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-agro-500 text-white shadow-md'
          : 'text-gray-500 hover:bg-agro-50 hover:text-agro-600'
      }`}
    >
      <DynamicIcon name={icon} size={18} className="mr-3 flex-shrink-0" />
      {label}
    </button>
  );
}

interface MobileNavButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

export function MobileNavButton({ active, icon, label, onClick }: MobileNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center rounded-lg p-2 transition-colors ${
        active ? 'text-agro-600' : 'text-gray-400 hover:text-agro-500'
      }`}
    >
      <DynamicIcon name={icon} size={22} />
      <span className="mt-1 w-full truncate text-center text-[10px] font-medium">{label}</span>
    </button>
  );
}
