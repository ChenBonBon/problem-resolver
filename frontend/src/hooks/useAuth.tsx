export default function useAuth() {
  return window.localStorage.getItem("token");
}
