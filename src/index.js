export default {
  async fetch(request, env) {
    if (request.method === "POST" && new URL(request.url).pathname === "/contact") {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};

async function handleContact(request, env) {
  try {
    const data = await request.formData();
    const name = data.get("name");
    const email = data.get("email");
    const phone = data.get("phone");
    const message = data.get("message");

    // Email to you
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "HAMM Solutions <noreply@hammsolutions.com>",
        to: "jdhamm17@hotmail.com",
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact from HAMM Solutions Website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br>${message}</p>
        `
      })
    });

    // Auto-reply to the person
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "HAMM Solutions <noreply@hammsolutions.com>",
        to: email,
        subject: "We received your message — HAMM Solutions",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for reaching out to HAMM Solutions! We've received your message and will get back to you as soon as possible.</p>
          <p>Here's a copy of what you sent:</p>
          <blockquote style="border-left:3px solid #C9A227; padding-left:1rem; color:#64748B;">
            ${message}
          </blockquote>
          <p>In the meantime, feel free to call us at <a href="tel:+17177362544">(717) 736-2544</a>.</p>
          <br>
          <p>— The HAMM Solutions Team</p>
          <p style="color:#64748B; font-size:0.85rem;">Helping Automation Mean More • Central Pennsylvania</p>
        `
      })
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}