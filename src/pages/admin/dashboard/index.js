import BottomRow from "./BottomRow";
import FirstRow from "./FirstRow";
import MiddleRow from "./MiddleRow";
import TopRow from "./TopRow";

const MainView = () => {
  return (
    <div className="px-4 py-16 sm:px-8">
      <TopRow />
      <FirstRow />
      <MiddleRow />
      <BottomRow />
    </div>
  );
};

export default MainView;
