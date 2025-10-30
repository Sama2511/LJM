import * as React from "react";

interface EmailTemplateProps {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
}

export function EmailTemplate({
  firstname,
  message,
  lastname,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>{`${firstname}  ${lastname}`}!</h1>
      <p>{message}</p>
    </div>
  );
}
