import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backend_idl } from "../../declarations/masy-net-backend/masy-net-backend.did.js";
import canisterIds from "../../../.dfx/local/canister_ids.json"; 

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

export const createBackendActor = (identity) => createActor(identity);
