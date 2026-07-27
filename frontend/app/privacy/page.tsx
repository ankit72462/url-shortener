import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LinkSnap",
  description: "Learn how LinkSnap collects, uses, and protects your data. Our privacy policy covers cookies, advertising, and your rights.",
};

export default function PrivacyPage() {
  return (
    <div className="legal-page fade-in-up">
      <h1 className="text-gradient">Privacy Policy</h1>
      <p className="last-updated">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to LinkSnap (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy
        and ensuring the security of your personal information. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you visit our website and use our URL shortening service.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Account Information:</strong> When you create an account, we collect your username, email address, and encrypted password.</li>
        <li><strong>Usage Data:</strong> We automatically collect information about how you use our service, including URLs shortened, click analytics, IP addresses, browser type, and device information.</li>
        <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience and serve personalized advertisements.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide, maintain, and improve our URL shortening service</li>
        <li>Process your account registration and manage your account</li>
        <li>Analyze usage patterns and generate analytics reports</li>
        <li>Detect, prevent, and address technical issues and abuse</li>
        <li>Display personalized advertisements through Google AdSense</li>
        <li>Communicate with you about service updates and changes</li>
      </ul>

      <h2>4. Google AdSense & Advertising</h2>
      <p>
        We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve
        ads based on your prior visits to our website and other websites on the internet.
      </p>
      <ul>
        <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.</li>
        <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
        <li>You can also opt out of third-party vendor cookies by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</li>
      </ul>

      <h2>5. Cookies</h2>
      <p>
        We use cookies for the following purposes:
      </p>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the basic functionality of our service (authentication, session management).</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website.</li>
        <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve relevant advertisements.</li>
      </ul>
      <p>
        You can control cookie preferences through our cookie consent banner or your browser settings.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data, including:
      </p>
      <ul>
        <li>Encrypted password storage using bcrypt hashing</li>
        <li>JWT-based authentication with token expiration</li>
        <li>Rate limiting to prevent abuse</li>
        <li>HTTPS encryption for all data transmission</li>
        <li>Content Security Policy (CSP) headers</li>
      </ul>

      <h2>7. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is active or as needed to provide you our services.
        You may request deletion of your account and associated data at any time by contacting us.
      </p>

      <h2>8. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal information</li>
        <li>Opt out of personalized advertising</li>
        <li>Withdraw consent for cookie usage</li>
        <li>Request a copy of your data in a portable format</li>
      </ul>

      <h2>9. Third-Party Services</h2>
      <p>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices
        of these external sites. We encourage you to review their privacy policies.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
        new policy on this page and updating the &quot;Last Updated&quot; date.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us through our website.
      </p>
    </div>
  );
}
