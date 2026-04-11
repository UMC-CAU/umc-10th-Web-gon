import { useState, useEffect } from 'react';

const useForm = ({ initialState, onSubmit, validate }) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (validate) {
      setErrors(validate(values));
    }
  }, [values, validate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (Object.keys(errors).length === 0) {
      await onSubmit(values);
    }
    setIsLoading(false);
  };

  return { values, errors, isLoading, handleChange, handleSubmit };
};

export default useForm;