const RoomPage = ({ setRoom, setIsAuth }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const room = e.target[0].value;

    setRoom(room.toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} className="room-page">
      <h1>Chat Odası</h1>
      <p>Hangi Odaya Gireceksiniz</p>
      <input type="text" placeholder="ör:haftaiçi" />
      <button type="submit">Odaya Gir</button>
      <button
        onClick={() => {
          setIsAuth(false);
          localStorage.removeItem("token");
        }}
        type="button"
      >
        Çıkış Yap
      </button>
    </form>
  );
};

export default RoomPage;
