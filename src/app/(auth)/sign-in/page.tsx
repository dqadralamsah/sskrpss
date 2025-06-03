import FormSignIn from '@/components/auth/form-sign-in';

const SignInPage = () => {
  return (
    <div className=" p-8 space-y-8">
      <div>
        <h1 className=" text-center text-3xl font-extrabold">Welcome Back!</h1>
        <h3 className=" text-center text-sm font-normal">
          We missed you! please enter your details
        </h3>
      </div>
      <FormSignIn />
    </div>
  );
};

export default SignInPage;
