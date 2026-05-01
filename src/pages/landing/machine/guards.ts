const hasValue = (value) => Boolean(value?.trim());

export const hasShardParams = () => {
  const params = new URLSearchParams(window.location.search);
  return params.has("shard") && params.has("token");
};

export const canSubmit = ({ context }) => {
  const formValues = context.formValues;
  return (
    hasValue(formValues.fullName) &&
    hasValue(formValues.email) &&
    Boolean(context.selectedBookId)
  );
};
