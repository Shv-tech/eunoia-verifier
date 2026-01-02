// app/login/page.tsx
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6">
        <h1 className="text-xl font-medium">Sign in</h1>

        <form className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-md px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md text-sm"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
