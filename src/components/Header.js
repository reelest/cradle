import { useAnnouncementsAPI } from "@/logic/api";
import RaisedButton from "./RaisedButton";
import Link from "next/link";

export default function Header({ showAnnouncements = true }) {
  const data = useAnnouncementsAPI();

  return (
    <header className="bg-primaryDark px-20">
      {showAnnouncements ? createHeader(data?.announcements?.[0]) : null}
    </header>
  );
}

const createHeader = (announcement) => {
  switch (announcement) {
    case "admission":
      return (
        <div
          className={`container mx-auto flex flex-wrap self-auto py-8 text-white items-center`}
        >
          <div className="text-style-1 my-2">
            ADMISSIONS ARE ONGOING! Register your kids for the entrance exams.
          </div>
          <div className="text-style-2 flex my-2 items-center justify-end flex-grow">
            <Link href="/portal">Portal</Link>
            <span className="border-l-2 border-white h-10 inline-block mx-4" />
            <RaisedButton variant="small">Register</RaisedButton>
          </div>
        </div>
      );
  }
};
