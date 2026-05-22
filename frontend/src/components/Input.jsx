function Input({ placeholder, value, onChange, name, type = "text", ...rest }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}

export default Input;