import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useEffect, useState } from "react";
import Message from "../components/Message";

const ChatPage = ({ room, setRoom }) => {
  const [messages, setMessages] = useState();
  const sendMessage = async (e) => {
    e.preventDefault();

    const messageCol = collection(db, "message");

    await addDoc(messageCol, {
      text: e.target[0].value,
      room,
      author: {
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        photo: auth.currentUser.photoURL,
      },
      createAt: serverTimestamp(),
    });

    e.target.reset();
  };

  useEffect(() => {
    const messageCol = collection(db, "message");

    const q = query(
      messageCol,
      where("room", "==", room),
      orderBy("createAt", "asc")
    );

    onSnapshot(q, (snapshot) => {
      const tempMsg = [];
      snapshot.docs.forEach((doc) => {
        tempMsg.push(doc.data());
      });
      setMessages(tempMsg);
    });
  }, []);

  return (
    <div className="chat-page">
      <header>
        <p>{auth?.currentUser?.displayName}</p>
        <p>{room}</p>
        <button onClick={() => setRoom(null)}>Farklı Oda</button>
      </header>
      <main>
        {messages?.map((data, i) => (
          <Message data={data} key={i} />
        ))}
      </main>
      <form onSubmit={sendMessage}>
        <input type="text" required placeholder="mesajınızı yazınız" />
        <button>Gönder</button>
      </form>
    </div>
  );
};

export default ChatPage;
