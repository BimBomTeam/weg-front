const BossFightButton = ({ text, onClick }) => {
  const onHandleClick = () => {
    onClick(text);
  };

  return (
    <button className="answer" onClick={onHandleClick}>
      {text}
    </button>
  );
};

export default BossFightButton;
