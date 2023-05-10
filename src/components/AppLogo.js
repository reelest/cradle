import appLogoSvg from "@/assets/app_logo.svg";
import Image from "next/image";
export default function AppLogo({ size }) {
  return <Image src={appLogoSvg} alt="App logo" width={size} />;
}
