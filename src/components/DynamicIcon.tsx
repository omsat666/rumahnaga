import * as LucideIcons from 'lucide-react';
import { type LucideProps } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const pascal = toPascalCase(name) as IconName;
  const IconComponent = LucideIcons[pascal] as React.ComponentType<LucideProps> | undefined;
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}
