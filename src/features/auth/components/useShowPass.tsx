import { useState } from "react";

export function useShowPass() {
  const [isPass, setPass] = useState(true);

  const handlePass = () => {
    setPass((prev) => !prev);
  };

  const type = isPass ? "password" : "text";

  return { isPass, handlePass, type };
}
