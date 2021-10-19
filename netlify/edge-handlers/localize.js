export function onRequest(event) {
    console.log(`Incoming request for ${event.requestMeta.headers.get("X-NF-City-Name")}`);
  }