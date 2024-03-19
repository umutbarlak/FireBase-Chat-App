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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const ChatPage = ({ room, setRoom }) => {
  const [messages, setMessages] = useState();
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");

  const text = "";

  const sendMessage = async (e) => {
    e.preventDefault();

    console.log(input);

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

    setInput("");
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
        <div>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            required
            placeholder="mesajınızı yazınız"
          />
          <button
            onClick={() => {
              setVisible(!visible);
            }}
            type="button"
          >
            <img width={30} src="/emo.png" />
          </button>
        </div>

        <div className={visible ? "visib" : "in-visib"}>
          <Picker
            data={data}
            previewPosition="none"
            onEmojiSelect={(e) => {
              console.log(e);
              setInput(input + e.native);
              setVisible(!visible);
            }}
          />
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default ChatPage;
