import { useState } from "react";

type UseTextboxProps = {
  initialValue?: string | null;
  onChangeMutator?: (value: string) => void;
  onBlurMutator?: (value: string) => void;
};

export function useTextbox({
  initialValue,
  onChangeMutator,
  onBlurMutator,
}: UseTextboxProps) {
  const [text, setText] = useState(initialValue ?? "");

  const handleChange = (value: string) => {
    setText(value);
    if (onChangeMutator) {
      onChangeMutator(value);
    }
  };

  const handleBlur = (value: string) => {
    if (onBlurMutator) {
      onBlurMutator(value);
    }
  };

  const setValue = (value: string) => {
    setText(value);
  };

  return { text, handleChange, handleBlur, setValue };
}
