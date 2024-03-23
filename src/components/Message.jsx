import { auth } from "../firebase/config";

const Message = ({ data, handleDelete }) => {
  if (auth.currentUser?.uid === data.author.id) {
    return (
      <div className="msg-user">
        <button onClick={() => handleDelete(data.id)}>Sil</button>
        <span>{data.text}</span>
      </div>
    );
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
