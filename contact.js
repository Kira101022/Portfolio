

const EMAILJS_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY",
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
};

const FALLBACK_EMAIL = "santosshakira699@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const button = form.querySelector("button[type='submit']");
  const originalLabel = button.textContent;

  const status = document.createElement("p");
  status.className = "form-status mono";
  status.setAttribute("role", "status");
  status.style.cssText = "font-size:0.85rem;min-height:1.2em;margin:0;";
  form.appendChild(status);

  const setStatus = (text, ok) => {
    status.textContent = text;
    status.style.color = ok ? "#4ade80" : "var(--accent-red)";
  };

  const isConfigured = () =>
    Object.values(EMAILJS_CONFIG).every((v) => v && !v.startsWith("YOUR_"));

  const mailtoFallback = (name, email, message) => {
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${FALLBACK_EMAIL}&su=${subject}&body=${body}`;
    const win = window.open(gmailUrl, "_blank", "noopener");
    if (!win) {
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus("Please fill in every field.", false);
      return;
    }

    if (!isConfigured()) {
      setStatus("Opening Gmail with your message…", true);
      mailtoFallback(name, email, message);
      return;
    }

    button.disabled = true;
    button.textContent = "Sending…";
    setStatus("", true);

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.serviceId,
          template_id: EMAILJS_CONFIG.templateId,
          user_id: EMAILJS_CONFIG.publicKey,
          template_params: {
            from_name: name,
            reply_to: email,
            message: message,
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      form.reset();
      setStatus("Message sent! I'll get back to you soon.", true);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus(
        `Couldn't send right now. Email me directly at ${FALLBACK_EMAIL}.`,
        false
      );
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
});