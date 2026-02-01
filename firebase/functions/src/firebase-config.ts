import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
   region: "europe-west2",
   maxInstances: 10,
   invoker: "public" // Allow all functions to be callable externally
});