import { auth } from '@/lib/auth';

export default async function AdminPage() {
  const session = await auth();

  return (
    <div className=" p-4">
      <h1>Hallo Ini Halaman Admin</h1>
      <h2 className=" text-xl">
        Welcome Back: <span className=" font-bold">{session?.user?.name}</span>
      </h2>
      <br />
      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
