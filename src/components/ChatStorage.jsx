// chatStorage.js
const STORAGE_KEY = "chat_messages";
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export const saveMessages = (messages) => {
  const item = {
    messages,
    expiry: new Date().getTime() + EXPIRATION_TIME,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
};

export const loadMessages = () => {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) return [];
  
  const { messages, expiry } = JSON.parse(item);
  if (new Date().getTime() > expiry) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
  return messages;
};