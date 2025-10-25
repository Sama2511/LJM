import * as React from "react";

interface EmailTemplateProps {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
}

export function EmailTemplate({ firstname }: EmailTemplateProps) {
  return (
    <div>
      <h1>{firstname}!</h1>
    </div>
  );
}
