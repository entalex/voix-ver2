import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BiText } from "@/context/LanguageContext";

interface BilingualFieldProps {
  label: string;
  value: BiText;
  onChange: (val: BiText) => void;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

const BilingualField = ({ label, value, onChange, maxLength, multiline, rows = 3, placeholder }: BilingualFieldProps) => {
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-muted-foreground font-medium">🇬🇧 English</span>
          <Component
            value={value.en}
            onChange={(e: any) => onChange({ ...value, en: e.target.value })}
            maxLength={maxLength}
            {...(multiline ? { rows } : {})}
            className="mt-1"
            placeholder={placeholder ? `${placeholder} (EN)` : undefined}
          />
        </div>
        <div>
          <span className="text-xs text-muted-foreground font-medium">🇬🇪 ქართული</span>
          <Component
            value={value.ka}
            onChange={(e: any) => onChange({ ...value, ka: e.target.value })}
            maxLength={maxLength}
            {...(multiline ? { rows } : {})}
            className="mt-1 font-georgian"
            placeholder={placeholder ? `${placeholder} (KA)` : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default BilingualField;
