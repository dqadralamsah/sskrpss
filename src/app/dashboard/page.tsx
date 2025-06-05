import { auth } from '@/lib/auth';

const Dashboard = async () => {
  const session = await auth();

  return (
    <div className=" px-28 py-4">
      <h1 className=" text-2xl">Hallo This Is Dashboard</h1>
      <h2 className=" text-xl">
        Welcome Back: <span className=" font-bold">{session?.user?.name}</span>
      </h2>
      <br />
      <p>{JSON.stringify(session)}</p>
    </div>
  );
};

export default Dashboard;
