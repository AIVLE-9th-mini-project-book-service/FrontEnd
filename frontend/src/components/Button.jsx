function Button({ label, onClick, type = "button", ...rest }) {
  return (
    <button type={type} onClick={onClick} {...rest}>
      {label}
    </button>
  );
}

export default Button;
