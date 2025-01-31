'use clinent'
import { useSession } from "next-auth/react";

const useUser = () => {
  const { data: session, status } = useSession();
  
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const accessToken = isAuthenticated ? session?.user?.access_token : null;
  const user = isAuthenticated ? session?.user : null
  return { accessToken, user, isLoading, isAuthenticated };
};

export default useUser;
