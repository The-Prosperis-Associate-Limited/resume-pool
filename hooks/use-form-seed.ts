import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReset } from "react-hook-form";

// Seeds once: a refetch after a side upload (photo, CV) must not wipe what the candidate has typed but not saved.
export const useFormSeed = function <TSource, TValues extends FieldValues>(
  source: TSource | undefined,
  reset: UseFormReset<TValues>,
  toValues: (source: TSource) => TValues,
) {
  const seeded = useRef(false);
  const mapper = useRef(toValues);

  useEffect(() => {
    if (!source || seeded.current) return;
    seeded.current = true;
    reset(mapper.current(source));
  }, [source, reset]);
};
