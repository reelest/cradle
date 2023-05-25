import Head from "next/head";
import styles from "./login.module.css";
import loginBackground from "./assets/login_background_crop.png";
import url from "@/utils/url";
import AppLogo from "@/components/AppLogo";
import Link from "next/link";
import Spacer from "@/components/Spacer";
import TextInput from "@/components/TextInput";
import ThemedButton from "@/components/ThemedButton";
import TextButton from "@/components/TextButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import useFormHandler from "@/utils/useFormHandler";
import { useMedia } from "react-use";

import { forgotPasswordAPIUrl, doLogin, errorToUserString } from "@/logic/api";
import UserRedirect from "@/components/UserRedirect";
import Template from "@/components/Template";
import useBreakpoints from "@/utils/useBreakpoints";

export default function LoginPage() {
  const [forgotPasswordModalShown, setShowForgotPassword] = useState(false);
  return (
    <>
      <Head>
        <title>Cradle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Cradle Website" />
      </Head>
      <Header />
      <main className={"lg:px-16 md:px-8" + styles.main}>
        {/* The background image with padding*/}
        <div
          className="container bg-cover bg-center bg-no-repeat pt-12 px-6 md:px-20 mx-auto md:mt-8 lg:mt-16 sm:rounded-t-[3em]"
          style={{ backgroundImage: url(loginBackground.src) }}
        >
          <nav className="flex text-white items-center w-full">
            <AppLogo />
            <Spacer />
            <Links />
          </nav>
          <h1 className="font-64b text-white text-center mt-20 mb-10">
            Log In
          </h1>
          <p className="max-sm:hidden font-36 text-white text-center mb-10">
            Enter your login details to gain access to your portal
          </p>
          <div className="h-36 sm:h-72" />
        </div>
        <Waves className="container mx-auto -top-36 w-full h-36" />

        <div className=" relative -top-48 sm:top-[-26rem] sm:-mb-40">
          <p className="container px-8 sm:hidden font-36 text-center mb-10">
            Enter your login details to gain access to your portal
          </p>
          <LoginForm {...{ setShowForgotPassword }} />
        </div>
        {forgotPasswordModalShown ? (
          <PasswordModal
            open={forgotPasswordModalShown}
            onClose={setShowForgotPassword}
          />
        ) : null}
      </main>
      <Footer />
    </>
  );
}

function LoginForm({ setShowForgotPassword }) {
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState();
  const sm = useBreakpoints().sm;
  const form = useFormHandler({}, async (form) => {
    try {
      setEnabled(false);
      await doLogin(form);
      setError(false);
    } catch (e) {
      setEnabled(true);
      setError(errorToUserString(e.cause ?? e));
    }
  });

  return (
    <form
      method="post"
      {...form.form()}
      className={`${
        sm ? "card w-[32rem] lg:w-[45rem]" : "px-8"
      } mx-auto max-w-3xl flex items-center flex-col`}
    >
      <p className="font-20 text-secondary">{error}</p>
      <TextInput
        {...form.textInput("email", "email")}
        className="my-8"
        placeholder="User ID or Email"
      />
      <TextInput
        {...form.textInput("password", "password")}
        className="my-8"
        placeholder="Password"
      />
      <ThemedButton variant="large" disabled={!enabled} className="my-8" caret>
        Log in now
      </ThemedButton>
      <TextButton
        className="p-5"
        noSubmit
        onClick={() => setShowForgotPassword(true)}
      >
        Forgot password?
      </TextButton>
      <UserRedirect noAuth />
    </form>
  );
}

const PasswordModal = ({ open, onClose }) => {
  const [sent, setSent] = useState(false);
  const handler = useFormHandler({}, async (formData, form) => setSent(true));
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden={true} />
      <div
        className="fixed inset-0 flex items-center justify-center p-4 overflow-y-scroll"
        aria-hidden={true}
      >
        <Dialog.Panel
          as="form"
          action={forgotPasswordAPIUrl}
          method="post"
          {...handler.form()}
          className="card 2xl:w-5/12 lg:w-1/2 md:2/3 container mx-auto flex items-center flex-col"
        >
          {sent ? (
            <p className="font-20">
              Instructions to reset your password have been sent to your
              registered email
            </p>
          ) : (
            ""
          )}
          <Dialog.Title
            as="h1"
            className="text-primaryDark font-40b text-center mt-16 mb-2"
          >
            Forgot Password?
          </Dialog.Title>
          <Dialog.Description className="font-24 my-8 text-center">
            Enter your email below and we’ll send you a password link
          </Dialog.Description>
          <TextInput
            {...handler.textInput("email", "email")}
            className="mt-2 mb-8"
            placeholder="Email"
            type="email"
          ></TextInput>
          <ThemedButton variant="large" className="mt-6 mb-16" caret>
            Send
          </ThemedButton>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

function Waves(props) {
  return (
    <Template as="div" className="relative overflow-hidden" {...{ props }}>
      <div className="absolute -left-8 -right-8 top-0 bottom-0">
        {/* TODO: get the original background and replace this with waves*/}
        <div className="bg-white w-full md:w-1/2 lg:w-1/3 h-full rounded-t-[50%] float-left" />
        <div className="bg-white hidden md:block md:w-1/2 lg:w-1/3 h-full rounded-t-[50%] float-right" />
        <div className="bg-white w-full hidden lg:block lg:w-1/3 h-full rounded-t-[50%] float-right" />
      </div>
    </Template>
  );
}

const Links = () => {
  return (
    <div className="max-md:hidden">
      <Link className="mx-5 font-22b" href="/admissions">
        Admissions
      </Link>
      <Link className="mx-5 font-22b" href="/schools">
        Schools
      </Link>
      <Link className="mx-5 font-22b" href="/about">
        About
      </Link>
      <Link className="mx-5 font-22b" href="/contact-us">
        Contact Us
      </Link>
    </div>
  );
};
