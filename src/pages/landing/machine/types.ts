export interface Book {
  id: string;
  title: string;
  tagline: string;
  summary: string;
}

export interface Shard {
  id: string;
  token: string;
  status: "loading" | "valid" | "expired";
}

export interface LandingContext {
  books: Book[];
  pace: string;
  formValues: Record<string, string | undefined>;
  selectedBookId?: string;
  shard: Shard | null;
}

export type LandingEvent =
  | { type: "UPDATE_FIELD"; field: string; value: string }
  | { type: "SET_BOOK"; bookId: string }
  | { type: "SET_PACE"; pace: string }
  | { type: "OPEN_DIALOG" }
  | { type: "CLOSE_DIALOG" }
  | { type: "SUBMIT" }
  | { type: "RETRY" }
  | { type: "RESET_FORM" }
  | { type: "VIEW_SHARD" }
  | { type: "CLOSE_SHARD" };
