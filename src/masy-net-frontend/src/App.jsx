import { useEffect, useState } from 'react';
import { AuthClient} from "@dfinity/auth-client";

function App() {
  const [principal, setPrincipal] = useState(null);

  async function handleLogin() {
  const authClient = await AuthClient.create();
  
  try {
    await authClient.login({
      identityProvider: 
        //  "https://identity.ic0.app", 
        `http://uxrrr-q7777-77774-qaaaq-cai.localhost:4943`,
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principalId = identity.getPrincipal().toText();
        setPrincipal(principalId);
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
  }
}

  

  return (
    <div style={{ padding: "20px"}}>
      <h1>Login Internet Identity</h1>
      {principal ? (
        <div>
          <p>Logged In</p>
          <code>{principal}</code>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>

    
  );

}

export default App;
