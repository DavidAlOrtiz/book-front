import { useCallback, useEffect, useRef, useState } from "react";
import { booksApi } from "../api/books";
import type { Book } from "../types";

export function useBooks(categoryId?: number, title?: string) {
    
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0); 

  const load = useCallback(
    async (pageToLoad: number) => {
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const data = await booksApi.search({ categoryId, title, page: pageToLoad });
        if (id !== requestId.current) return;
        setBooks((prev) => (pageToLoad === 0 ? data.content : [...prev, ...data.content]));
        setPage(data.page);
        setLast(data.last);
      } catch (e) {
        if (id === requestId.current) {
          setError(e instanceof Error ? e.message : "Error al cargar los libros");
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [categoryId, title],
  );

  useEffect(() => {
    load(0);
  }, [load]);

  const loadMore = () => {
    if (!loading && !last) load(page + 1);
  };

  return { books, loading, error, hasMore: !last, loadMore };
}