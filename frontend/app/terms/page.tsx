import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — LinkSnap",
  description: "Read the terms and conditions governing your use of LinkSnap URL shortening service.",
};

export default function TermsPage() {
  return (
    <div className="legal-page fade-in-up">
      <h1 className="text-gradient">Terms of Service</h1>
      <p className="last-updated">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using LinkSnap (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
        If you do not agree to these terms, please do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        LinkSnap provides a URL shortening service that allows users to create shortened versions of long URLs.
        The Service includes features such as custom aliases, password protection, QR code generation, and click analytics.
      </p>

      <h2>3. User Accounts</h2>
      <ul>
        <li>You may create an account to access additional features such as custom aliases, analytics, and link management.</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You must provide accurate and complete information during registration.</li>
        <li>You must be at least 13 years old to create an account.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree NOT to use LinkSnap to:</p>
      <ul>
        <li>Shorten URLs that lead to malicious, illegal, or harmful content</li>
        <li>Distribute spam, phishing attempts, or malware</li>
        <li>Violate any applicable local, state, national, or international law</li>
        <li>Infringe on the intellectual property rights of others</li>
        <li>Attempt to manipulate click statistics or analytics</li>
        <li>Circumvent rate limits or abuse the Service</li>
      </ul>

      <h2>5. Rate Limits</h2>
      <p>
        Anonymous users are limited to 10 URL shortenings per 12-hour period.
        Registered users enjoy unlimited URL creation. We reserve the right to modify these limits at any time.
      </p>

      <h2>6. Content & Links</h2>
      <p>
        We do not control or monitor the content of URLs shortened through our Service.
        However, we reserve the right to deactivate or remove any shortened link that violates these Terms
        or is reported as abusive.
      </p>

      <h2>7. Advertisements</h2>
      <p>
        The Service displays advertisements through Google AdSense. By using LinkSnap, you acknowledge that
        advertisements will be displayed alongside the Service content. We are not responsible for the content
        of third-party advertisements.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        The LinkSnap name, logo, design, and associated content are the intellectual property of LinkSnap.
        You may not reproduce, modify, or distribute our branding without written permission.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
        either express or implied. We do not guarantee that the Service will be uninterrupted, error-free,
        or secure at all times.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, LinkSnap shall not be liable for any indirect, incidental,
        special, consequential, or punitive damages arising out of or related to your use of the Service.
      </p>

      <h2>11. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account at any time for violation of these Terms.
        Upon termination, your right to use the Service will immediately cease.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after changes constitutes
        acceptance of the modified Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us through our website.
      </p>
    </div>
  );
}
