import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const ChatPage = ({ room, setRoom }) => {
  const [messages, setMessages] = useState();
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");

  console.log(messages);

  const mainRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    console.log(e.target[0].value);

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
    setVisible(false);
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
        tempMsg.push({ ...doc.data(), id: doc.id });
      });
      setMessages(tempMsg);
    });
  }, []);

  useEffect(() => {
    if (messages) {
      mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDelete = async (message) => {
    const messageRef = doc(db, "message", message);

    await deleteDoc(messageRef).then((res) => console.log(res));
  };

  return (
    <div className="chat-page">
      <header>
        <p>{auth?.currentUser?.displayName}</p>
        <p>{room}</p>
        <button onClick={() => setRoom(null)}>Farklı Oda</button>
      </header>
      <main ref={mainRef}>
        {messages?.map((data, i) => (
          <Message handleDelete={handleDelete} data={data} key={i} />
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
              setInput(input + e.native);
            }}
          />
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default ChatPage;
