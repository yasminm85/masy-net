# Masy-net

[Masy-net] is a decentralized data storage application built on the Internet Computer Protocol (ICP) that also provides digital contract and employee position history. Users can securely log in using Internet Identity (II), a passwordless authentication system, to access its features.

**✨ Key Features**:
- 🔐 Passwordless Login via Internet Identity (II)
- 🚀 Add Employees and Create Digital Contract On-Chain Data Storage on the ICP
- 🤩 View Employees Position and Sign Contracts Tied to Employees

## 🛠️ Local Development Setup
### Prerequisites
Make sure you have:
- [Node.js](https://nodejs.org/) v20+
- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- npm

### Steps
1. **Clone the repo**
   ```bash
   git clone https://github.com/yasminm85/masy-net.git
   cd masy-net
2. **Install Frontend Dependencies**
  cd src/masy-net-frontend
  npm install
3. **Start Local IC**
  dfx start --background
4. **Deploy Canister**
  dfx deploy
5. **Run the Frontend**
  cd src/masy-net-frontend
  npm run dev

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm run dev
```

## ⚙️ Integration
If you want to integrate with backend canister directly:
1. **If you want to integrate with the backend canister directly:**
```bash
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backend_idl } from "../../declarations/masy-net-backend/masy-net-backend.did.js";
import canisterIds from "../../../.dfx/local/canister_ids.json"; 
```
2. **Create an Actor**
```bash
const network = process.env.DFX_NETWORK || "local";
const backendCanisterId = canisterIds["masy-net-backend"][network];

const host = network === "local" 
  ? "http://127.0.0.1:4943" 
  : "https://icp0.io";

export const createActor = async (identity) => {
  const agent = new HttpAgent({ identity, host });

  if (network === "local") {
    await agent.fetchRootKey(); 
  }

  return Actor.createActor(backend_idl, {
    agent,
    canisterId: backendCanisterId,
  });
};
```
3. **Call Backend Methods**
```bash
import { createBackendActor } from "../../utils/actorClient";
const actor = await createBackendActor(identity);
const list = await actor.listEmployees();
```
## 🤝 Contributing
Contributions are welcome
1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes with message
4. Push to your fork and open a pull request

## 👩🏻‍💻 Contributor
[@yasminm85](https://github.com/yasminm85)
[@enjltsr](https://github.com/enjltsr)
[@juwitafazh](https://github.com/juwitafazh)

