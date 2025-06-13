import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../stores/useAuth";

export default function Index() {
  const { isLoggedIn, checkLogin } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkLogin();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return null;

  return (
    <Redirect href={isLoggedIn ? "/(tabs)/homeScreen" : "/(auth)/login"} />
  );
}
