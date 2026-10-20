

const RECIPIENT_EMAIL = "santosshakira699@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.createElement("p");
  status.className = "form-status mono";
  status.setAttribute("role", "status");
  form.appendChild(status);

  const setStatus = (text, ok) => {
    status.textContent = text;
    status.classList.toggle("error", !ok);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.namedItem("name").value.trim();
    const email = form.elements.namedItem("email").value.trim();
    const message = form.elements.namedItem("message").value.trim();

    if (!name || !email || !message) {
      setStatus("Please fill in every field.", false);
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}` +
      `&su=${subject}&body=${body}`;

    const win = window.open(gmailUrl, "_blank");

    if (win) {
      win.opener = null; 
      setStatus("Gmail opened in a new tab. Press Send there to finish.", true);
    } else {

      status.classList.remove("error");
      status.textContent = "Your browser blocked the new tab. ";
      const link = document.createElement("a");
      link.href = gmailUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Click here to open Gmail.";
      status.appendChild(link);
    }
  });
});