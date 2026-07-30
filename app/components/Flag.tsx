import { DE, ES, FR, GB } from "country-flag-icons/react/3x2";

// Only the countries this site actually renders — importing the full set would
// pull every flag in the package into the bundle.
const FLAGS = { de: DE, es: ES, fr: FR, gb: GB } as const;

export type FlagCode = keyof typeof FLAGS;

interface FlagProps {
  code: string;
  title?: string;
  className?: string;
}

export const Flag: React.FC<FlagProps> = ({
  code,
  title,
  className = "inline-block h-3 w-auto rounded-xs align-baseline",
}) => {
  const Icon = FLAGS[code.toLowerCase() as FlagCode];
  if (!Icon) return null;

  return <Icon title={title ?? code.toUpperCase()} className={className} />;
};

export default Flag;
