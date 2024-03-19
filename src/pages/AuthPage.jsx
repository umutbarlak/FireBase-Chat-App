import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/config";

const AuthPage = ({ setIsAuth }) => {
  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      console.log(data.user);
      setIsAuth(true);

      localStorage.setItem("token", data.user.refreshToken);
    });
  };

  return (
    <div className="container">
      <div className="auth">
        <h1>Chat Odası</h1>
        <p>Devam Etmek için Giriş Yapın</p>
        <button onClick={handleClick}>
          <img src="/g-logo.png" />
          <span>Google ile Gir</span>
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
