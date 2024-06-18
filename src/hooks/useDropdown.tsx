import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type UseDropdownOpts = {
  onChangeMutator?: (value: string) => void;
  onBlurMutator?: (selection: DropdownOption) => void;
  allowCustomText?: boolean;
};

type UseDropdownProps = {
  initialValue?: DropdownOption | null;
  opts?: UseDropdownOpts;
};

export function useDropdown({ initialValue, opts }: UseDropdownProps) {
  const { onChangeMutator, onBlurMutator, allowCustomText } = opts;

  const [selected, setSelected] = useState<DropdownOption | null>(
    initialValue ?? null
  );
  const [text, setText] = useState(initialValue ? initialValue.content : "");

  const handleChange = (value: string) => {
    setText(value);

    if (onChangeMutator) {
      onChangeMutator(value);
    }
  };

  const handleBlur = (selection: DropdownOption | null | undefined) => {
    if (allowCustomText && !selection) {
      if (selected && text === selected.content) {
        return;
      }

      const customSelection: DropdownOption = {
        id: text,
        content: text,
      };

      setSelected(customSelection);
      onBlurMutator(customSelection);
      return;
    }

    if (selection && (!selected || selection.id !== selected.id)) {
      setSelected(selection);
      setText(selection.content);
      onBlurMutator(selection);
      return;
    }

    if (selected && !allowCustomText) {
      setText(selected.content);
    }
  };

  const setValue = (newValue: DropdownOption | null) => {
    setSelected(newValue);
    setText(newValue ? newValue.content : "");
  };

  return { selected, text, handleChange, handleBlur, setValue };
}
