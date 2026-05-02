export const submitLead = async ({ context }) => {
  const targetBook = context.books.find((book) => book.id === context.selectedBookId);
  const payload = {
    full_name: context.formValues.fullName ?? "",
    email: context.formValues.email ?? "",
    book_id: context.selectedBookId ?? "none",
    book_title: targetBook?.title ?? "General Interest",
    pace: context.pace,
    notes: context.formValues.paceNotes ?? "",
  };

  const response = await fetch(`/api/leads/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to save lead");
  }

  return response.json();
};
