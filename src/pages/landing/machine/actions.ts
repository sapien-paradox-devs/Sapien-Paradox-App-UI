import { assign } from "xstate";
import { fieldStructure } from "./fields";

const assignFieldValue = assign(({ context, event }) => {
  if (event.type !== "UPDATE_FIELD") return { formValues: context.formValues };

  const updatedFormValues = {
    ...context.formValues,
    [event.field]: event.value,
  };

  let selectedBookId = context.selectedBookId;
  if (event.field === "selectedBook") {
    selectedBookId = context.books.find((book) => book.title === event.value)?.id ?? selectedBookId;
  }

  return {
    formValues: updatedFormValues,
    selectedBookId,
  };
});

const assignSelectedBook = assign(({ context, event }) => {
  if (event.type !== "SET_BOOK") return {};
  return {
    selectedBookId: event.bookId,
    formValues: {
      ...context.formValues,
      selectedBook: context.books.find((b) => b.id === event.bookId)?.title ?? "",
    },
  };
});

const assignPace = assign(({ context, event }) => {
  if (event.type !== "SET_PACE") return { pace: context.pace };
  return { pace: event.pace };
});

const resetForm = assign(() => ({
  selectedBookId: undefined,
  formValues: {},
  pace: "steady",
}));

const logFormReady = ({ context }) => console.debug("Form layout ready:", fieldStructure(context));
const notifySuccess = () => console.info("Landing form submitted successfully");
const noop = () => undefined;

const assignShardFromUrl = assign(({ context }) => {
  const params = new URLSearchParams(window.location.search);
  return {
    shard: {
      id: params.get("shard") || "",
      token: params.get("token") || "",
      status: "loading" as const,
    },
  };
});

const assignShardValid = assign(({ context }) => ({
  shard: context.shard ? { ...context.shard, status: "valid" as const } : null,
}));

const assignShardExpired = assign(({ context }) => ({
  shard: context.shard ? { ...context.shard, status: "expired" as const } : null,
}));

const clearShardParams = assign(() => {
  window.history.replaceState({}, document.title, window.location.pathname);
  return { shard: null };
});

export const actions = {
  assignFieldValue,
  assignSelectedBook,
  assignPace,
  resetForm,
  logFormReady,
  notifySuccess,
  noop,
  assignShardFromUrl,
  assignShardValid,
  assignShardExpired,
  clearShardParams,
};
