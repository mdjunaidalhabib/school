import Dashboarda from "./src/Dashboard1/page";
import Allstudents from "./students/page";
import "./globals.css";

export default function HomePage() {
  return (
    <div>
      <Dashboarda />
      <h1> new dashboard </h1>
      <Allstudents />
    </div>
  );
}
