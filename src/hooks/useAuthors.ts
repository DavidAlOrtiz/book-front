import { useEffect, useState } from "react";
import { booksApi } from "../api/books";
import type { Author } from "../types";

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    booksApi.authors().then(setAuthors).catch(() => setAuthors([]));
  }, []);

  return authors;
}