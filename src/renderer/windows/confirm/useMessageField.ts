import { useCallback, useState } from "react";

export const useMessageField = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsTouched(true);

    if (newValue.trim().length === 0) {
      setLocalError("Message is required");
    } else if (newValue.length < 3) {
      setLocalError("Message must be at least 3 characters");
    } else {
      setLocalError(null);
    }
  }, []);

  return {
    value,
    handleChange,
    isTouched,
    localError,
  };
};
