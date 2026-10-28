export interface Book {
  id: number;
  title: string;
  description: string | null;
  price: number;
  coverUrl: string | null;
  publishedYear: number | null;
  authorId: number;
  authorName: string;
  categoryId: number;
  categoryName: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
  bio: string | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface FavoriteResponse {
  book: Book;
  addedAt: string;
}