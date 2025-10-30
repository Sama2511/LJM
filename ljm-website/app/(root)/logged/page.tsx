import { logout } from "@/actions/users";
import { getUser } from "@/app/utils/server";
import { Button } from "@/components/ui/button";
import React from "react";

export default async function page() {
  const user = await getUser();
  return (
    <div>
      {user ? (
        <>
          <p>user is logged in </p>
          <Button onClick={logout}>log Out</Button>
        </>
      ) : (
        <p>the user isnt logged in </p>
      )}
    </div>
  );
}
