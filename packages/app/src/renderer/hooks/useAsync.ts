import { useCallback, useEffect, useState } from 'react';

export function useAsync<T>(
  callback: () => Promise<T>,
  dependencies: unknown[] = [],
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [value, setValue] = useState<T>();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value };
}
