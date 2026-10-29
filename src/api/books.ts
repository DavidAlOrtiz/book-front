import { fetchBlob, http } from "./http";
import type { Author, Book, BookRequest, Category, FavoriteResponse, PageResponse } from "../types";

export const booksApi = {

  search: (params: { categoryId?: number; title?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params.categoryId) query.set("categoryId", String(params.categoryId));
    if (params.title) query.set("title", params.title);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 6));
    return http<PageResponse<Book>>(`/book?${query}`);
  },

  categories: () => http<Category[]>("/categorie"),
  getBook: (id: number) => http<Book>(`/book/${id}`),
  authors: () => http<Author[]>("/author"),

  favorites: () => http<FavoriteResponse[]>("/favorites"),

  addFavorite: (bookId: number) => http<void>(`/favorites/${bookId}`, { method: "PUT" }),

  removeFavorite: (bookId: number) => http<void>(`/favorites/${bookId}`, { method: "DELETE" }),

  createBook: (data: BookRequest) =>
    http<Book>("/book", { method: "POST", body: JSON.stringify(data) }),

  updateBook: (id: number, data: BookRequest) =>
    http<Book>(`/book/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteBook: (id: number) => http<void>(`/book/${id}`, { method: "DELETE" }),

  pdf: (id: number) => fetchBlob(`/book/${id}/pdf`),
};