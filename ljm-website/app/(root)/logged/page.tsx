import { logout } from "@/actions/users";
import { createClient } from "@/app/utils/server";
import { getUser } from "@/app/utils/server";
import { Button } from "@/components/ui/button";
import React from "react";

export default async function page() {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("volunteer_form")
    .select("status")
    .eq("id", user?.id)
    .single();
  console.log(data);
  return (
    <div>
      <p>user is logged in with id: {user?.id}</p>
      <Button onClick={logout}>log Out</Button>

      <div>{data?.status}</div>
      <div>{error?.message}</div>
    </div>
  );
}
