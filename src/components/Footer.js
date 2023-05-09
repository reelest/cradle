import formatPhoneNumber from "@/utils/formatPhoneNumber";
import AppLogo from "./AppLogo";
import website from "@/logic/website_data";
import linkedInIcon from "@/assets/linkedIn.svg";
import facebookIcon from "@/assets/facebook.svg";
import twitterIcon from "@/assets/twitter.svg";
import Image from "next/image";

export default function Footer({ cradleHighDescription }) {
  return (
    <div className="bg-primaryDark text-white px-20">
      <div className="container flex mx-auto py-24 flex-wrap">
        <div className="mx-12 lg:mx-16 my-10 flex-grow basis-0 max-sm:w-full flex items-center flex-col text-center">
          <AppLogo size={240} />
          <p className="text-style-1 mt-12">{website.description}</p>
        </div>
        <div className="my-10 flex-grow basis-72 flex items-center">
          <div className="mx-12 lg:mx-16 flex-grow">
            <h2 className="border-l-8 border-primaryLight text-style-6 pl-4">
              Contact Information
            </h2>
            <h3 className="text-style-2 mt-6">Address:</h3>
            <p className="text-style-7">{website.address}</p>
            <h3 className="text-style-2 mt-6">Phone:</h3>
            <p className="text-style-7">
              {website.phone1Label} -{" "}
              <a href={`tel:${website.phone1}`}>
                {formatPhoneNumber(website.phone1)}
              </a>
            </p>
            <p className="text-style-7">
              {website.phone2Label} -{" "}
              <a href={`tel:${website.phone2}`}>
                {formatPhoneNumber(website.phone2)}
              </a>
            </p>
            <h3 className="text-style-2 mt-6">Email:</h3>
            <p className="text-style-7 underline">
              <a href={`mailto:${website.email}`}>{website.email}</a>
            </p>
          </div>
          <SocialBar />
        </div>
      </div>
    </div>
  );
}

const SocialBar = () => {
  return (
    <div className="social-bar p-6 rounded mx-12 lg:mx-16">
      <a href={website.linkedInURL} className="block h-12 w-12 mb-6">
        <Image className="object-contain" src={linkedInIcon} alt="linkedIn" />
      </a>
      <a href={website.facebookURL} className="block h-12 w-12 mb-6">
        <Image className="object-contain" src={facebookIcon} alt="facebook" />
      </a>
      <a href={website.twitterURL} className="block h-12 w-12">
        <Image className="object-contain" src={twitterIcon} alt="twitter" />
      </a>
    </div>
  );
};
