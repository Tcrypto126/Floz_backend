require("dotenv").config();
import { google } from 'googleapis';

export default async function sendEmail(oAuthToken: string, refreshToken: string, email: Array<string>, content: string): Promise<any> {
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  });
  oauth2Client.setCredentials({ access_token: oAuthToken, refresh_token: refreshToken });

  try {
    // Create Gmail API client
    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });

    const utf8Subject = `=?utf-8?B?${Buffer.from('Meeting Summary and Action Items').toString('base64')}?=`;
    const messageParts = [
      `To: ${email.join(', ')}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      content,
    ];
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Error sending email:', error?.code, error);
    // Check if the error is due to an expired token using getTokenInfo
    if (error?.code === 401 && error?.errors && error.errors?.length > 0 && error.errors[0]?.reason === 'authError') {
      // Check if the token is really expired using getTokenInfo
      const tokenInfo = await oauth2Client.getTokenInfo(oAuthToken);
      if (tokenInfo && tokenInfo.expiry_date && tokenInfo.expiry_date < Date.now()) {
        // Token is expired, refresh it
        const refreshedToken = await oauth2Client.getAccessToken();
        if (refreshedToken) {
          // Retry the email sending
          return sendEmail(refreshedToken.token || "", refreshToken, email, content);
        }
      }
    } else {
      throw error;
    }

  }
}
