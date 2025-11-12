import * as React from "react";

interface EmailTemplateProps {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
}

export function EmailTemplate({
  firstname,
  lastname,
  email,
  message,
}: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#157A4E",
          padding: "20px",
          borderRadius: "8px 8px 0 0",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            margin: "0",
            fontSize: "24px",
          }}
        >
          New Contact Form Submission
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "8px",
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              textTransform: "uppercase",
              margin: "0 0 5px 0",
              fontWeight: "bold",
            }}
          >
            From
          </p>
          <p
            style={{
              color: "#333",
              fontSize: "18px",
              margin: "0",
              fontWeight: "bold",
            }}
          >
            {firstname} {lastname}
          </p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              textTransform: "uppercase",
              margin: "0 0 5px 0",
              fontWeight: "bold",
            }}
          >
            Email
          </p>
          <p
            style={{
              color: "#157A4E",
              fontSize: "16px",
              margin: "0",
            }}
          >
            <a
              href={`mailto:${email}`}
              style={{ color: "#157A4E", textDecoration: "none" }}
            >
              {email}
            </a>
          </p>
        </div>

        {/* Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e0e0e0",
            margin: "20px 0",
          }}
        />

        {/* Message */}
        <div>
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              textTransform: "uppercase",
              margin: "0 0 10px 0",
              fontWeight: "bold",
            }}
          >
            Message
          </p>
          <p
            style={{
              color: "#333",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#999",
          fontSize: "12px",
        }}
      >
        <p style={{ margin: "0" }}>
          This email was sent from the LJM Memorial Hospice contact form
        </p>
      </div>
    </div>
  );
}
