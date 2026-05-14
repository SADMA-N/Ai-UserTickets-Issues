const KEY = "customer_id";

function randomHex(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, len);
}

export function getOrCreateCustomerId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `cust_${randomHex(8)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
