import Spacer from "@/components/Spacer";
import TextInput, { TextInputDecor } from "@/components/TextInput";
import Image from "next/image";
import Row from "../../../components/Row";
import { useUser } from "@/logic/api";
import searchIcon from "../assets/search.svg";

const TopRow = () => {
  const user = useUser();
  return (
    <Row className="px-8 justify-between">
      <div>
        <p className="font-20">{`Hi ${user?.name}`}</p>
        <h1 className="font-36b">Welcome back, Admin</h1>
      </div>
      <Spacer />
      <div>
        <SearchInput />
        <ProfilePic />
      </div>
    </Row>
  );
};

export function ProfilePic() {
  const user = useUser();
  return (
    <Image
      placeholder="empty"
      src={user?.photoURL}
      width={56}
      height={56}
      alt="user photo"
      className="inline-block rounded-full"
    />
  );
}

export function SearchInput(props) {
  return (
    <TextInputDecor
      className="inline-block my-2 mx-8 w-96"
      startIcon={
        <Image src={searchIcon} alt="" className="mx-6 object-contain" />
      }
    >
      <TextInput placeholder="Search" variant="search" className="pl-14 pr-6" />
    </TextInputDecor>
  );
}

export default TopRow;
