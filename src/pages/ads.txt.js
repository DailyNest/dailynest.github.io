import { GOOGLE_CONFIG } from "@/utils/google-config";

export async function GET() {
  const adsTxtContent = `google.com, pub-${GOOGLE_CONFIG.ADSENSE_CLIENT_ID.replace('ca-pub-', '')}, DIRECT, f08c47fec0942fa0
`;

  return new Response(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}