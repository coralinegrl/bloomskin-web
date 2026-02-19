import brevo from "@getbrevo/brevo";
import { env } from "../config/env.js";

let transactionalApi = null;

function getApi() {
  if (transactionalApi) {
    return transactionalApi;
  }

  if (!env.brevoApiKey) {
    throw new Error("BREVO_API_KEY is missing");
  }

  const defaultClient = brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = env.brevoApiKey;

  transactionalApi = new brevo.TransactionalEmailsApi();
  return transactionalApi;
}

export async function sendTransactionalEmail({ to, subject, htmlContent, textContent }) {
  if (!env.brevoSenderEmail) {
    throw new Error("BREVO_SENDER_EMAIL is missing");
  }

  const api = getApi();

  return api.sendTransacEmail({
    sender: {
      name: env.brevoSenderName,
      email: env.brevoSenderEmail,
    },
    to: [{ email: to }],
    subject,
    htmlContent,
    textContent,
  });
}
