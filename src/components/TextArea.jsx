function TextArea({ placeholder, value, onChange, name, rows = 4, ...rest }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      {...rest}
    />
  );
}

export default TextArea;