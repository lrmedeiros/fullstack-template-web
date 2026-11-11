import { useId, type InputHTMLAttributes } from "react";
import { Input, Textarea } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  name: string;
  hint?: string;
  /** Mensagens de erro do campo; a primeira é exibida. */
  errors?: string[];
  multiline?: boolean;
}

/**
 * Label + campo + dica + erro, com a acessibilidade ligada:
 * label associado por id, aria-invalid e aria-describedby apontando para
 * a dica e o erro, que são lidos pelo leitor de tela.
 */
export function FormField({ label, name, hint, errors, multiline, ...props }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const error = errors?.[0];
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          {...shared}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          required={props.required}
          maxLength={props.maxLength}
        />
      ) : (
        <Input {...shared} {...props} />
      )}
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
