import { useState } from "react";
import { Option } from "@/types/data/options";

type UseDropdownProps = {
  initialValue?: Option | null;
  onChangeMutator?: (value: string) => void;
  onBlurMutator?: (selection: Option) => void;
  allowCustomText?: boolean;
};

export function useDropdown({
  initialValue,
  onChangeMutator,
  onBlurMutator,
  allowCustomText,
}: UseDropdownProps) {
  const [selected, setSelected] = useState<Option | null>(initialValue ?? null);
  const [text, setText] = useState(initialValue ? initialValue.label : "");

  const handleChange = (value: string) => {
    setText(value);

    if (onChangeMutator) {
      onChangeMutator(value);
    }
  };

  const handleBlur = (selection: Option | null | undefined) => {
    if (allowCustomText && !selection) {
      if (selected && text === selected.label) {
        return;
      }

      const customSelection: Option = {
        value: text,
        label: text,
      };

      setSelected(customSelection);
      onBlurMutator(customSelection);
      return;
    }

    if (selection && (!selected || selection.value !== selected.value)) {
      setSelected(selection);
      setText(selection.label);
      onBlurMutator(selection);
      return;
    }

    if (selected && !allowCustomText) {
      setText(selected.label);
    }
  };

  const setValue = (newValue: Option | null) => {
    setSelected(newValue);
    setText(newValue ? newValue.label : "");
  };

  return { selected, text, handleChange, handleBlur, setValue };
}
