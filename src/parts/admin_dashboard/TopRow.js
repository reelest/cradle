import Spacer from "@/components/Spacer";
import Row from "@/components/Row";
import { useUser } from "@/logic/api";
import { ProfilePic } from "@/components//ProfilePic";
import { SearchInput } from "@/components/SearchInput";

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

export default TopRow;
