import { getServerSession } from "next-auth";
import Admin from "../(components)/Admin";
import Login from "../(components)/Login";
import SessionProvider from "../(components)/SessionProvider";
import { authOptions } from "../api/auth/[...nextauth]/route";

type Props = {};

async function AdminPage({}: Props) {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <SessionProvider session={session}>
        {!session ? <Login /> : <Admin />}
      </SessionProvider>
    </div>
  );
}

export default AdminPage;
