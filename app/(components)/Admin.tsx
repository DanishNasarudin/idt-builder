"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {};

function Admin({}: Props) {
  const { data: session } = useSession();
  const [allow, setAllow] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const securePage = async () => {
      if (session) {
        if (session?.user?.email === "danishaiman2000@gmail.com") {
          setAllow(1);
          setLoading(false);
        } else {
          setAllow(0);
          setLoading(false);
          signOut();
        }
      }
    };
    securePage();
  }, [session]);

  if (loading) {
    return (
      <h2 className="flex flex-col justify-center items-center h-[100vh] text-center">
        Loading...
      </h2>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] text-center">
      {allow === 1 ? (
        <div>
          <h1>Admin</h1>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Not Admin</h1>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
