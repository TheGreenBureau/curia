import { useState } from "react";

type UseTextboxOpts = {
  onChangeMutator?: (value: string) => void;
  onBlurMutator?: (value: string) => void;
};

type UseTextboxProps = {
  initialValue?: string | null;
  opts?: UseTextboxOpts;
};

export function useTextbox({ initialValue, opts }: UseTextboxProps) {
  const { onChangeMutator, onBlurMutator } = opts;
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
