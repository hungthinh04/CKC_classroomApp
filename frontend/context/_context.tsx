import { createContext, useContext } from "react";
import { useLocalSearchParams } from "expo-router";

const LopHocPhanContext = createContext<{ id: string; tenLHP?: string } | null>(null);

export function LopHocPhanProvider({ children }: { children: React.ReactNode }) {
  const { id, tenLHP } = useLocalSearchParams<{ id: string; tenLHP?: string }>();
  return (
    <LopHocPhanContext.Provider value={{ id: id || "", tenLHP }}>
      {children}
    </LopHocPhanContext.Provider>
  );
}

export function useLopHocPhan() {
  const ctx = useContext(LopHocPhanContext);
  if (!ctx) throw new Error("useLopHocPhan must be used inside LopHocPhanProvider");
  return ctx;
}
