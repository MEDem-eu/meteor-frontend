import Login from "../user/Login";

export default function LoginPage({ setToken, token, setProfile }) {
  return (
    <div className="login-page">
      <h1>Log In</h1>
      <Login setToken={setToken} token={token} setProfile={setProfile} />
    </div>
  );
}


