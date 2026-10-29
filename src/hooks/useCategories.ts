import { useEffect, useState } from "react";
import { booksApi } from "../api/books";
import type { Category } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    booksApi.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return categories;
}