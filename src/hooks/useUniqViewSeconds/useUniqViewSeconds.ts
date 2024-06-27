import { useCallback, useEffect, useState } from "react";

const baseURL = "https://664ac067a300e8795d42d1ff.mockapi.io/api/v1/numbers";

type UniqViewSecondsParams = {
  id: string;
  orderBy?: "ASC" | "DESC";
};

const useUniqViewSeconds = ({ id, orderBy = "ASC" }: UniqViewSecondsParams) => {
  const [uniqNumbers, setUniqNumbers] = useState<number[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState();

  const transformAscUniqNumbers = useCallback((numbers: number[]) => {
    const map: any = {};
    let result: number[] = [];
    numbers.forEach((n: number) => {
      if (!map[n]) {
        result.push(n);
        map[n] = true;
      }
    });

    return orderBy === "DESC"
      ? result.sort((a, b) => b - a)
      : result.sort((a, b) => a - b);
  }, [orderBy]);

  useEffect(() => {
    const fetchUniqViewNumbers = async () => {
      try {
        setFetching(true);
        const response = await fetch(`${baseURL}/${id}`);
        const result = await response.json();
        if (result && result.numbers) {
          const _uniqNumbers = transformAscUniqNumbers(result.numbers.flat());
          setUniqNumbers(_uniqNumbers);
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchUniqViewNumbers();
    }
  }, [id]);

  return { fetching, error, uniqNumbers };
};

export default useUniqViewSeconds;
