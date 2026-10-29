import { useCallback, useEffect, useState } from "react";
import { booksApi } from "../api/books";
import { useAuth } from "../auth/AuthContext";
import type { Book } from "../types";

export function useFavorites() {
  const { authenticated } = useAuth();
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!authenticated) {
      setFavorites([]);
      return;
    }
    try {
      const list = await booksApi.favorites();
      setFavorites(list.map((f) => f.book));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar favoritos");
    }
  }, [authenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = useCallback(
    (bookId: number) => favorites.some((b) => b.id === bookId),
    [favorites],
  );

  const toggle = useCallback(
    async (book: Book) => {
      setError(null);
      const wasFavorite = favorites.some((b) => b.id === book.id);

      setFavorites((prev) =>
        wasFavorite ? prev.filter((b) => b.id !== book.id) : [book, ...prev],
      );

      try {
        if (wasFavorite) await booksApi.removeFavorite(book.id);
        else await booksApi.addFavorite(book.id);
      } catch (e) {
        setFavorites((prev) =>
          wasFavorite ? [book, ...prev] : prev.filter((b) => b.id !== book.id),
        );
        setError(e instanceof Error ? e.message : "No se pudo actualizar el favorito");
      }
    },
    [favorites],
  );

  return { favorites, isFavorite, toggle, error, refresh };
}