export const metadata = {
  title: "Contact",
  description: "Get a fast scaffolding quote or book a site survey."
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="mb-6 text-gray-700">
        Email <a className="underline" href="mailto:quotes@yourdomain.co.uk">quotes@yourdomain.co.uk</a> or call <a className="underline" href="tel:0000000000">0000 000 000</a>,
        or send us your brief, drawings and photos via the form below.
      </p>

      <form className="grid gap-4 max-w-xl" action="/api/contact" method="post">
        <label className="grid gap-2">
          <span className="text-sm text-gray-700">Name</span>
          <input name="name" className="border rounded-lg p-2" required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-700">Email</span>
          <input name="email" type="email" className="border rounded-lg p-2" required />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-700">Phone</span>
          <input name="phone" type="tel" className="border rounded-lg p-2" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-gray-700">Project details</span>
          <textarea name="message" rows={6} className="border rounded-lg p-2" required />
        </label>
        <button type="submit" className="px-4 py-2 rounded-xl shadow hover:shadow-md transition bg-black text-white">
          Send
        </button>
      </form>

      <p className="mt-6 text-xs text-gray-500">This is a static form. Wire it to a Server Action or API route.</p>
    </main>
  );
}
