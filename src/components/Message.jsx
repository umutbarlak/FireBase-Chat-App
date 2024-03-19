import { auth } from "../firebase/config";

const Message = ({ data }) => {
  if (auth.currentUser?.uid === data.author.id) {
    return <div className="msg-user">{data.text}</div>;
  }

  return (
    <div className="msg-other">
      <p className="other-info">
        <img src={data.author.photo} />
        <span>{data.author.name}</span>
      </p>
      <p className="other-text">{data.text}</p>
    </div>
  );
};

export default Message;
