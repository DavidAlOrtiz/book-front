import { http } from "./http";
import type { Book, Category, FavoriteResponse, PageResponse } from "../types";

export const booksApi = {
  search: (params: { categoryId?: number; title?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", String(params.categoryId));
    if (params.title) query.set("title", params.title);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 6));
    return http<PageResponse<Book>>(`/book?${query}`);
  },
  categories: () => http<Category[]>("/categories"),
  favorites: () => http<FavoriteResponse[]>("/favorites"),
  addFavorite: (bookId: number) => http<void>(`/favorites/${bookId}`, { method: "PUT" }),
  removeFavorite: (bookId: number) => http<void>(`/favorites/${bookId}`, { method: "DELETE" }),
};