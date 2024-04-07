export type TProfile = {
  id: number;
  full_name: string;
  image: string;
  user: number;
  username: string;
}

type TMessage = {
  id: number;
  user: number;
  sender: number;
  sender_profile: TProfile;
  receiver: number;
  receiver_profile: TProfile;
  message: string;
  date: string;
}

interface AuthContextType {
  user: any; // Define the type for user object as per your requirement
  setUser: React.Dispatch<React.SetStateAction<any>>;
  authTokens: any; // Define the type for authTokens object as per your requirement
  setAuthTokens: React.Dispatch<React.SetStateAction<any>>;
  registerUser: (email: string, username: string, password: string, password2: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}
