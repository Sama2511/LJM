import userStatus, { logout } from "@/actions/users";
import { createClient } from "@/app/utils/server";
import { getUser } from "@/app/utils/server";
import { Button } from "@/components/ui/button";
import React from "react";

export default async function page() {
  const user = await getUser();
  // const { status, error } = await userStatus();
  return (
    <div className="h-screen">
      <p>user is logged in with id: {user?.id}</p>
      <Button onClick={logout}>log Out</Button>
      {/* {status && <div>{status}</div>} */}
    </div>
  );
}
