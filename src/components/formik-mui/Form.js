import { L } from '../L';

export const Form = (props) => {
  const {
    formik,
    children,
    ...remainingProps
  } = props;

  return (
    <L.form
      onSubmit={ formik.handleSubmit }
      { ...remainingProps }
    >
      {children}
    </L.form>
  );
};