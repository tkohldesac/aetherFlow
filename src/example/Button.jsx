const Button = (props) => {
  const {onClick, children, count} = props;
  return (<button {...props} onClick={count < 10 ? onClick : () => {}}>{children}</button>)
};

export default Button;