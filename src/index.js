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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "HAMM Solutions Contact Form <noreply@hammsolutions.com>",
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

    if (!res.ok) throw new Error("Resend error");

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