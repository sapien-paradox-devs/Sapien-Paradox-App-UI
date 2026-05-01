import { locale } from "../../../lib/locale";

export const fieldStructure = (context) => {
  const bookOptions = context.books.map((book) => book.title);

  return [
    {
      name: "fullName",
      label: locale("landingPage.signUp.fields.fullName.label"),
      type: "text",
      placeholder: locale("landingPage.signUp.fields.fullName.placeholder"),
    },
    {
      name: "email",
      label: locale("landingPage.signUp.fields.email.label"),
      type: "email",
      placeholder: locale("landingPage.signUp.fields.email.placeholder"),
    },
    {
      name: "selectedBook",
      label: locale("landingPage.signUp.fields.selectedBook.label"),
      type: "select",
      options: bookOptions,
      renderIf: () => bookOptions.length > 0,
    },
    {
      name: "paceNotes",
      label: locale("landingPage.signUp.fields.paceNotes.label"),
      type: "textarea",
      placeholder: locale("landingPage.signUp.fields.paceNotes.placeholder"),
      renderIf: (context) => Boolean(context.selectedBookId),
    },
  ];
};
