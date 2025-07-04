import { auth } from '@/lib/auth';

export default async function PurchasingPage() {
  const session = await auth();

  return (
    <>
      <h1>Hallo Ini Halaman Purchasing</h1>
      <h2 className=" text-xl">
        Welcome Back: <span className=" font-bold">{session?.user?.name}</span>
      </h2>
      <br />
      <p>{JSON.stringify(session)}</p>
    </>
  );
}
